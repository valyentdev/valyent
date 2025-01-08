import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'deployments'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('errorMessage').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('errorMessage')
    })
  }
}
