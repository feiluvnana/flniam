import { TenantService } from '#services/tenant_service'
import { storeTenantValidator } from '#validators/tenant'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class TenantsController {
  constructor(private tenantService: TenantService) {}

  /**
   * @store
   * @requestBody <storeTenantValidator>
   * @responseBody 201 - {"data": "<Tenant>"}
   */
  async store({ request, response }: HttpContext) {
    const payload = await storeTenantValidator.validate(request.all())
    const result = await this.tenantService.createOrFail(payload.name, payload.description)
    return response.ok(result)
  }
}
