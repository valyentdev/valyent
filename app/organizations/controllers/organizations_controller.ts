import type { HttpContext } from '@adonisjs/core/http'
import mail from '@adonisjs/mail/services/main'
import vine from '@vinejs/vine'
import User from '#common/database/models/user'
import Organization from '#organizations/database/models/organization'
import OrganizationMember from '#organizations/database/models/organization_member'
import bindOrganizationWithMember from '#organizations/decorators/bind_organization_with_member'
import OrganizationCreated from '#organizations/events/organization_created'
import InviteMemberNotification from '#organizations/notifications/invite_member_notification'
import { createOrganizationValidator } from '#organizations/validators/create_organization_validator'
import { updateOrganizationValidator } from '#organizations/validators/update_organization_validator'

export default class OrganizationsController {
  async index({ auth, response }: HttpContext) {
    const user = auth.user as User

    /**
     * If the current user is related to any organization,
     * then redirect to the first organization.
     */
    await user.load('organizations')

    if (user!.organizations.length) {
      const organization = user.organizations[0]
      return response.redirect().toPath(`/organizations/${organization.slug}`)
    }

    /**
     * If the user is not related to any organization,
     * then redirect to the organizations create page.
     */
    return response.redirect('/organizations/create')
  }

  @bindOrganizationWithMember
  async show({ inertia }: HttpContext, organization: Organization) {
    return inertia.render('organizations/show', { organization })
  }

  async store({ auth, request, response }: HttpContext) {
    const payload = await request.validateUsing(createOrganizationValidator)
    const organization = await Organization.create(payload)
    await OrganizationMember.create({
      role: 'owner',
      userId: (auth.user as User).id,
      organizationId: organization.id,
    })
    await OrganizationCreated.dispatch(organization)

    return response.redirect().toPath(`/organizations/${organization.slug}`)
  }

  @bindOrganizationWithMember
  async edit(
    { inertia }: HttpContext,
    organization: Organization,
    organizationMember: OrganizationMember
  ) {
    const isOwner = organizationMember.role === 'owner'
    await organization.load('members', (query) => {
      query.preload('user')
    })
    return inertia.render('organizations/edit', { organization, isOwner })
  }

  @bindOrganizationWithMember
  async update(
    { request, response }: HttpContext,
    organization: Organization,
    organizationMember: OrganizationMember
  ) {
    if (organizationMember.role !== 'owner') {
      return response.unauthorized()
    }
    const isOwner = organizationMember.role === 'owner'
    if (!isOwner) {
      return response.unauthorized()
    }
    const payload = await request.validateUsing(updateOrganizationValidator)
    organization.merge(payload)
    await organization.save()
    return response.redirect().back()
  }

  @bindOrganizationWithMember
  async destroy(
    { response }: HttpContext,
    organization: Organization,
    organizationMember: OrganizationMember
  ) {
    if (organizationMember.role !== 'owner') {
      return response.unauthorized()
    }
    await organization.delete()
    return response.redirect().toPath('/organizations')
  }

  @bindOrganizationWithMember
  async quit(
    { response }: HttpContext,
    _organization: Organization,
    organizationMember: OrganizationMember
  ) {
    if (organizationMember.role !== 'member') {
      return response.unauthorized()
    }
    await organizationMember.delete()
    return response.redirect().toPath('/organizations')
  }

  @bindOrganizationWithMember
  async invite(
    { request, response }: HttpContext,
    organization: Organization,
    organizationMember: OrganizationMember
  ) {
    if (organizationMember.role !== 'owner') {
      return response.unauthorized()
    }
    const payload = await request.validateUsing(
      vine.compile(
        vine.object({
          email: vine.string().email(),
        })
      )
    )

    await mail.send(new InviteMemberNotification(organization, payload.email))
    return response.redirect().toPath(`/organizations/${organization.slug}/edit`)
  }

  async join({ auth, request, response }: HttpContext) {
    if (!request.hasValidSignature()) {
      return response.redirect().toPath('/auth/sign_up')
    }
    const organization = await Organization.findByOrFail('slug', request.param('organizationSlug'))
    await OrganizationMember.firstOrCreate(
      { organizationId: organization.id, userId: (auth.user as User).id, role: 'member' },
      { organizationId: organization.id, userId: (auth.user as User).id, role: 'member' }
    )
    return response.redirect().toPath(`/organizations/${organization.slug}`)
  }
}
