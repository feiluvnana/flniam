import Permission from '#models/permission'
import Role from '#models/role'
import Tenant from '#models/tenant'
import { storeRoleValidator } from '#validators/roles_validator'
import type { HttpContext } from '@adonisjs/core/http'

export default class RolesController {
  /**
   * @index
   * @responseBody 200 - {"status": 200, "data": "<Role[]>"}
   */
  async index({ response }: HttpContext) {
    const roles = await Role.all()
    return response.ok({ status: 200, data: roles })
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
      return response.notFound({ status: 404, message: 'Tenant not found' })
    }
    const permissions = await Permission.query().whereIn('id', payload.permissionIds).exec()
    if (permissions.length !== payload.permissionIds.length) {
      return response.notFound({ status: 404, message: 'Permission not found' })
    }
    const role = await Role.create(payload)
    return response.created({ status: 201, data: role })
  }
}
