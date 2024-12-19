import User from '#common/database/models/user'
import { BaseEvent } from '@adonisjs/core/events'

export default class UserSignedUp extends BaseEvent {
  constructor(public user: User) {
    super()
  }
}
