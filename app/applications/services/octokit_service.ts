import { App as OctokitApp } from 'octokit'
import type { EmitterWebhookEvent, EmitterWebhookEventName } from '@octokit/webhooks'
import env from '#start/env'
import type { Request } from '@adonisjs/core/http'
import {
  GithubRepositoriesRecord,
  GithubRepositoryOwner,
  GithubRepositoryOwnersRecord,
} from '#applications/types/github_repository'
import Application from '#applications/database/models/application'
import Deployment from '#applications/database/models/deployment'

export default class OctokitService {
  private readonly octokitApp: OctokitApp

  constructor() {
    this.octokitApp = new OctokitApp({
      appId: env.get('GITHUB_APP_ID')!,
      privateKey: env.get('GITHUB_APP_PRIVATE_KEY')!.replace(/\\n/g, '\n'),
      webhooks: { secret: env.get('GITHUB_APP_WEBHOOK_SECRET')! },
    })
  }

  public async checkOctokitEventIsValid(request: Request): Promise<boolean> {
    try {
      await this.octokitApp.webhooks.verifyAndReceive({
        id: request.header('X-GitHub-Delivery')!,
        name: request.header('X-GitHub-Event') as any,
        signature: request.header('X-Hub-Signature')!,
        payload: JSON.stringify(request.body()),
      })
      return true
    } catch {
      return false
    }
  }

  public async markDeploying(payload: EmitterWebhookEvent<'push'>['payload']): Promise<number> {
    try {
      const installation = await this.octokitApp.getInstallationOctokit(payload.installation!.id)
      const check = await installation.rest.checks.create({
        owner: payload.repository!.owner!.login,
        repo: payload.repository!.name,
        name: 'Software Citadel Deployment',
        description: 'Deploying application...',
        head_sha: payload.after,
        status: 'in_progress',
      })
      return check.data.id
    } catch (error) {
      return -1
    }
  }

  public async markSuccess(application: Application, deployment: Deployment): Promise<void> {
    try {
      const installation = await this.octokitApp.getInstallationOctokit(
        application.githubInstallationId!
      )

      await installation.rest.checks.update({
        owner: application.githubRepository!.split('/')[0],
        repo: application.githubRepository!.split('/')[1],
        check_run_id: deployment.githubCheckId!,
        status: 'completed',
        conclusion: 'success',
      })
    } catch {}
  }

  public async markFailure(application: Application, deployment: Deployment): Promise<void> {
    try {
      const installation = await this.octokitApp.getInstallationOctokit(
        application.githubInstallationId!
      )
      await installation.rest.checks.update({
        owner: application.githubRepository!.split('/')[0],
        repo: application.githubRepository!.split('/')[1],
        check_run_id: deployment.githubCheckId!,
        status: 'completed',
        conclusion: 'failure',
      })
    } catch {}
  }

  public checkOctokitEventIsOfType(request: Request, type: EmitterWebhookEventName): boolean {
    return request.header('X-GitHub-Event') === type
  }

  public async downloadCommit(
    installationId: number,
    owner: string,
    repo: string,
    ref: string
  ): Promise<ArrayBuffer> {
    const installation = await this.octokitApp.getInstallationOctokit(installationId)
    const result = await installation.rest.repos.downloadTarballArchive({
      owner,
      repo,
      ref,
    })

    return result.data as ArrayBuffer
  }

  public async listRepositoriesFromInstallations(githubInstallationIds?: number[]): Promise<{
    repos: GithubRepositoriesRecord
    owners: GithubRepositoryOwnersRecord
  }> {
    const repos: GithubRepositoriesRecord = {}
    const owners: Record<string, GithubRepositoryOwner> = {}

    for (const installationId of githubInstallationIds || []) {
      const installation = await this.octokitApp.getInstallationOctokit(installationId)

      let result: Awaited<
        ReturnType<typeof installation.rest.apps.listReposAccessibleToInstallation>
      >
      try {
        result = await installation.rest.apps.listReposAccessibleToInstallation({
          per_page: 1000,
        })
      } catch (error) {
        continue
      }

      if (!result.data.repositories) {
        continue
      }

      for (const repository of result.data.repositories) {
        const owner: GithubRepositoryOwner = {
          name: repository.owner.login,
          imageUrl: repository.owner.avatar_url,
          installationId,
        }
        const name = repository.name
        const isPrivate = repository.private
        const defaultBranch = repository.default_branch

        if (repos[owner.name]) {
          if (!repos[owner.name].repositories.find((r) => r.name === name)) {
            repos[owner.name].repositories.push({ name, isPrivate, defaultBranch })
          }
        } else {
          repos[owner.name] = {
            installationId,
            repositories: [{ name, isPrivate, defaultBranch }],
          }
        }

        if (!owners[owner.name]) {
          owners[owner.name] = owner
        }
      }

      for (const owner of Object.keys(repos)) {
        repos[owner].repositories = repos[owner].repositories.sort((a, b) =>
          a.name.localeCompare(b.name)
        )
      }
    }

    return { repos, owners }
  }

  public async getRepositoryBranches(
    githubInstallationId: number,
    githubRepository: string
  ): Promise<string[]> {
    try {
      const installation = await this.octokitApp.getInstallationOctokit(githubInstallationId)
      const branches = await installation.rest.repos.listBranches({
        owner: githubRepository.split('/')[0],
        repo: githubRepository.split('/')[1],
      })
      return branches.data.map((branch) => branch.name)
    } catch (error) {
      return []
    }
  }
}
