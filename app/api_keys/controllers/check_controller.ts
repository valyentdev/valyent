import type Organization from '#organizations/database/models/organization'
import { type HttpContext } from '@adonisjs/core/http'

export default class CheckController {
  async handle({ auth }: HttpContext) {
    try {
      const organization = (await auth.authenticateUsing(['api'])) as Organization

      return {
        authenticated: true,
        organizationSlug: organization.slug,
      }
    } catch (error) {
      return { authenticated: false }
    }
  }
}
