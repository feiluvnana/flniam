import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'roles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()
      table.string('tenant_id').notNullable()
      table.string('name').notNullable()
      table.string('description').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.foreign('tenant_id').references('id').inTable('tenants').onDelete('CASCADE')
    })
    this.schema.createTable('roles_permissions', (table) => {
      table.string('role_id').notNullable()
      table.string('permission_id').notNullable()
      table.primary(['role_id', 'permission_id'])
      table.foreign('role_id').references('id').inTable('roles').onDelete('CASCADE')
      table.foreign('permission_id').references('id').inTable('permissions').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
