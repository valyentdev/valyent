import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import type { HasManyThrough } from '@adonisjs/lucid/types/relations'
import { afterCreate, column, hasManyThrough } from '@adonisjs/lucid/orm'
import BaseModel from './base_model.js'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import UserSignedUp from '#auth/events/user_signed_up'
import Organization from '#organizations/database/models/organization'
import OrganizationMember from '#organizations/database/models/organization_member'
import OrganizationCreated from '#organizations/events/organization_created'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  static apiKeys = DbAccessTokensProvider.forModel(User, {
    expiresIn: '365 years',
    prefix: 'valyent_',
    table: 'api_keys',
    type: 'auth_token',
    tokenSecretLength: 40,
  })

  /**
   * Regular columns.
   */
  @column()
  declare fullName: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string | null

  @column()
  declare role: 'admin' | 'user'

  /**
   * Hooks.
   */
  @afterCreate()
  static async triggerCreationEvent(user: User) {
    await UserSignedUp.dispatch(user)
  }

  @afterCreate()
  static async createDefaultOrganization(user: User) {
    const organization = new Organization()
    organization.name = user.fullName
    await organization.save()

    const member = new OrganizationMember()
    member.organizationId = organization.id
    member.userId = user.id
    member.role = 'owner'
    await member.save()

    user.defaultOrganizationId = organization.id
    await user.save()

    await OrganizationCreated.dispatch(organization)
  }

  /**
   * Relationships.
   */
  @hasManyThrough([() => Organization, () => OrganizationMember], {
    throughForeignKey: 'id',
    throughLocalKey: 'organizationId',
  })
  declare organizations: HasManyThrough<typeof Organization>

  @column()
  declare defaultOrganizationId: string
}
