import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class UserDetail extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare principalId: string

  @column()
  declare username: string

  @column({ serializeAs: null })
  declare password: string
}
