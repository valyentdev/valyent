import Deployment, { DeploymentStatus } from '#applications/database/models/deployment'
import env from '#start/env'
import logger from '@adonisjs/core/services/logger'
import jwt from 'jsonwebtoken'
import { Client, FetchErrorWithPayload, Machine, RestartPolicy } from 'valyent.ts'

export default class DeploymentsService {
  async igniteBuilder(deployment: Deployment) {
    /**
     * Load related application and its related organization.
     */
    await deployment.load('application', (query) => {
      query.preload('organization')
    })

    const token = jwt.sign({ deploymentId: deployment.id }, env.get('APP_KEY'))

    /**
     * Compute webhook URL.
     */
    let webhookURL =
      env.get('NODE_ENV') === 'production'
        ? `${env.get('APP_URL')}/deployments/updates`
        : env.get('WEBHOOK_URL', 'https://smee.io/S1v6TfUa5IAvuPo')

    /**
     * Ignite builder machine.
     */
    const adminClient = new Client(
      env.get('RAVEL_API_SECRET'),
      env.get('RAVEL_ADMIN_NAMESPACE', 'admin'),
      env.get('RAVEL_API_ENDPOINT')
    )

    let machine: Machine
    try {
      machine = await adminClient.machines.create(env.get('RAVEL_BUILDERS_FLEET', 'builders'), {
        region: deployment.application.region,
        config: {
          image: env.get('BUILDER_IMAGE', 'valyent/builder:latest'),
          guest: { cpu_kind: 'eco', cpus: 1, memory_mb: 1024 },
          workload: {
            env: [
              `S3_ENDPOINT=${env.get('S3_ENDPOINT')}`,
              `S3_BUCKET_NAME=${env.get('S3_BUCKET')}`,
              `S3_ACCESS_KEY_ID=${env.get('S3_ACCESS_KEY_ID')}`,
              `S3_SECRET_ACCESS_KEY=${env.get('S3_SECRET_ACCESS_KEY')}`,
              `FILE_NAME=${deployment.fileName}`,
              `IMAGE_NAME=${deployment.application.organization.slug}/${deployment.application.name}`,
              `REGISTRY_HOST=${env.get('REGISTRY_HOST')}`,
              `REGISTRY_TOKEN=${env.get('REGISTRY_TOKEN')}`,
              `ORGANIZATION=${deployment.application.organization.slug}`,
              `DEPLOYMENT_ID=${deployment.id}`,
              `API_TOKEN=${token}`,
              `WEBHOOK_URL=${webhookURL}`,
            ],
            init: { user: 'root' },
            restart: { policy: RestartPolicy.Never },
          },
          auto_destroy: true,
        },
        skip_start: false,
      })
    } catch (error) {
      if (error instanceof FetchErrorWithPayload) {
        logger.error({ payload: error.payload, deployment }, `Failed to create machine.`)
      } else {
        logger.error({ error }, `Failed to create machine.`)
      }

      deployment.status = DeploymentStatus.BuildFailed
      await deployment.save()

      return
    }

    /**
     * Save builder machine id in the database, on the deployment model.
     */
    deployment.builderMachineId = machine.id
    await deployment.save()
  }
}
