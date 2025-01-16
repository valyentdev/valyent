import Organization from '#organizations/database/models/organization'
import { belongsTo, column, computed, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import type { CreateMachinePayload, Fleet, GuestConfig } from 'valyent.ts'
import Deployment from './deployment.js'
import ModelWithTimestamps from '#common/database/models/model_with_timestamps'

export default class Application extends ModelWithTimestamps {
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  private fleetValue: Fleet | null = null

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
  declare env: Record<string, string>

  @column()
  declare organizationId: string

  @column()
  declare name: string

  @column()
  declare region: string

  @column()
  declare guest: GuestConfig

  /**
   * GitHub-related columns.
   */
  @column()
  declare githubRepository: string | null

  @column()
  declare githubBranch: string | null

  @column()
  declare githubInstallationId: number | null

  /**
   * Load the fleet for the application.
   * (Requires the organization to be loaded.)
   */
  async loadFleet() {
    this.fleet = await this.organization.ravelClient.fleets.get(this.id)
  }
}
