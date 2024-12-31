import User from '#common/database/models/user'
import { signInValidator } from '#auth/validators/sign_in_validator'
import type { HttpContext } from '@adonisjs/core/http'
import { afterAuthRedirectUrl } from '#config/auth'

export default class SignInController {
  async show({ inertia }: HttpContext) {
    return inertia.render('auth/sign_in')
  }

  async handle({ auth, request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(signInValidator)
    const nextPath = request.input('next')
    const user = await User.verifyCredentials(email, password)

    await auth.use('web').login(user)

    if (nextPath) {
      return response.redirect().toPath(nextPath)
    }

    return response.redirect().toPath(afterAuthRedirectUrl)
  }
}
