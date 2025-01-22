import Application from '#applications/database/models/application'
import bindApplication from '#applications/decorators/bind_application'
import Organization from '#organizations/database/models/organization'
import bindOrganizationWithMember from '#organizations/decorators/bind_organization_with_member'
import type { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import { FetchErrorWithPayload } from 'valyent.ts'

export default class GatewaysController {
  @bindApplication
  async index({ inertia, response }: HttpContext, application: Application) {
    await application.loadOnce('organization')
    await application.loadFleet()

    /**
     * List gateways.
     */
    try {
      const gateways = await application.organization.ravelClient.gateways.list(
        application.fleet!.id
      )
      return inertia.render('applications/gateways', { application, gateways })
    } catch (error) {
      logger.error({ error, application }, 'Failed to list gateways.')
      return response.internalServerError()
    }
  }

  @bindOrganizationWithMember
  async store({ request, params, session, response }: HttpContext, organization: Organization) {
    try {
      await organization.ravelClient.gateways.create(params.applicationId, {
        name: request.input('name'),
        target_port: request.input('targetPort'),
      })
    } catch (error) {
      if (error instanceof FetchErrorWithPayload && 'detail' in error.payload) {
        session.flash('errors.global', `Failed to create gateway: ${error.payload.detail}.`)
      } else {
        session.flash('errors.global', 'Failed to create gateway.')
      }

      return response.redirect().back()
    }

    return response.redirect().back()
  }

  @bindOrganizationWithMember
  async destroy({ params, response }: HttpContext, organization: Organization) {
    await organization.ravelClient.gateways.delete(params.applicationId, params.gatewayId)

    return response.redirect().back()
  }
}
