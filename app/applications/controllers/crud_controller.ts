import Application from '#applications/database/models/application'
import Organization from '#organizations/database/models/organization'
import bindOrganizationWithMember from '#organizations/decorators/bind_organization_with_member'
import type { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import { Fleet } from 'valyent.ts'

export default class CrudController {
  @bindOrganizationWithMember
  async index({ inertia, response }: HttpContext, organization: Organization) {
    const applications = await organization.related('applications').query()
    for (const application of applications) {
      await application.load('organization')
      try {
        await application.loadFleet()
      } catch (error) {
        logger.error({ error, organization, application }, 'Failed to load fleet.')
        return response.internalServerError('Failed to load fleet.')
      }
    }

    return inertia.render('applications/index', { applications })
  }

  @bindOrganizationWithMember
  async show({ inertia, params, response }: HttpContext, organization: Organization) {
    const application = await organization
      .related('applications')
      .query()
      .where('id', params.applicationId)
      .firstOrFail()
    await application.load('organization')
    try {
      await application.loadFleet()
    } catch (error) {
      logger.error({ error, organization }, 'Failed to load fleet.')
      return response.internalServerError('Failed to load fleet.')
    }

    return inertia.render('applications/show', { application })
  }

  @bindOrganizationWithMember
  async store({ request, response }: HttpContext, organization: Organization) {
    const application: Application = new Application()
    application.name = request.input('name')
    application.organizationId = organization.id

    let fleet: Fleet
    try {
      fleet = await organization.ravelClient.fleets.create({
        name: request.input('name'),
      })
    } catch (error) {
      logger.error({ error, organization }, 'Failed to create fleet.')
      return response.badRequest()
    }

    application.fleetId = fleet.id

    try {
      await application.save()
    } catch (error) {
      logger.error({ error, organization }, 'Failed to create application.')
      return response.badRequest()
    }

    /**
     * If the request wants JSON, return the fleet data.
     */
    if (request.wantsJSON()) {
      return response.json(fleet)
    }

    /**
     * Otherwise, redirect to the application show page.
     */
    return response
      .redirect()
      .toPath(`/organizations/${organization.slug}/applications/${application.id}`)
  }

  @bindOrganizationWithMember
  async edit({ inertia, params }: HttpContext, organization: Organization) {
    const application = await organization
      .related('applications')
      .query()
      .where('id', params.applicationId)
      .firstOrFail()
    await application.load('organization')
    await application.loadFleet()

    return inertia.render('applications/edit', { application })
  }

  @bindOrganizationWithMember
  async delete({ response, params }: HttpContext, organization: Organization) {
    const application = await organization
      .related('applications')
      .query()
      .where('id', params.applicationId || '')
      .orWhere('fleetId', params.fleetId || '')
      .first()
    if (!application) {
      logger.error({ params, organization }, 'Failed to retrieve application')
      return response.notFound('Application not found')
    }

    await organization.ravelClient.fleets.delete(application.fleetId)

    await application.delete()

    return response.redirect(`/organizations/${organization.slug}/applications`)
  }
}
