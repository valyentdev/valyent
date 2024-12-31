import User from '#common/database/models/user'
import { signUpValidator } from '#auth/validators/sign_up_validator'
import type { HttpContext } from '@adonisjs/core/http'
import { afterAuthRedirectUrl } from '#config/auth'

export default class SignUpController {
  async show({ inertia }: HttpContext) {
    return inertia.render('auth/sign_up')
  }

  async handle({ auth, request, response, session }: HttpContext) {
    const payload = await request.validateUsing(signUpValidator)

    const userAlreadyExists = await User.findBy('email', payload.email)
    if (userAlreadyExists !== null) {
      session.flash('errors.email', 'Email already exists')
      return response.redirect().back()
    }

    const user = await User.create(payload)
    await user.save()

    await auth.use('web').login(user)

    return response.redirect(afterAuthRedirectUrl)
  }
}
