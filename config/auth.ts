import { defineConfig } from '@adonisjs/auth'
import { sessionGuard, sessionUserProvider } from '@adonisjs/auth/session'
import type { InferAuthEvents, Authenticators as RawAuthenticators } from '@adonisjs/auth/types'
import { tokensGuard, tokensUserProvider } from '@adonisjs/auth/access_tokens'

export const AFTER_AUTH_REDIRECT_URL = '/organizations'

const authConfig = defineConfig({
  default: 'web',
  guards: {
    api: tokensGuard({
      provider: tokensUserProvider({
        tokens: 'apiKeys',
        model: () => import('#organizations/database/models/organization'),
      }),
    }),
    web: sessionGuard({
      useRememberMeTokens: false,
      provider: sessionUserProvider({
        model: () => import('#common/database/models/user'),
      }),
    }),
  },
})

export default authConfig

/**
 * Inferring types from the configured auth
 * guards.
 */
declare module '@adonisjs/auth/types' {
  interface Authenticators extends InferAuthenticators<typeof authConfig> {}
}
declare module '@adonisjs/core/types' {
  interface EventsList extends InferAuthEvents<RawAuthenticators> {}
}
