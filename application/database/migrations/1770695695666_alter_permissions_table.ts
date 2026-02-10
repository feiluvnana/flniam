import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'permissions'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('fields')
      table.dropColumn('condition')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.json('fields').nullable()
      table.json('condition').nullable()
    })
  }
}
