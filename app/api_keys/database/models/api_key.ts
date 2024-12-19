import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Organization from '#organizations/database/models/organization'

export default class ApiKey extends BaseModel {
  /**
   * Regular columns.
   */
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare type: string

  @column()
  declare name: string

  @column()
  declare hash: string

  @column()
  declare abilities: string

  /**
   * Relationships.
   */
  @column()
  declare tokenableId: string

  @belongsTo(() => Organization, { foreignKey: 'tokenableId' })
  declare organization: BelongsTo<typeof Organization>

  /**
   * Timestamps.
   */
  @column.dateTime()
  declare lastUsedAt: DateTime | null

  @column.dateTime()
  declare expiresAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
