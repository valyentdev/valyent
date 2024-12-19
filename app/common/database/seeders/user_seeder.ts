import User from '#common/database/models/user'
import Organization from '#organizations/database/models/organization'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const user = await User.create({
      fullName: 'Maurice Ravel',
      email: 'maurice@ravel.fr',
      password: 'maurice@ravel.fr',
    })

    /**
     * Create an organization and make the user the owner.
     */
    const organization = await Organization.create({
      name: 'Bolero Company',
      slug: 'bolero-company',
    })
    await organization.related('members').create({
      role: 'owner',
      userId: user.id,
    })
  }
}
