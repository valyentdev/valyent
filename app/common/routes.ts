import router from '@adonisjs/core/services/router'

const HealthChecksController = () => import('#common/controllers/health_checks_controller')

router.get('/', async ({ auth, response }) => {
  await auth.check()

  const user = auth.user

  if (user === undefined) {
    return response.redirect('/auth/sign_up')
  }

  /**
   * If the user is not related to any organization,
   * then redirect to the organizations create page.
   */
  return response.redirect('/organizations')
})

router.get('/health', [HealthChecksController])
