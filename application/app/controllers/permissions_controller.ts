import { PermissionService } from '#services/permission_service'
import {
  indexPermissionValidator,
  storePermissionValidator,
  updatePermissionValidator,
} from '#validators/permission'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class PermissionsController {
  constructor(private permissionService: PermissionService) {}

  /**
   * @index
   * @paramQuery limit -  - @type(number)
   * @paramQuery lastPermissionId -  - @type(string)
   * @responseBody 200 - {"data": "<Permission[]>", "hasMore": "boolean", "lastPermissionId": "string"}
   */
  async index({ tenant, request, response }: HttpContext) {
    const payload = await indexPermissionValidator.validate(request.all())
    const limit = payload.limit || 10
    const result = await this.permissionService.paginateOrFail(
      tenant.id,
      limit,
      payload.lastPermissionId
    )
    return response.ok(result)
  }

  /**
   * @show
   * @paramPath id -  - @type(string)
   * @responseBody 200 - {"data": "<Permission>"}
   */
  async show({ tenant, params, response }: HttpContext) {
    const permission = await this.permissionService.findOrFail(tenant.id, params.id)
    return response.ok({ data: permission })
  }

  /**
   * @store
   * @requestBody <storePermissionValidator>
   * @responseBody 201 - {"data": "<Permission>"}
   */
  async store({ tenant, request, response }: HttpContext) {
    const payload = await storePermissionValidator.validate(request.all())
    const permission = await this.permissionService.createOrFail(
      tenant.id,
      payload.action,
      payload.resource
    )
    return response.created({ data: permission })
  }

  /**
   * @update
   * @paramPath id -  - @type(string)
   * @requestBody <updatePermissionValidator>
   * @responseBody 200 - {"data": "<Permission>"}
   */
  async update({ tenant, params, request, response }: HttpContext) {
    const payload = await updatePermissionValidator.validate(request.all())
    const permission = await this.permissionService.updateOrFail(
      tenant.id,
      params.id,
      payload.action,
      payload.resource
    )
    return response.ok({ data: permission })
  }

  /**
   * @destroy
   * @paramPath id -  - @type(string)
   * @responseBody 204 - No Content
   */
  async destroy({ tenant, params, response }: HttpContext) {
    await this.permissionService.deleteOrFail(tenant.id, params.id)
    return response.noContent()
  }
}
