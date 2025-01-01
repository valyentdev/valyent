import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import emitter from '@adonisjs/core/services/emitter'
import type { EmitterWebhookEvent } from '@octokit/webhooks'

@inject()
export default class GitHubDeploymentsController {
  constructor(private octokitService: OctokitService) {}

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

    const githubRepository = `${pushEventPayload.repository.owner.login}/${pushEventPayload.repository.name}`
    const application = await Application.findBy('githubRepository', githubRepository)
    if (!application) {
      return response.ok('Not handling this event')
    }
    if (pushEventPayload.ref.replace('refs/heads/', '') !== application.githubBranch) {
      return response.ok('Not handling this event')
    }

    const githubCheckId = await this.octokitService.markDeploying(pushEventPayload)

    await application.load('project', (query) => {
      query.preload('organization')
    })

    const downloadedCommit: ArrayBuffer = await this.octokitService.downloadCommit(
      pushEventPayload.installation!.id,
      pushEventPayload.repository.owner.login,
      pushEventPayload.repository.name,
      pushEventPayload.after
    )

    const contents = Buffer.from(downloadedCommit)
    await this.codeArchiveUploaderService.upload(application, contents)

    const deployment = await application.related('deployments').create({
      origin: 'github',
      status: DeploymentStatus.Building,
      commitSha: pushEventPayload.after,
      commitMessage: pushEventPayload.head_commit?.message,
      githubCheckId,
    })

    const driver = Driver.getDriver()
    await driver.deployments.igniteBuilder(
      application.project.organization,
      application.project,
      application,
      deployment
    )

    emitter.emit('deployments:created', [
      application.project.organization,
      application.project,
      application,
      deployment,
    ])

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
      emitter.emit(`github:installation:${user.id}`, user)
      return response.ok('Not handling this event')
    }
    user.githubInstallationIds.push(installationEventPayload.installation.id)
    emitter.emit(`github:installation:${user.id}`, user)
    await user.save()

    return response.ok('Github installation handled')
  }
}
