import Role from '#models/role'
import { ApiNotFoundError } from '#utils/exceptions'

export class RoleService {
  async paginateOrFail(tenantId: string, limit: number, lastRoleId?: string) {
    const roles = await Role.query()
      .where('tenant_id', tenantId)
      .if(lastRoleId, (q) => q.where('id', '>', lastRoleId!))
      .orderBy('id', 'asc')
      .limit(limit + 1)
      .exec()
    return {
      data: roles.slice(0, limit),
      hasMore: roles.length > limit,
      lastRoleId: roles.length > limit ? roles[limit].id : null,
    }
  }

  async findOrFail(tenantId: string, id: string) {
    const role = await Role.query().where('id', id).where('tenant_id', tenantId).first()
    if (!role) throw new ApiNotFoundError('Role not found')
    return role
  }

  async deleteOrFail(tenantId: string, id: string) {
    const role = await this.findOrFail(tenantId, id)
    await role.delete()
  }
}
