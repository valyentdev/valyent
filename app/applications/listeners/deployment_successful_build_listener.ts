import Deployment from '#applications/database/models/deployment'
import DeploymentsService from '#applications/services/deployments_service'
import { inject } from '@adonisjs/core'

@inject()
export default class DeploymentSuccessfulBuildListener {
  constructor(private deploymentsService: DeploymentsService) {}

  @inject()
  async handle({ deployment }: { deployment: Deployment }) {
    await this.deploymentsService.igniteDeployment(deployment)
  }
}
