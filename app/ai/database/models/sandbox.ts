import ModelWithTimestamps from '#common/database/models/model_with_timestamps'
import Organization from '#organizations/database/models/organization'
import { belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

export default class Sandbox extends ModelWithTimestamps {
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  /**
   * Regular columns.
   */
  @column.dateTime()
  declare startedAt: DateTime

  @column.dateTime()
  declare endedAt: DateTime

  @column()
  declare type: SandboxType

  /**
   * Relationships.
   */
  @column()
  declare organizationId: string

  @belongsTo(() => Organization)
  declare organization: BelongsTo<typeof Organization>
}

export type SandboxType = 'code-interpreter' | 'computer-use'
