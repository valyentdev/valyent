import { HttpContext } from '@adonisjs/core/http'
import bindOrganizationWithMember from '#organizations/decorators/bind_organization_with_member'
import Organization from '#organizations/database/models/organization'
import logger from '@adonisjs/core/services/logger'
import EnvironmentVariablesService from '#applications/services/environment_variables_service'

export default class EnvironmentVariablesController {
  private readonly environmentVariablesService = new EnvironmentVariablesService()

  @bindOrganizationWithMember
  public async edit(
    { request, params, response, inertia }: HttpContext,
    organization: Organization
  ) {
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

    if (request.wantsJSON()) {
      return { environmentVariables: application.environmentVariables }
    }

    return inertia.render('applications/environment_variables', {
      application,
    })
  }

  @bindOrganizationWithMember
  public async update({ response, request, params }: HttpContext, organization: Organization) {
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

    const oldEnvironmentVariables = { ...application.environmentVariables }

    if (request.wantsJSON()) {
      application.environmentVariables = {
        ...oldEnvironmentVariables,
        ...request.body(),
      }
    } else {
      application.environmentVariables =
        this.environmentVariablesService.parseEnvironmentVariablesFromRequest(request)
    }

    await application.save()

    // TODO: Implement redeploy mechanism
    // const deploymentWithSuccessStatus = await application
    //   .related('deployments')
    //   .query()
    //   .where('status', 'success')
    //   .orderBy('created_at', 'desc')
    //   .first()

    // const applicationHasBeenSuccessfullyDeployed: boolean = deploymentWithSuccessStatus !== null

    // const redeploy: boolean = applicationHasBeenSuccessfullyDeployed
    //   this.environmentVariablesService.haveEnvironmentVariablesChanged(
    //     oldEnvironmentVariables,
    //     application.environmentVariables
    //   )

    const redeploy = false

    if (request.wantsJSON()) {
      return response.json({ success: true, redeploy })
    }

    return response
      .redirect()
      .withQs({ redeploy: redeploy || undefined })
      .back()
  }
}
