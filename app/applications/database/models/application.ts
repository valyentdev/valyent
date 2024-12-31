import BaseModel from '#common/database/models/base_model'
import Organization from '#organizations/database/models/organization'
import { belongsTo, column, computed, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import type { Fleet } from 'valyent.ts'
import Deployment from './deployment.js'

export default class Application extends BaseModel {
  private fleetValue: Fleet | null = null

  @column()
  declare fleetId: string

  public set fleet(fleet: Fleet) {
    this.fleetValue = fleet
  }

  @computed()
  public get fleet(): Fleet | null {
    return this.fleetValue
  }

  @belongsTo(() => Organization)
  declare organization: BelongsTo<typeof Organization>

  @hasMany(() => Deployment)
  declare deployments: HasMany<typeof Deployment>

  @column()
  declare organizationId: string

  @column()
  declare name: string

  @column()
  declare githubRepository: string | null

  @column()
  declare githubBranch: string | null

  /**
   * Load the fleet for the application.
   * (Requires the organization to be loaded.)
   */
  async loadFleet() {
    const result = await this.organization.ravelClient.fleets.get(this.fleetId)
    if (!result.success) {
      throw new Error('Failed to fetch fleet.')
    }

    this.fleet = result.value
  }
}
