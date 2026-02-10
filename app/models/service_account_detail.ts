import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ServiceAccountDetail extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare principalId: string

  @column()
  declare clientId: string

  @column({ serializeAs: null })
  declare clientSecret: string
}
