import ApiKey from '#api_keys/database/models/api_key'
import { createAPIKeyValidator } from '#api_keys/validators'
import Organization from '#organizations/database/models/organization'
import bindOrganizationWithMember from '#organizations/decorators/bind_organization_with_member'
import type { HttpContext } from '@adonisjs/core/http'

export default class APIKeysController {
  @bindOrganizationWithMember
  async index({ inertia, params }: HttpContext, organization: Organization) {
    /**
     * Retrieve API Keys from the current organization.
     */
    const apiKeys = await ApiKey.query()
      .where('tokenable_id', organization.id)
      .orderBy('created_at', 'desc')

    /**
     * Return the API Keys table.
     */
    return inertia.render('api_keys/index', { apiKeys, resource: params.resource })
  }

  @bindOrganizationWithMember
  async store({ request, response, session }: HttpContext, organization: Organization) {
    /**
     * Count existing API keys for the organization.
     */
    const existingKeysCounts = await ApiKey.query()
      .where('tokenable_id', organization.id)
      .count('id as total')
    const count = Number.parseInt(existingKeysCounts[0].$extras.total)

    /**
     * Check if the limit has been reached.
     */
    if (count >= 100) {
      /**
       * Flash a new error message to the session, informing the user that the threre is no more space for API keys.
       */
      session.flash(
        'errors.global',
        'You have reached the maximum limit of 10 API keys for this organization.'
      )

      /**
       * Redirect back the user.
       */
      return response.redirect().back()
    }

    /**
     * Validate the request payload.
     */
    const payload = await request.validateUsing(createAPIKeyValidator)

    /**
     * Create a new API key for the current organization.
     */
    const apiKey = await Organization.apiKeys.create(organization, ['*'], payload)

    /**
     * Flash the API key value (last time it will ever be shared to the user).
     */
    session.flash('api_key_created', apiKey.value!.release())

    /**
     * Redirect back the user.
     */
    return response.redirect().back()
  }

  @bindOrganizationWithMember
  async update({ request, response }: HttpContext, organization: Organization) {
    /**
     * Try retrieving the API key.
     */
    const apiKey = await ApiKey.find(request.param('id'))
    if (apiKey === null) {
      return response.notFound('API key not found.')
    }

    /**
     * Check whether the current user is the owner of this API key.
     */
    if (organization.id !== apiKey.organization.id) {
      return response.unauthorized('This API key is not yours.')
    }

    /**
     * Validate the request payload.
     */
    const payload = await request.validateUsing(createAPIKeyValidator)

    /**
     * Update the API key fields.
     */
    apiKey.merge(payload)

    /**
     * Save the API key in the database.
     */
    await apiKey.save()

    /**
     * Redirect back the user.
     */
    return response.redirect().back()
  }

  async destroy({ request, response }: HttpContext) {
    const apiKey = await ApiKey.findOrFail(request.param('id'))
    await apiKey.delete()

    /**
     * Redirect back the user.
     */
    return response.redirect().back()
  }
}
