import bindOrganizationWithMember from '#organizations/decorators/bind_organization_with_member'
import { HttpContext } from '@adonisjs/core/http'

export default class SandboxesController {
  @bindOrganizationWithMember
  async index({ inertia }: HttpContext) {
    return inertia.render('ai/sandboxes')
  }

  @bindOrganizationWithMember
  async store({}: HttpContext) {}
}
