import React from 'react'
import ApplicationLayout from '../components/application_layout'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#common/ui/components/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#common/ui/components/select'
import GithubIcon from '../components/github_icon'
import Deployment from '#applications/database/models/deployment'
import useParams from '#common/ui/hooks/use_params'
import DeploymentCard from '../components/deployment_card'
import Application from '#applications/database/models/application'
import { Subscription, Transmit } from '@adonisjs/transmit-client'
import {
  GithubRepositoriesRecord,
  GithubRepository,
  GithubRepositoryOwner,
  GithubRepositoryOwnersRecord,
} from '#applications/types/github_repository'
import { SelectGroup } from '@radix-ui/react-select'
import { useForm } from '@inertiajs/react'
import { IconGitBranch, IconLock } from '@tabler/icons-react'
import Button from '#common/ui/components/button'
import useSuccessToast from '#common/ui/hooks/use_success_toast'

export default function DeploymentsPage({
  application,
  deployments: initialDeployments,
}: {
  application: Application
  deployments: Deployment[]
}) {
  const [githubOwner, setGithubOwner] = React.useState('public')
  const [deployments, setDeployments] = React.useState<Deployment[]>(initialDeployments)
  const [repos, setRepos] = React.useState<GithubRepositoriesRecord>({})
  const [owners, setOwners] = React.useState<GithubRepositoryOwnersRecord>({})
  const params = useParams()
  const successToast = useSuccessToast()
  const disconnectForm = useForm({
    githubRepository: '',
    githubInstallationId: '',
    githubBranch: '',
  })
  const disconnectGithubRepository = () => {
    disconnectForm.put(`/organizations/${params.organizationSlug}/applications/${application.id}`, {
      onSuccess: () => successToast(),
    })
  }

  async function loadGitHubData() {
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
  }

  React.useEffect(() => {
    let subscription: Subscription

    async function listenToEvents() {
      const transmit = new Transmit({
        baseUrl: window.location.origin,
      })

      subscription = transmit.subscription(
        `/organizations/${params.organizationSlug}/applications/${params.applicationId}/deployments/updates`
      )
      await subscription.create()
      subscription.onMessage<Deployment>((deployment) => {
        setDeployments((prevDeployments) => {
          const deploymentAlreadyExists = prevDeployments.find((d) => d.id === deployment.id)
          if (deploymentAlreadyExists) {
            return prevDeployments.map((d) => (d.id === deployment.id ? deployment : d))
          } else {
            return [deployment, ...prevDeployments]
          }
        })
      })
    }
    listenToEvents()

    loadGitHubData()

    return () => {
      if (subscription && subscription.isCreated) {
        subscription.delete()
      }
    }
  }, [])

  return (
    <ApplicationLayout breadcrumbs={[{ label: 'Deployments' }]}>
      <CardTitle>Deployments</CardTitle>

      <Card className="mt-4">
        <CardHeader className="">
          <div className="flex items-start justify-between space-x-8">
            <div>
              <CardTitle>Connected GitHub Repository</CardTitle>
              <CardDescription>
                Connect a GitHub repository to trigger deployments by pushing commits.
              </CardDescription>
            </div>
            <a
              className="btn-secondary"
              href="https://github.com/apps/valyenttest/installations/new"
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
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Deployments</CardTitle>
        </CardHeader>
        <CardContent className="!p-0">
          <ul className="divide-y divide-y-blue-600/20">
            {deployments.length > 0 ? (
              deployments.map((deployment) => {
                const isPending =
                  deployment.status === 'building' || deployment.status === 'deploying'
                const deploymentsWithSuccessStatus = deployments.filter(
                  (d) => d.status === 'success'
                )
                const isLatestDeploymentWithHasSuccessStatus =
                  deployment.status === 'success' &&
                  deployment.id === deploymentsWithSuccessStatus[0]?.id
                const pulse = isPending || isLatestDeploymentWithHasSuccessStatus

                return (
                  <DeploymentCard
                    key={deployment.id}
                    deployment={deployment}
                    application={application}
                    pulse={pulse}
                  />
                )
              })
            ) : (
              <p className="px-6 py-4 text-sm italic text-muted-foreground">No deployment yet...</p>
            )}
          </ul>
        </CardContent>
      </Card>
    </ApplicationLayout>
  )
}

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
