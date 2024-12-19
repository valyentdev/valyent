import { belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Organization from './organization.js'
import BaseModel from '#common/database/models/base_model'
import User from '#common/database/models/user'

export default class OrganizationMember extends BaseModel {
  static table = 'organization_members'

  /**
   * Regular columns.
   */
  @column()
  declare role: 'owner' | 'member'

  /**
   * Relationships.
   */
  @belongsTo(() => Organization)
  declare organization: BelongsTo<typeof Organization>

  @column()
  declare organizationId: string

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare userId: string
}
