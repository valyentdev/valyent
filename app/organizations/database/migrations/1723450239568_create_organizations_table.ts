import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'organizations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()
      table.string('name').notNullable()
      table.string('slug').notNullable().unique()

      table.string('stripe_customer_id').nullable()
      table.string('stripe_payment_method_id').nullable().defaultTo(null)
      table.dateTime('stripe_payment_method_expiration_date').nullable().defaultTo(null)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
