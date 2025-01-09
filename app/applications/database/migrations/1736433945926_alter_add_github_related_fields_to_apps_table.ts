import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'applications'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('github_installation_id').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('github_installation_id')
    })
  }
}
