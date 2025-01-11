import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'sandboxes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary().notNullable()
      table.timestamp('started_at')
      table.timestamp('ended_at')
      table.string('type')
      table
        .string('organization_id')
        .references('organizations.id')
        .onDelete('CASCADE')
        .notNullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
