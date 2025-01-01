export type GithubRepository = {
  name: string
  isPrivate: boolean
  defaultBranch: string
}

export type GithubRepositoriesRecord = Record<
  string,
  {
    repositories: Array<GithubRepository>
    installationId: number
  }
>

export type GithubRepositoryOwner = {
  name: string
  imageUrl: string
  installationId: number
}

export type GithubRepositoryOwnersRecord = Record<string, GithubRepositoryOwner>
