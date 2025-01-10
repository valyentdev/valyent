import Application from '#applications/database/models/application'
import { DeploymentStatus } from '#applications/database/models/deployment'
import DeploymentsService from '#applications/services/deployments_service'
import OctokitService from '#applications/services/octokit_service'
import User from '#common/database/models/user'
import env from '#start/env'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import type { EmitterWebhookEvent } from '@octokit/webhooks'

@inject()
export default class GitHubDeploymentsController {
  constructor(
    private octokitService: OctokitService,
    private deploymentsService: DeploymentsService
  ) {}

  async handleWebhooks(ctx: HttpContext) {
    const isValidEvent = await this.octokitService.checkOctokitEventIsValid(ctx.request)
    if (!isValidEvent) {
      return ctx.response.badRequest('Invalid event.')
    }

    const webhookType = ctx.request.header('X-GitHub-Event')
    switch (webhookType) {
      case 'push':
        return this.handleGithubPushWebhook(ctx)
      case 'installation':
        return this.handleGithubInstallationWebhook(ctx)
      default:
        return ctx.response.ok('Not handling this event.')
    }
  }

  private async handleGithubPushWebhook({ request, response }: HttpContext) {
    const pushEventPayload = request.body() as EmitterWebhookEvent<'push'>['payload']

    const githubRepository = `${pushEventPayload.repository.owner!.login}/${pushEventPayload.repository.name}`

    /**
     * Retrieve an application.
     */
    const application = await Application.query()
      .where('githubRepository', githubRepository)
      .andWhere('installationId', pushEventPayload.installation!.id)
      .first()
    if (!application) {
      return response.ok('Not handling this event')
    }
    await application.load('organization')

    /**
     * Check that the branch is matching.
     */
    if (pushEventPayload.ref.replace('refs/heads/', '') !== application.githubBranch) {
      return response.ok('Not handling this event')
    }

    /**
     * Download the commit, and save it to S3.
     */
    const downloadedCommit: ArrayBuffer = await this.octokitService.downloadCommit(
      pushEventPayload.installation!.id,
      pushEventPayload.repository.owner!.login,
      pushEventPayload.repository.name,
      pushEventPayload.after
    )

    const contents = Buffer.from(downloadedCommit)
    const fileName = `${application.organization.slug}/${application.name}.tar.gz`

    const s3Client = new S3Client({
      endpoint: env.get('S3_ENDPOINT'),
      region: env.get('S3_REGION'),
      credentials: {
        accessKeyId: env.get('S3_ACCESS_KEY_ID'),
        secretAccessKey: env.get('S3_SECRET_ACCESS_KEY'),
      },
    })

    await s3Client.send(
      new PutObjectCommand({
        Bucket: env.get('S3_BUCKET'),
        Key: fileName,
        Body: contents,
      })
    )

    /**
     * Mark the commit as "in progress" on GitHub.
     */
    const githubCheckId = await this.octokitService.markDeploying(pushEventPayload)

    /**
     * Save a new deployment record in the database.
     */
    const deployment = await application.related('deployments').create({
      origin: 'github',
      status: DeploymentStatus.Building,
      githubCheckId,
      fileName,
    })

    /**
     * Ignite builder machine.
     */
    await this.deploymentsService.igniteBuilder(deployment)

    return response.ok('Push event handled')
  }

  private async handleGithubInstallationWebhook({ request, response }: HttpContext) {
    const installationEventPayload =
      request.body() as EmitterWebhookEvent<'installation'>['payload']
    const githubId = installationEventPayload.sender.id
    const user = await User.findBy('githubId', githubId)
    if (user === null) {
      return response.ok('Not handling this event')
    }

    if (installationEventPayload.action === 'deleted') {
      const installationId = installationEventPayload.installation.id
      const index = user.githubInstallationIds.indexOf(installationId)
      if (index > -1) {
        user.githubInstallationIds.splice(index, 1)
      }
      await user.save()
      return response.ok('Not handling this event')
    }
    user.githubInstallationIds.push(installationEventPayload.installation.id)
    await user.save()

    return response.ok('Github installation handled')
  }
}
