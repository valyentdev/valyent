import { HttpContext } from '@adonisjs/core/http'
import EnvironmentVariablesService from '#applications/services/environment_variables_service'
import bindApplication from '#applications/decorators/bind_application'
import Application from '#applications/database/models/application'

export default class EnvironmentVariablesController {
  private readonly environmentVariablesService = new EnvironmentVariablesService()

  @bindApplication
  public async edit({ request, inertia }: HttpContext, application: Application) {
    if (request.wantsJSON()) {
      return { env: application.env }
    }

    return inertia.render('applications/environment_variables', { application })
  }

  @bindApplication
  public async update({ response, request }: HttpContext, application: Application) {
    const oldEnv = { ...application.env }

    if (request.wantsJSON()) {
      application.env = {
        ...oldEnv,
        ...request.body(),
      }
    } else {
      application.env =
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
