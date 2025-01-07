import React from 'react'
import ApplicationLayout from '../components/application_layout'
import {
  Card,
  CardContent,
  CardDescription,
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
import Input from '#common/ui/components/input'
import { SearchIcon } from 'lucide-react'
import GithubIcon from '../components/github_icon'
import Deployment from '#applications/database/models/deployment'
import useParams from '#common/ui/hooks/use_params'
import DeploymentCard from '../components/deployment_card'
import Application from '#applications/database/models/application'
import { Subscription, Transmit } from '@adonisjs/transmit-client'

export default function DeploymentsPage({
  application,
  deployments: initialDeployments,
}: {
  application: Application
  deployments: Deployment[]
}) {
  const [githubOwner, setGithubOwner] = React.useState('public')
  const [deployments, setDeployments] = React.useState<Deployment[]>(initialDeployments)
  const params = useParams()

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
        <CardContent>
          <div className="grid grid-cols-2 items-center space-x-4 mr-4">
            <Select value={githubOwner} onValueChange={setGithubOwner}>
              <SelectTrigger className="w-full text-sm">
                <SelectValue
                  placeholder={
                    <>
                      <GithubIcon />
                      <span>Select a public repository</span>
                    </>
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className="cursor-pointer" value="public">
                  <p className="flex items-center space-x-2">
                    <GithubIcon />
                    <span className="font-medium">Select a public repository</span>{' '}
                  </p>
                </SelectItem>
              </SelectContent>
            </Select>
            <Input
              icon={<SearchIcon className="w-4 h-4" />}
              placeholder="https://github.com/valyentdev/hello-world"
            />
          </div>
        </CardContent>
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
