import Application from '#applications/database/models/application'
import bindApplication from '#applications/decorators/bind_application'
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

  @bindApplication
  async show({ inertia, response }: HttpContext, application: Application) {
    await application.loadOnce('organization')

    try {
      await application.loadFleet()
    } catch (error) {
      logger.error({ error, application }, 'Failed to load fleet.')
      return response.internalServerError('Failed to load fleet.')
    }

    return inertia.render('applications/show', { application })
  }

  @bindOrganizationWithMember
  async store({ request, response }: HttpContext, organization: Organization) {
    /**
     * Create fleet in the Ravel cluster.
     */
    let fleet: Fleet
    try {
      fleet = await organization.ravelClient.fleets.create({
        name: request.input('name'),
      })
    } catch (error) {
      logger.error({ error, organization }, 'Failed to create fleet.')
      return response.badRequest()
    }

    /**
     * Store associated application record in the database.
     */
    const application = new Application()
    application.id = fleet.id
    application.name = request.input('name')
    application.organizationId = organization.id

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

  @bindApplication
  async update({ request, response }: HttpContext, application: Application) {
    /**
     * Update GitHub-related fields.
     */
    application.githubRepository = request.input('githubRepository')
    application.githubInstallationId = request.input('githubInstallationId')
    application.githubBranch = request.input('githubBranch')

    /**
     * Save record in the database.
     */
    await application.save()

    return response.redirect().back()
  }

  @bindApplication
  async delete({ response }: HttpContext, application: Application) {
    await application.loadOnce('organization')
    /**
     * Delete the fleet from the Ravel cluster.
     */
    await application.organization.ravelClient.fleets.delete(application.id)

    /**
     * Delete the application from the database.
     */
    await application.delete()

    return response.redirect(`/organizations/${application.organization.slug}/applications`)
  }
}
