import BaseModel from '#common/database/models/base_model'
import { afterSave, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Application from './application.js'
import transmit from '@adonisjs/transmit/services/main'
import { type CreateMachinePayload } from 'valyent.ts'

export default class Deployment extends BaseModel {
  @column()
  declare origin: 'cli' | 'github'

  @column()
  declare fileName: string

  @column()
  declare machineConfig: CreateMachinePayload

  @column()
  declare status: DeploymentStatus

  @column()
  declare errorMessage: string | null

  @column()
  declare builderMachineId: string | null

  /**
   * GitHub-related fields.
   */
  @column()
  declare githubCheckId: number | null

  @column()
  declare commitSha: string | null

  @column()
  declare commitMessage: string | null

  /**
   * Relationships.
   */
  @column()
  declare applicationId: string

  @belongsTo(() => Application)
  declare application: BelongsTo<typeof Application>

  /**
   * Hooks
   */
  @afterSave()
  static async emitUpdatedEvent(deployment: Deployment) {
    await deployment.loadOnce('application')
    await deployment.application.loadOnce('organization')

    transmit.broadcast(
      `/organizations/${deployment.application.organization.slug}/applications/${deployment.application.id}/deployments/updates`,
      deployment.serialize()
    )
  }
}

export enum DeploymentStatus {
  Building = 'building',
  BuildFailed = 'build-failed',
  Deploying = 'deploying',
  DeploymentFailed = 'deployment-failed',
  Stopped = 'stopped',
  Success = 'success',
}
