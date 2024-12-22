import Organization from '#organizations/database/models/organization'
import bindOrganizationWithMember from '#organizations/decorators/bind_organization_with_member'
import { HttpContext } from '@adonisjs/core/http'

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
  async store({}: HttpContext) {}

  @bindOrganizationWithMember
  async runCode({}: HttpContext) {}
}
