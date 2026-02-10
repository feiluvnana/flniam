import Permission from '#models/permission'
import Role from '#models/role'
import Tenant from '#models/tenant'
import { indexRoleValidator, storeRoleValidator } from '#validators/role'
import type { HttpContext } from '@adonisjs/core/http'

export default class RolesController {
  /**
   * @index
   * @responseBody 200 - {"status": 200, "data": "<Role[]>"}
   */
  async index({ request, response }: HttpContext) {
    const data = request.all()
    const [error, payload] = await indexRoleValidator.tryValidate(data)
    if (error) {
      return response.badRequest(error)
    }
    const tenant = await Tenant.find(payload.tenantId)
    if (!tenant) {
      return response.notFound({ message: 'Tenant not found' })
    }
    const limit = payload.limit || 10
    const roleQuery = Role.query()
      .where('tenant_id', payload.tenantId)
      .orderBy('id', 'asc')
      .limit(limit + 1)
    if (payload.lastRoleId) {
      roleQuery.andWhere('id', '>', payload.lastRoleId)
    }
    const roles = await roleQuery.exec()
    return response.ok({
      data: roles.slice(0, limit),
      lastRoleId: roles.length > limit ? roles[limit].id : null,
    })
  }

  /**
   * @show
   * @params id - @type(string)
   * @responseBody 200 - {"status": 200, "data": "<Role>"}
   */
  async show({ params, response }: HttpContext) {
    const role = await Role.find(params.id)
    if (!role) {
      return response.notFound({ message: 'Role not found' })
    }
    return response.ok({ data: role })
  }

  /**
   * @store
   * @requestBody <storeRoleValidator>
   * @responseBody 201 - {"status": 201, "data": "<Role>"}
   */
  async store({ request, response }: HttpContext) {
    const data = request.all()
    const [error, payload] = await storeRoleValidator.tryValidate(data)
    if (error) {
      return response.badRequest(error)
    }
    const tenant = await Tenant.findOrFail(payload.tenantId)
    if (!tenant) {
      return response.notFound({ message: 'Tenant not found' })
    }
    const permissions = await Permission.query().whereIn('id', payload.permissionIds).exec()
    if (permissions.length !== payload.permissionIds.length) {
      return response.notFound({ message: 'Permission not found' })
    }
    const role = await Role.create(payload)
    return response.created({ data: role })
  }

  /**
   * @destroy
   * @params id - @type(string)
   * @responseBody 204 - No Content
   */
  async destroy({ params, response }: HttpContext) {
    const role = await Role.find(params.id)
    if (!role) {
      return response.notFound({ message: 'Role not found' })
    }
    await role.delete()
    return response.noContent()
  }
}
