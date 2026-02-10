import Permission from '#models/permission'
import Tenant from '#models/tenant'
import { storePermissionValidator } from '#validators/permissions_validator'
import type { HttpContext } from '@adonisjs/core/http'

export default class PermissionsController {
  /**
   * @index
   * @responseBody 200 - {"status": 200, "data": "<Permission[]>"}
   */
  async index({ response }: HttpContext) {
    const permissions = await Permission.all()
    return response.ok({ status: 200, data: permissions })
  }

  /**
   * @store
   * @requestBody <storePermissionValidator>
   * @responseBody 201 - {"status": 201, "data": "<Permission>"}
   */
  async store({ request, response }: HttpContext) {
    const data = request.all()
    const [error, payload] = await storePermissionValidator.tryValidate(data)
    if (error) {
      return response.badRequest(error)
    }
    const tenant = await Tenant.findOrFail(payload.tenantId)
    if (!tenant) {
      return response.notFound({ status: 404, message: 'Tenant not found' })
    }
    const permission = await Permission.create(payload)
    return response.created({ status: 201, data: permission })
  }
}
