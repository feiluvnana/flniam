import Permission from '#models/permission'
import Tenant from '#models/tenant'
import { indexPermissionValidator, storePermissionValidator } from '#validators/permission'
import type { HttpContext } from '@adonisjs/core/http'

export default class PermissionsController {
  /**
   * @index
   * @responseBody 200 - {"status": 200, "data": "<Permission[]>"}
   */
  async index({ request, response }: HttpContext) {
    const data = request.all()
    const [error, payload] = await indexPermissionValidator.tryValidate(data)
    if (error) {
      return response.badRequest(error)
    }
    const limit = payload.limit || 10
    const permissionQuery = Permission.query()
      .orderBy('id', 'asc')
      .limit(limit + 1)

    if (payload.tenantId) {
      permissionQuery.where('tenant_id', payload.tenantId)
    }
    if (payload.lastPermissionId) {
      permissionQuery.andWhere('id', '>', payload.lastPermissionId)
    }

    const permissions = await permissionQuery.exec()
    return response.ok({
      data: permissions.slice(0, limit),
      lastPermissionId: permissions.length > limit ? permissions[limit].id : null,
    })
  }

  /**
   * @show
   * @params id - @type(string)
   * @responseBody 200 - {"status": 200, "data": "<Permission>"}
   */
  async show({ params, response }: HttpContext) {
    const permission = await Permission.find(params.id)
    if (!permission) {
      return response.notFound({ message: 'Permission not found' })
    }
    return response.ok({ data: permission })
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
    const tenant = await Tenant.find(payload.tenantId)
    if (!tenant) {
      return response.notFound({ message: 'Tenant not found' })
    }
    const permission = await Permission.create(payload)
    return response.created({ data: permission })
  }

  /**
   * @destroy
   * @params id - @type(string)
   * @responseBody 204 - No Content
   */
  async destroy({ params, response }: HttpContext) {
    const permission = await Permission.find(params.id)
    if (!permission) {
      return response.notFound({ message: 'Permission not found' })
    }
    await permission.delete()
    return response.ok({ data: permission })
  }
}
