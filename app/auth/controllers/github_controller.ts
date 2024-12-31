import User from '#common/database/models/user'
import { afterAuthRedirectUrl } from '#config/auth'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthGithubController {
  async redirect({ ally }: HttpContext) {
    return ally.use('github').redirect()
  }

  async callback({ ally, auth, response }: HttpContext) {
    const gh = ally.use('github')

    if (gh.accessDenied()) {
      return 'You have cancelled the login process'
    }

    if (gh.stateMisMatch()) {
      return 'We are unable to verify the request. Please try again'
    }

    if (gh.hasError()) {
      return gh.getError()
    }

    const githubUser = await gh.user()

    let user = await User.findBy('email', githubUser.email)
    if (!user) {
      user = await User.create({
        email: githubUser.email,
        fullName: githubUser.name,
        githubId: githubUser.id,
      })
    } else {
      user.githubId = githubUser.id
    }
    await auth.use('web').login(user)

    return response.redirect().toPath(afterAuthRedirectUrl)
  }
}
