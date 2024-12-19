import Organization from '#organizations/database/models/organization'
import env from '#start/env'
import type { HttpContext } from '@adonisjs/core/http'
import { Readable } from 'node:stream'
import { BodyInit, fetch } from 'undici'

export default class ProxyController {
  async handleRequest({ auth, request, response }: HttpContext) {
    /**
     * Retrieve the organization from the current auth session.
     */
    const organization = auth.user as Organization

    /**
     * Check whether the authenticated organization has a valid payment method.
     */
    if (!organization.hasValidPaymentMethod) {
      return response.status(402).json({ error: 'Payment method required.' })
    }

    /**
     * Strip the incoming URL from the "/v1/" prefix.
     */
    const path: string = request.url(true).split('/v1/')[1]
    const url = new URL(`${env.get('RAVEL_API_ENDPOINT')}/${path}`)

    /**
     * Set the namespace search param (and override if specified by error or ?).
     */
    url.searchParams.set('namespace', organization.slug)

    try {
      let body: BodyInit | undefined
      if (!['GET', 'HEAD'].includes(request.method())) {
        const rawBody = request.body()
        body = JSON.stringify(rawBody)
      }

      const allowedHeaderKeys = ['content-type', 'accept']
      const headers = new Headers()
      for (const headerKey in request.headers()) {
        if (allowedHeaderKeys.includes(headerKey.toLowerCase())) {
          headers.set(headerKey, request.headers()[headerKey] as string)
        }
      }

      const proxyResponse = await fetch(url, {
        method: request.method(),
        body,
        headers,
      })

      for (const [key, value] of proxyResponse.headers.entries()) {
        response.header(key, value)
      }
      response.status(proxyResponse.status)

      const contentType = proxyResponse.headers.get('content-type')
      if (
        contentType?.includes('text/event-stream') ||
        proxyResponse.headers.get('transfer-encoding') === 'chunked'
      ) {
        response.header('Cache-Control', 'no-cache')
        response.header('Connection', 'keep-alive')

        const reader = proxyResponse.body?.getReader()
        const stream = new Readable({
          async read() {
            try {
              const { done, value } = await reader!.read()
              if (done) {
                this.push(null)
              } else {
                this.push(value)
              }
            } catch (error) {
              this.destroy(error as Error)
            }
          },
        })

        return response.stream(stream)
      }

      if (contentType?.includes('application/json')) {
        const data = await proxyResponse.json()
        return response.json(data)
      }

      const data = await proxyResponse.text()
      return response.send(data)
    } catch (error) {
      console.error('Proxy request failed:', error)
      return response.status(500).json({ error: 'Proxy request failed' })
    }
  }
}
