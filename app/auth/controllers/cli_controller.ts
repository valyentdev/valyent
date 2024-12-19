import ApiKey from '#api_keys/database/models/api_key'
import User from '#common/database/models/user'
import Organization from '#organizations/database/models/organization'
import { cuid } from '@adonisjs/core/helpers'
import { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import redis from '@adonisjs/redis/services/main'

export default class CliController {
  async getSession({ response }: HttpContext) {
    const sessionID = cuid()

    await redis.set(sessionID, 'pending')

    return response.ok({ sessionID })
  }

  async show({ auth, params, inertia }: HttpContext) {
    const user = auth.user! as User
    const organizations = await user.related('organizations').query()

    const sessionID = await redis.get(params.sessionID)

    if (sessionID === 'pending') {
      return inertia.render('auth/cli', { organizations })
    }

    return inertia.render('auth/cli', { organizations, success: true })
  }

  async handle({ auth, request, response, params }: HttpContext) {
    try {
      const user = auth.user! as User

      const organization = await user
        .related('organizations')
        .query()
        .where('organizations.id', request.input('organizationID'))
        .firstOrFail()

      const apiKey = await Organization.apiKeys.create(organization, undefined, {
        name: 'CLI',
      })

      const sessionID = await redis.get(params.sessionID)
      if (sessionID !== 'pending') {
        throw new Error()
      }

      await redis.set(params.sessionID, organization.id + '   ' + apiKey.value!.release())

      return response.redirect().back()
    } catch (error) {
      logger.error('error', error)
      return response.badRequest('Bad request')
    }
  }

  async wait({ params, response }: HttpContext) {
    const value = (await redis.get(params.sessionID)) || ''

    if (value === 'pending') {
      return response.ok({ status: 'pending' })
    }

    const [organizationID, apiKey] = value.split('   ')

    await redis.del(params.sessionID)
    const organization = await Organization.find(organizationID)

    return response.ok({ status: 'done', apiKey, namespace: organization?.slug })
  }

  async check({ auth, response }: HttpContext) {
    try {
      await auth.use('api').authenticate()

      return response.json({ authenticated: true })
    } catch {
      return response.json({ authenticated: false })
    }
  }
}
