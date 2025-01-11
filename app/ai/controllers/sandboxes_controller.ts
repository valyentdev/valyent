import Organization from '#organizations/database/models/organization'
import bindOrganizationWithMember from '#organizations/decorators/bind_organization_with_member'
import env from '#start/env'
import { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import { DateTime, Duration } from 'luxon'

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
  async store({ response }: HttpContext, organization: Organization) {
    /**
     * Try to retrieve a fleet named `sandboxes` within the current organization.
     * It's the place where sandboxes are created.
     */
    let fleetExists = false
    try {
      await organization.ravelClient.fleets.get(
        env.get('VALYENT_SANDBOXES_FLEET_NAME', 'sandboxes')
      )
      fleetExists = true
    } catch {}

    /**
     * If we do not retrieve such a fleet, we try to create it.
     */
    if (fleetExists === false) {
      try {
        await organization.ravelClient.fleets.create({
          name: 'sandboxes',
        })
      } catch (error) {
        logger.error({ error }, 'Failed to create sandboxes fleet')
        return response.internalServerError('Failed to create sandboxes fleet')
      }
    }

    /**
     * Create new sandbox record in the database.
     */
    const now = DateTime.now()
    const sandbox = await organization.related('sandboxes').create({
      startedAt: now,
      endedAt: now.plus(Duration.fromObject({ minutes: 5 })),
      type: 'code-interpreter',
    })

    return { ...sandbox.serialize(), url: `http://localhost:49999` }

    // const machine = await organization.ravelClient.machines.create(fleet.id, {
    //   region: 'gra-1',
    //   config: {
    //     image: 'e2bdev/code-interpreter:latest',
    //     auto_destroy: true,
    //     guest: { cpu_kind: 'eco', cpus: 1, memory_mb: 1024 },
    //     workload: {},
    //   },
    // })
  }
}
