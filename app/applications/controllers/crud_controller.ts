import Application from '#applications/database/models/application'
import Organization from '#organizations/database/models/organization'
import bindOrganizationWithMember from '#organizations/decorators/bind_organization_with_member'
import type { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'

export default class CrudController {
  @bindOrganizationWithMember
  async index({ inertia }: HttpContext, organization: Organization) {
    const applications = await organization.related('applications').query()
    for (const application of applications) {
      await application.load('organization')
      await application.loadFleet()
    }

    return inertia.render('applications/index', { applications })
  }

  @bindOrganizationWithMember
  async show({ inertia, params }: HttpContext, organization: Organization) {
    const application = await organization
      .related('applications')
      .query()
      .where('id', params.applicationId)
      .firstOrFail()
    await application.load('organization')
    await application.loadFleet()

    return inertia.render('applications/show', { application })
  }

  @bindOrganizationWithMember
  async store({ request, response }: HttpContext, organization: Organization) {
    const createFleetResult = await organization.ravelClient.fleets.create({
      name: request.input('name'),
    })

    const application: Application = new Application()
    application.name = request.input('name')
    application.organizationId = organization.id
    if (!createFleetResult.success) {
      logger.error({ reason: createFleetResult.reason, organization }, 'Failed to create fleet.')
      return response.internalServerError()
    }
    application.fleetId = createFleetResult.value.id

    try {
      await application.save()
    } catch (error) {
      logger.error({ error, organization }, 'Failed to create application.')
      return response.badRequest()
    }

    return response
      .redirect()
      .toPath(`/organizations/${organization.slug}/applications/${application.id}`)
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
    const application = await organization
      .related('applications')
      .query()
      .where('id', params.applicationId)
      .firstOrFail()

    const result = await application.organization.ravelClient.fleets.delete(application.fleetId)
    if (!result.success) {
      logger.error(
        { reason: result.reason, organization, applicationId: application.id },
        'Failed to delete fleet.'
      )
      return response.internalServerError()
    }

    await application.delete()

    return response.redirect(`/organizations/${organization.slug}/applications`)
  }
}
