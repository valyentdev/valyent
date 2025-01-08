import { cuid } from '@adonisjs/core/helpers'
import { beforeCreate, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import ModelWithTimestamps from './model_with_timestamps.js'

export default class BaseModel extends ModelWithTimestamps {
  /**
   * Cuid primary key.
   */
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @beforeCreate()
  static assignUuid(model: BaseModel) {
    model.id = cuid()
  }

  /**
   * Timestamps.
   */
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
