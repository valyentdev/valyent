import router from '@adonisjs/core/services/router'
import { BaseMail } from '@adonisjs/mail'
import env from '#start/env'
import Organization from '#organizations/database/models/organization'

export default class InviteMemberNotification extends BaseMail {
  from = 'Valyent <no-reply@console.valyent.cloud>'

  constructor(
    private readonly organization: Organization,
    private readonly email: string
  ) {
    super()
  }

  /**
   * The "prepare" method is called automatically when
   * the email is sent or queued.
   */
  prepare() {
    const prefix = env.get('APP_URL')
    const suffix = router
      .builder()
      .params({ organizationSlug: this.organization.slug })
      .makeSigned(`/organizations/:organizationSlug/join`, { expiresIn: '30m' })
    const url = `${prefix}${suffix}`

    this.message.subject(`You have been invited to join ${this.organization.name} on Valyent`)
    this.message.to(this.email)
    this.message.htmlView('emails/invite_member_email', {
      url,
      organizationName: this.organization.name,
    })
    this.message.textView('emails/invite_member_email.text', {
      url,
      organizationName: this.organization.name,
    })
  }
}
