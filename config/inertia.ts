import User from '#common/database/models/user'
import { defineConfig } from '@adonisjs/inertia'
import type { InferSharedProps } from '@adonisjs/inertia/types'

const inertiaConfig = defineConfig({
  /**
   * Path to the Edge view that will be used as the root view for Inertia responses
   */
  rootView: 'inertia_layout',

  /**
   * Data that should be shared with all rendered pages
   */
  sharedData: {
    flashMessages: (ctx) => ctx.session?.flashMessages.all(),
    errors: (ctx) => ctx.session?.flashMessages.get('errors'),
    user: (ctx) => ctx.auth.user?.serialize(),
    path: (ctx) => ctx.request.url(true),
    qs: (ctx) => ctx.request.qs(),
    params: (ctx) => ctx.params,
    organizations: ({ auth }) => {
      if (auth.user) {
        return (auth.user as User).related('organizations').query()
      }
    },
  },

  /**
   * Path to the client-side entrypoint
   */
  entrypoint: 'app/common/ui/app/app.tsx',

  /**
   * Options for the server-side rendering
   */
  ssr: {
    enabled: true,
    entrypoint: 'app/common/ui/app/ssr.tsx',
  },
})

export default inertiaConfig

declare module '@adonisjs/inertia/types' {
  export interface SharedProps extends InferSharedProps<typeof inertiaConfig> {}
}
