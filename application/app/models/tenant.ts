import Generators from '#utils/generators'
import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class Tenant extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column({ serializeAs: null })
  declare secret: string

  @column()
  declare description: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  public static async generateId(tenant: Tenant) {
    tenant.id = Generators.id('tnt')
  }

  @beforeCreate()
  public static async generateSecret(tenant: Tenant) {
    tenant.secret = Generators.secret()
  }
}
