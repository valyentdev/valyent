import Deployment, { DeploymentStatus } from '#applications/database/models/deployment'
import envv from '#start/env'
import { inject } from '@adonisjs/core'

export default class DeploymentSuccessfulBuildListener {
  @inject()
  async handle({ deployment }: { deployment: Deployment }) {
    await deployment.loadOnce('application')
    await deployment.application.loadOnce('organization')

    const application = deployment.application
    const organization = application.organization

    /**
     * List existing machines (to delete in the end).
     */
    const machines = await organization.ravelClient.machines.list(application.id)

    /**
     * Compute environment variables that the new machine(s) should adopt.
     */
    const env: string[] = []
    for (const key in application.env) {
      env.push(`${key}=${application.env[key]}`)
    }
    env.push(...(deployment.machineConfig.config.workload.env || []))

    /**
     * Create new machine(s).
     */
    await organization.ravelClient.machines.create(application.id, {
      ...deployment.machineConfig,
      config: {
        ...deployment.machineConfig.config,
        workload: {
          ...deployment.machineConfig.config.workload,
          env,
        },
        image: `${envv.get('REGISTRY_HOST')}/${organization.slug}/${application.name}`,
      },
    })

    /**
     * Delete machines that were existing before the new deployment.
     */
    for (const machine of machines) {
      await organization.ravelClient.machines.delete(application.id, machine.id, true)
    }

    deployment.status = DeploymentStatus.Success
    await deployment.save()
  }
}