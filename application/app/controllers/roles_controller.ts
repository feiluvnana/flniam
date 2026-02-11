import Role from '#models/role'
import { PermissionService } from '#services/permission_service'
import { RoleService } from '#services/role_service'
import { indexRoleValidator, storeRoleValidator } from '#validators/role'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class RolesController {
  constructor(
    private readonly roleService: RoleService,
    private readonly permissionService: PermissionService
  ) {}

  /**
   * @index
   * @paramQuery limit -  - @type(number)
   * @paramQuery lastRoleId -  - @type(string)
   * @responseBody 200 - {"data": "<Role[]>", "hasMore": "<boolean>", "lastRoleId": "<string>"}
   */
  async index({ tenant, request, response }: HttpContext) {
    const payload = await indexRoleValidator.validate(request.all())
    const limit = payload.limit || 10
    const result = await this.roleService.paginateOrFail(tenant.id, limit, payload.lastRoleId)
    return response.ok(result)
  }

  /**
   * @show
   * @paramPath id -  - @type(string)
   * @responseBody 200 - {"data": "<Role>"}
   */
  async show({ tenant, params, response }: HttpContext) {
    const role = await this.roleService.findOrFail(tenant.id, params.id)
    return response.ok({ data: role })
  }

  /**
   * @store
   * @requestBody <storeRoleValidator>
   * @responseBody 201 - {"data": "<Role>"}
   */
  async store({ tenant, request, response }: HttpContext) {
    const payload = await storeRoleValidator.validate(request.all())
    await this.permissionService.findManyByIdsOrFail(tenant.id, payload.permissionIds)
    const role = await Role.create({ tenantId: tenant.id, name: payload.name })
    await role.related('permissions').attach(payload.permissionIds)
    return response.created({ data: role })
  }

  /**
   * @destroy
   * @paramPath id -  - @type(string)
   * @responseBody 204 - No Content
   */
  async destroy({ tenant, params, response }: HttpContext) {
    await this.roleService.deleteOrFail(tenant.id, params.id)
    return response.noContent()
  }
}
