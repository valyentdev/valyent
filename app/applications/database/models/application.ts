import BaseModel from '#common/database/models/base_model'
import Organization from '#organizations/database/models/organization'
import { afterFetch, afterFind, belongsTo, column, computed } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import type { Fleet } from 'valyent.ts'

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

  @column()
  declare organizationId: string

  @column()
  declare name: string

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
