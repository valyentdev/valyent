import transmit from '@adonisjs/transmit/services/main'
import type { HttpContext } from '@adonisjs/core/http'
import OrganizationMember from '#organizations/database/models/organization_member'
import Organization from '#organizations/database/models/organization'

transmit.authorize<{ organizationSlug: string }>(
  `organizations/:organizationSlug/:applicationId/deployments/updates`,
  async (ctx: HttpContext, { organizationSlug }) => {
    try {
      const organization = await Organization.findByOrFail('slug', organizationSlug)
      await OrganizationMember.query()
        .where('organizationId', organization.id)
        .andWhere('userId', ctx.auth.user!.id)
        .firstOrFail()
      return true
    } catch {
      return false
    }
  }
)
