import Application from '#applications/database/models/application'
import Deployment from '#applications/database/models/deployment'
import {
  GithubRepositoriesRecord,
  GithubRepository,
  GithubRepositoryOwner,
  GithubRepositoryOwnersRecord,
} from '#applications/types/github_repository'
import Button from '#common/ui/components/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '#common/ui/components/card'
import Spinner from '#common/ui/components/spinner'
import usePageProps from '#common/ui/hooks/use_page_props'
import useParams from '#common/ui/hooks/use_params'
import useSuccessToast from '#common/ui/hooks/use_success_toast'
import { useForm } from '@inertiajs/react'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
} from '@radix-ui/react-select'
import { IconGitBranch, IconLock } from '@tabler/icons-react'
import { GithubIcon } from 'lucide-react'
import React from 'react'

interface GitHubDeploymentsCardProps {}

const GitHubDeploymentsCard: React.FunctionComponent<GitHubDeploymentsCardProps> = () => {
  const [githubOwner, setGithubOwner] = React.useState('public')
  const [loading, setLoading] = React.useState(false)
  const [repos, setRepos] = React.useState<GithubRepositoriesRecord>({})
  const [owners, setOwners] = React.useState<GithubRepositoryOwnersRecord>({})
  const { application, deployments: initialDeployments } = usePageProps<{
    application: Application
    deployments: Deployment[]
  }>()
  const disconnectForm = useForm({
    githubRepository: '',
    githubInstallationId: '',
    githubBranch: '',
  })
  const params = useParams()
  const successToast = useSuccessToast()
  const disconnectGithubRepository = () => {
    disconnectForm.put(`/organizations/${params.organizationSlug}/applications/${application.id}`, {
      onSuccess: () => successToast(),
    })
  }

  async function loadGitHubData() {
    setLoading(true)
    try {
      const res = await fetch(
        '/organizations/' + params.organizationSlug + '/github/repositories',
        {
          method: 'GET',
        }
      )
      const data = (await res.json()) as {
        repos: GithubRepositoriesRecord
        owners: GithubRepositoryOwnersRecord
      }
      setRepos(data.repos)
      setOwners(data.owners)
    } catch (error) {
      console.log('some error occured while loading github data...', error)
    }
    setLoading(false)
  }

  React.useEffect(() => {
    loadGitHubData()
  }, [])

  return (
    <Card className="mt-4">
      <CardHeader className="">
        <div className="flex flex-col lg:flex-row items-start justify-between space-y-2 lg:space-x-8">
          <div>
            <CardTitle>Connected GitHub Repository</CardTitle>
            <CardDescription>
              Connect a GitHub repository to trigger deployments by pushing commits.
            </CardDescription>
          </div>
          <a
            className="btn-secondary"
            onClick={() => {
              window.open(
                'https://github.com/apps/software-citadel/installations/new',
                'popup',
                'width=600,height=600'
              )
              return false
            }}
          >
            <GithubIcon />
            <span>Manage Installation</span>
          </a>
        </div>
      </CardHeader>
      {application.githubInstallationId ? (
        <CardContent>
          <Button variant="destructive" onClick={disconnectGithubRepository}>
            Disconnect GitHub repository
          </Button>
        </CardContent>
      ) : (
        <>
          <CardContent>
            <Select value={githubOwner} onValueChange={setGithubOwner}>
              <SelectTrigger className="w-full text-sm">
                <SelectValue
                  placeholder={
                    <>
                      <GithubIcon />
                      <span>Select a GitHub owner</span>
                    </>
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className="cursor-pointer" value="public">
                  <p className="flex items-center space-x-2">
                    <GithubIcon />
                    <span className="font-medium">Select a GitHub owner</span>
                  </p>
                </SelectItem>
                {owners ? (
                  <SelectGroup>
                    {Object.keys(owners).map((ownerKey) => (
                      <SelectItem className="cursor-pointer" value={ownerKey} key={ownerKey}>
                        <p className="flex items-center space-x-2">
                          <img
                            className="h-6 w-6 rounded-full"
                            src={owners[ownerKey].imageUrl}
                            alt={owners[ownerKey].name + ' Image'}
                          />
                          <span className="font-medium">{owners[ownerKey].name}</span>
                        </p>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ) : null}
              </SelectContent>
            </Select>
          </CardContent>
          {loading ? (
            <CardFooter className="bg-white space-y-2 flex flex-col items-center justify-center !py-6">
              <Spinner className="text-blue-700" />
              <p className="font-medium font-serif leading-none tracking-tight text-xl">
                Loading repositories...
              </p>
              <p className="text-sm text-muted-foreground">It can take a few seconds.</p>
            </CardFooter>
          ) : null}

          {githubOwner !== 'public' && (
            <CardFooter className="bg-white grid sm:grid-cols-2 gap-x-8 gap-y-4 max-h-64 overflow-y-auto">
              {githubOwner
                ? repos[githubOwner].repositories.map((repo) => (
                    <ConnectGithubRepositoryListItem
                      key={repo.name}
                      application={application}
                      repository={repo}
                      selectedOwner={owners[githubOwner]}
                    />
                  ))
                : null}
            </CardFooter>
          )}
        </>
      )}
    </Card>
  )
}

export default GitHubDeploymentsCard

type ConnectGithubRepositoryListItemProps = {
  application: Application
  repository: GithubRepository
  selectedOwner: GithubRepositoryOwner
}

function ConnectGithubRepositoryListItem({
  application,
  repository,
  selectedOwner,
}: ConnectGithubRepositoryListItemProps) {
  const params = useParams()
  const form = useForm({
    githubRepository: `${selectedOwner.name}/${repository.name}`,
    githubInstallationId: selectedOwner.installationId,
    githubBranch: repository.defaultBranch,
  })
  const onConnect = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    form.put(`/organizations/${params.organizationSlug}/applications/${application.id}`)
  }
  return (
    <li className="flex justify-between py-2 w-full" key={repository.name}>
      <div className="flex flex-col space-y-2">
        <div className="flex">
          <a
            className="flex space-x-2 items-center hover:opacity-75 transition-opacity"
            href={`https://www.github.com/${selectedOwner.name}/${repository.name}`}
            target="_blank"
          >
            <span className="text-sm text-zinc-900 font-semibold">{repository.name}</span>
            <svg
              className="w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
          </a>
        </div>
        <div className="flex items-center space-x-2 text-blue-600">
          <IconGitBranch className="w-4 h-4" />
          <span className="text-sm">{repository.defaultBranch}</span>
        </div>
      </div>
      <form className="flex space-x-2 items-center" onSubmit={onConnect}>
        {repository.isPrivate && (
          <div className="text-blue-600">
            <IconLock size={16} />
          </div>
        )}

        <Button className="!px-2 !py-1" variant="outline" type="submit" loading={form.processing}>
          Connect
        </Button>
      </form>
    </li>
  )
}
