import type { HttpContext } from '@adonisjs/core/http'

export default class ForgotPasswordController {
  async show({ inertia }: HttpContext) {
    return inertia.render('auth/forgot_password')
  }

  async handle({}: HttpContext) {}
}
