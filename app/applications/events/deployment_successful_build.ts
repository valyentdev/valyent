import Deployment from '#applications/database/models/deployment'
import { BaseEvent } from '@adonisjs/core/events'

export default class DeploymentSuccessfulBuild extends BaseEvent {
  constructor(public deployment: Deployment) {
    super()
  }
}
