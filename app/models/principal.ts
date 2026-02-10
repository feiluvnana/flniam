import Generators from '#utils/generators'
import { BaseModel, beforeCreate, column, hasOne, manyToMany } from '@adonisjs/lucid/orm'
import type { HasOne, ManyToMany } from '@adonisjs/lucid/types/relations'
import Permission from './permission.js'
import Role from './role.js'
import ServiceAccountDetail from './service_account_detail.js'
import UserDetail from './user_detail.js'

export default class Principal extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column({ columnName: 'tenant_id' })
  declare tenantId: string

  @column()
  declare type: 'user' | 'service_account'

  @hasOne(() => UserDetail, { foreignKey: 'principalId', localKey: 'id' })
  declare userDetail: HasOne<typeof UserDetail>

  @hasOne(() => ServiceAccountDetail, { foreignKey: 'principalId', localKey: 'id' })
  declare serviceAccountDetail: HasOne<typeof ServiceAccountDetail>

  @column()
  declare status: 'active' | 'inactive'

  @manyToMany(() => Role, {
    pivotTable: 'principals_roles',
    pivotForeignKey: 'principal_id',
    pivotRelatedForeignKey: 'role_id',
  })
  declare roles: ManyToMany<typeof Role>

  @manyToMany(() => Permission, {
    pivotTable: 'principals_permissions',
    pivotForeignKey: 'principal_id',
    pivotRelatedForeignKey: 'permission_id',
  })
  declare permissions: ManyToMany<typeof Permission>

  @beforeCreate()
  public static async generateId(principal: Principal) {
    let prefix = ''
    switch (principal.type) {
      case 'user':
        prefix = 'usr'
        break
      case 'service_account':
        prefix = 'svc'
        break
      default:
        throw new Error('Invalid principal type')
    }
    principal.id = Generators.id(prefix)
  }
}
