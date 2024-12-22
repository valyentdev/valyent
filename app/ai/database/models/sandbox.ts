import Organization from '#organizations/database/models/organization'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

export default class Sandbox extends BaseModel {
  /**
   * Regular columns.
   */
  @column.dateTime()
  declare startedAt: DateTime

  @column.dateTime()
  declare endedAt: DateTime

  /**
   * Relationships.
   */
  @column()
  declare organizationId: string

  @belongsTo(() => Organization)
  declare organization: BelongsTo<typeof Organization>
}
