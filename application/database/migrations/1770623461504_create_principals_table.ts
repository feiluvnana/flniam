import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'principals'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()
      table.string('tenant_id').notNullable()
      table.enum('type', ['user', 'service_account']).notNullable()
      table.enum('status', ['active', 'archived', 'suspended']).notNullable().defaultTo('active')
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.foreign('tenant_id').references('id').inTable('tenants').onDelete('CASCADE')
    })

    this.schema.createTable('user_details', (table) => {
      table.string('principal_id').primary()
      table.string('username').notNullable()
      table.string('password').notNullable()
      table.foreign('principal_id').references('id').inTable('principals').onDelete('CASCADE')
    })

    this.schema.createTable('service_account_details', (table) => {
      table.string('principal_id').primary()
      table.string('client_id').notNullable()
      table.string('client_secret').notNullable()
      table.foreign('principal_id').references('id').inTable('principals').onDelete('CASCADE')
    })

    this.schema.createTable('principals_roles', (table) => {
      table.string('principal_id').notNullable()
      table.string('role_id').notNullable()
      table.primary(['principal_id', 'role_id'])
      table.foreign('principal_id').references('id').inTable('principals').onDelete('CASCADE')
      table.foreign('role_id').references('id').inTable('roles').onDelete('CASCADE')
    })

    this.schema.createTable('principals_permissions', (table) => {
      table.string('principal_id').notNullable()
      table.string('permission_id').notNullable()
      table.primary(['principal_id', 'permission_id'])
      table.foreign('principal_id').references('id').inTable('principals').onDelete('CASCADE')
      table.foreign('permission_id').references('id').inTable('permissions').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable('user_details')
    this.schema.dropTable('service_account_details')
    this.schema.dropTable('principals_roles')
    this.schema.dropTable('principals_permissions')
    this.schema.dropTable(this.tableName)
  }
}
