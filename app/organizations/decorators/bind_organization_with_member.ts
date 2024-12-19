import type { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import OrganizationMember from '../database/models/organization_member.js'
import Organization from '../database/models/organization.js'
import User from '#common/database/models/user'

export default function bindOrganizationWithMember(
  _target: any,
  _key: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value

  descriptor.value = async function (this: any, ctx: HttpContext) {
    const { params, response } = ctx
    let organization: Organization
    let organizationMember: OrganizationMember
    try {
      organization = await Organization.query().where('slug', params.organizationSlug).firstOrFail()
      organizationMember = await OrganizationMember.query()
        .where('user_id', (ctx.auth.user as User)!.id)
        .andWhere('organization_id', organization.id)
        .firstOrFail()
    } catch (error) {
      logger.error(error, 'Failed to bind organization')
      return response.notFound()
    }

    return await originalMethod.call(this, ctx, organization, organizationMember)
  }
}
