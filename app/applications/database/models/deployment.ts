import BaseModel from '#common/database/models/base_model'
import { belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Application from './application.js'

export default class Deployment extends BaseModel {
  @column()
  declare applicationId: string

  @belongsTo(() => Application)
  declare application: BelongsTo<typeof Application>
}
