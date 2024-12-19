import Organization from '#organizations/database/models/organization'
import { BaseEvent } from '@adonisjs/core/events'

export default class OrganizationCreated extends BaseEvent {
  constructor(public organization: Organization) {
    super()
  }
}
