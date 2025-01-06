import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'deployments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()
      table.string('application_id').notNullable().references('applications.id').onDelete('CASCADE')
      table
        .enum('status', [
          'building',
          'build-failed',
          'deploying',
          'deployment-failed',
          'stopped',
          'success',
        ])
        .notNullable()
        .defaultTo('building')
      table.enum('origin', ['cli', 'github', 'redeploy']).notNullable()

      // GitHub-related fields.
      table.integer('github_check_id').nullable()
      table.string('commit_sha').nullable()
      table.string('commit_message').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
