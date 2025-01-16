import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'applications'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.json('guest').defaultTo(`{"cpu_kind": "eco", "memory_mb": 512, "cpus": 1}`)
      table.string('region').defaultTo('gra-1')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('guest')
      table.dropColumn('region')
    })
  }
}
