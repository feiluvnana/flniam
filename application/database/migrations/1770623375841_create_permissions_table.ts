import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'permissions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()
      table.string('tenant_id').notNullable()
      table.string('action').notNullable()
      table.string('resource').notNullable()
      table.json('fields').nullable()
      table.json('condition').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.foreign('tenant_id').references('id').inTable('tenants').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
