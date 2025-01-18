import React from 'react'
import ApplicationLayout from '../components/application_layout'
import { Card, CardContent, CardHeader, CardTitle } from '#common/ui/components/card'
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
      <CardTitle>Monitor deployments</CardTitle>

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
