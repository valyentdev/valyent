import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'applications'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()
      table
        .string('organization_id')
        .notNullable()
        .references('organizations.id')
        .onDelete('CASCADE')
      table.string('name').notNullable()
      table.string('fleet_id').nullable().index().unique({
        deferrable: 'deferred',
      })

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
