import Organization from '#organizations/database/models/organization'
import bindOrganizationWithMember from '#organizations/decorators/bind_organization_with_member'
import type { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'

export default class CrudController {
  @bindOrganizationWithMember
  async index({ inertia, response }: HttpContext, organization: Organization) {
    const result = await organization.ravelClient.fleets.list()
    if (!result.success) {
      logger.error({ reason: result.reason, organization }, 'Failed to get list of fleets.')
      return response.internalServerError()
    }

    return inertia.render('applications/index', { fleets: result.value })
  }

  @bindOrganizationWithMember
  async show({ inertia, params, response }: HttpContext, organization: Organization) {
    const result = await organization.ravelClient.fleets.get(params.applicationId)
    if (!result.success) {
      logger.error(
        { reason: result.reason, organization, applicationId: params.applicationId },
        'Failed to retrieve fleet.'
      )
      return response.internalServerError()
    }

    return inertia.render('applications/show', { fleet: result.value })
  }

  @bindOrganizationWithMember
  async store({ request, response }: HttpContext, organization: Organization) {
    const result = await organization.ravelClient.fleets.create({
      name: request.input('name'),
    })
    if (!result.success) {
      logger.error(
        { reason: result, organization, name: request.input('name') },
        'Failed to create fleet.'
      )
      return response.badRequest()
    }

    return response
      .redirect()
      .toPath(`/organizations/${organization.slug}/applications/${result.value.id}`)
  }

  @bindOrganizationWithMember
  async edit({ inertia, params, response }: HttpContext, organization: Organization) {
    const result = await organization.ravelClient.fleets.get(params.applicationId)
    if (!result.success) {
      logger.error(
        { reason: result.reason, organization, applicationId: params.applicationId },
        'Failed to retrieve fleet.'
      )
      return response.internalServerError()
    }

    return inertia.render('applications/edit', { fleet: result.value })
  }

  @bindOrganizationWithMember
  async delete({ response, params }: HttpContext, organization: Organization) {
    await organization.ravelClient.fleets.delete(params.applicationId)
    return response.redirect(`/organizations/${organization.slug}/applications`)
  }
}
