import Permission from '#models/permission'
import { ApiNotFoundError } from '#utils/exceptions'

export class PermissionService {
  async paginateOrFail(tenantId: string, limit: number, lastPermissionId?: string) {
    const permissions = await Permission.query()
      .where('tenant_id', tenantId)
      .if(lastPermissionId, (q) => q.where('id', '>', lastPermissionId!))
      .orderBy('id', 'asc')
      .limit(limit + 1)
      .exec()
    return {
      data: permissions.slice(0, limit),
      hasMore: permissions.length > limit,
      lastPermissionId: permissions.length > limit ? permissions[limit].id : null,
    }
  }

  async findOrFail(tenantId: string, id: string) {
    const permission = await Permission.query().where('id', id).where('tenant_id', tenantId).first()
    if (!permission) throw new ApiNotFoundError('Permission not found')
    return permission
  }

  async findManyByIdsOrFail(tenantId: string, ids: string[]) {
    const permissions = await Permission.query()
      .where('tenant_id', tenantId)
      .whereIn('id', ids)
      .exec()
    if (permissions.length !== ids.length) throw new ApiNotFoundError('Permission not found')
    return permissions
  }

  async createOrFail(tenantId: string, action: string, resource: string) {
    let permission = await Permission.query()
      .where('tenant_id', tenantId)
      .where('action', action)
      .where('resource', resource)
      .first()
    if (permission) throw new ApiNotFoundError('Permission already exists')
    permission = await Permission.create({ tenantId, action, resource })
    return permission
  }

  async updateOrFail(tenantId: string, id: string, action?: string, resource?: string) {
    let permission = await this.findOrFail(tenantId, id)
    if (action) permission.action = action
    if (resource) permission.resource = resource
    await permission.save()
    return permission
  }

  async deleteOrFail(tenantId: string, id: string) {
    const permission = await this.findOrFail(tenantId, id)
    await permission.delete()
  }
}
