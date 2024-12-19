import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'api_keys'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table.string('type').notNullable()
      table.string('name').notNullable().defaultTo('Onboarding')
      table.string('hash').notNullable()
      table.text('abilities').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.timestamp('last_used_at').nullable()
      table.timestamp('expires_at').nullable()

      table
        .string('tokenable_id')
        .notNullable()
        .references('id')
        .inTable('organizations')
        .onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
