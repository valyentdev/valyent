import {
  afterCreate,
  beforeCreate,
  column,
  computed,
  hasMany,
  hasManyThrough,
} from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import slugify from 'slug'
import { generate as generateRandomWord } from 'random-words'
import type { HasMany, HasManyThrough } from '@adonisjs/lucid/types/relations'
import OrganizationMember from './organization_member.js'
import { cuid } from '@adonisjs/core/helpers'
import User from '#common/database/models/user'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import env from '#start/env'
import logger from '@adonisjs/core/services/logger'
import BaseModel from '#common/database/models/base_model'
import { Client } from 'valyent.ts'
import Application from '#applications/database/models/application'

export default class Organization extends BaseModel {
  static apiKeys = DbAccessTokensProvider.forModel(Organization, {
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
  declare name: string

  @column()
  declare slug: string

  /**
   * Stripe-related fields.
   */
  @column()
  declare stripeCustomerId: string

  @column()
  declare stripePaymentMethodId: string | null

  @column.date()
  declare stripePaymentMethodExpirationDate: DateTime | null

  /**
   * Relationships.
   */
  @hasManyThrough([() => User, () => OrganizationMember], {
    foreignKey: 'organizationId',
    throughForeignKey: 'id',
    throughLocalKey: 'userId',
    localKey: 'id',
  })
  declare users: HasManyThrough<typeof User>

  @hasMany(() => OrganizationMember, {
    foreignKey: 'organizationId',
    localKey: 'id',
  })
  declare members: HasMany<typeof OrganizationMember>

  @hasMany(() => Application, {
    foreignKey: 'organizationId',
    localKey: 'id',
  })
  declare applications: HasMany<typeof Application>

  /**
   * Hooks.
   */
  @beforeCreate()
  static async assignIdAndSlug(organization: Organization) {
    organization.id = cuid()

    let slug = slugify(organization.name, { lower: true, replacement: '-' })
    while (await Organization.findBy('slug', slug)) {
      slug += '-' + generateRandomWord({ exactly: 1 })
    }
    organization.slug = slug
  }

  @afterCreate()
  static async createAssociatedRavelNamespace(organization: Organization) {
    try {
      const response = await fetch(env.get('RAVEL_API_ENDPOINT') + '/namespaces', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: organization.slug,
        }),
      })
      if (!response.ok) {
        throw new Error(response.statusText)
      }
    } catch (error) {
      logger.error({ error }, `Error creating namespace for ${organization.name}:`)
    }
  }

  /**
   * Custom getters.
   */
  @computed()
  get hasValidPaymentMethod(): boolean {
    if (env.get('STRIPE_SECRET_KEY') === 'off') {
      return true
    }

    if (!this.stripePaymentMethodId === null || !this.stripePaymentMethodExpirationDate) {
      return false
    }

    const isExpired = new Date(this.stripePaymentMethodExpirationDate!.toISO()!) < new Date()
    if (isExpired) {
      return false
    }

    return true
  }

  get ravelClient(): Client {
    return new Client(this.slug, env.get('RAVEL_API_SECRET'), env.get('RAVEL_API_ENDPOINT'))
  }
}
