import OctokitService from '#applications/services/octokit_service'
import {
  GithubRepositoriesRecord,
  GithubRepositoryOwnersRecord,
} from '#applications/types/github_repository'
import Organization from '#organizations/database/models/organization'
import bindOrganizationWithMember from '#organizations/decorators/bind_organization_with_member'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class GitHubController {
  constructor(private octokitService: OctokitService) {}

  @bindOrganizationWithMember
  async listRepositories({}: HttpContext, organization: Organization) {
    await organization.load('members', (query) => {
      query.preload('user')
    })

    let repos: GithubRepositoriesRecord = {}
    let owners: GithubRepositoryOwnersRecord = {}

    for (const { user } of organization.members) {
      const { repos: r, owners: o } = await this.octokitService.listRepositoriesFromInstallations(
        user.githubInstallationIds
      )
      repos = { ...repos, ...r }
      owners = { ...owners, ...o }
    }

    return { repos, owners }
  }
}
