import { Request, Route } from '@adonisjs/core/http'
import env from './env.js'

Request.macro('wantsJSON', function (this: Request) {
  const firstType = this.types()[0]
  if (!firstType) {
    return false
  }

  return firstType.includes('/json') || firstType.includes('+json')
})

Route.macro('withDomain', function (this: Route, domain: string) {
  if (env.get('NODE_ENV') === 'production') {
    this.domain(domain)
  }
  return this
})

declare module '@adonisjs/core/http' {
  interface Request {
    wantsJSON(): boolean
  }

  export interface Route {
    withDomain(domain: string): Route
  }
}
