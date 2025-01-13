import Application from '#applications/database/models/application'
import Organization from '#organizations/database/models/organization'
import bindOrganizationWithMember from '#organizations/decorators/bind_organization_with_member'
import { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import { DateTime, Duration } from 'luxon'
import { Fleet, RestartPolicy } from 'valyent.ts'

export default class SandboxesController {
  @bindOrganizationWithMember
  async index({ request, inertia }: HttpContext, organization: Organization) {
    const sandboxes = await organization
      .related('sandboxes')
      .query()
      .orderBy('created_at', 'desc')
      .paginate(request.input('page', 1), 10)
    return inertia.render('ai/sandboxes', { organization, sandboxes })
  }

  @bindOrganizationWithMember
  async show({ params, response }: HttpContext, organization: Organization) {
    const sandbox = await organization
      .related('sandboxes')
      .query()
      .where('id', params.sandboxId)
      .first()
    if (sandbox === null) {
      return response.notFound()
    }
    console.log(`https://${sandbox.id}-49999.valyent.dev`)
    return response.json({ ...sandbox.serialize(), url: `https://${sandbox.id}-49999.valyent.dev` })
  }

  @bindOrganizationWithMember
  async store({ request, response }: HttpContext, organization: Organization) {
    /**
     * Try to retrieve an application named `sandboxes` within the current organization.
     * It's the place where machines for sandboxes are created.
     */
    let fleetExists: boolean
    try {
      await organization.related('applications').query().where('name', 'sandboxes').firstOrFail()
      fleetExists = true
    } catch {
      fleetExists = false
    }

    /**
     * If we do not retrieve such a fleet, we try to create it.
     */
    if (fleetExists === false) {
      let fleet: Fleet
      try {
        fleet = await organization.ravelClient.fleets.create({
          name: 'sandboxes',
        })
      } catch (error) {
        logger.error({ error }, 'Failed to create sandboxes fleet')
        return response.internalServerError('Failed to create sandboxes fleet')
      }

      /**
       * Store associated application record in the database.
       */
      const application = new Application()
      application.id = fleet.id
      application.name = 'sandboxes'
      application.organizationId = organization.id
      await application.save()
    }

    /**
     * Create new sandbox record in the database.
     */
    const fiveMinutes = Duration.fromObject({ minutes: 5 })
    const machine = await organization.ravelClient.machines.create('sandboxes', {
      region: 'gra-1',
      config: {
        image: 'valyent/code-interpreter:latest',
        auto_destroy: true,
        guest: { cpu_kind: 'eco', cpus: 1, memory_mb: 1024 },
        stop_config: {
          timeout: fiveMinutes.toMillis(),
        },
        workload: {
          init: { user: 'root' },
          restart: { policy: RestartPolicy.Never },
        },
      },
      skip_start: true,
      enable_machine_gateway: true,
    })

    // Let's wait for 1 second
    await new Promise((resolve) => setTimeout(resolve, 1000))

    try {
      await machine.start()
    } catch (error) {
      return
    }
    try {
      await machine.wait('running')
    } catch (error) {}
    /**
     * Store sandbox record in the database.
     */
    const now = DateTime.now()
    const sandbox = await organization.related('sandboxes').create({
      id: machine.id,
      startedAt: now,
      endedAt: now.plus(fiveMinutes),
      type: request.input('type'),
    })

    return { ...sandbox.serialize(), url: `https://${sandbox.id}-49999.valyent.dev` }
  }
}
