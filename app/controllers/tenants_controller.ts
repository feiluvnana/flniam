import Tenant from '#models/tenant'
import { storeTenantValidator } from '#validators/tenants_validator'
import type { HttpContext } from '@adonisjs/core/http'

export default class TenantsController {
  /**
   * @index
   * @responseBody 200 - {"status": 200, "data": "<Tenant[]>"}
   */
  async index({ response }: HttpContext) {
    const tenants = await Tenant.all()
    return response.ok({ status: 200, data: tenants })
  }

  /**
   * @store
   * @requestBody <storeTenantValidator>
   * @responseBody 201 - {"status": 201, "data": "<Tenant>"}
   */
  public async store({ request, response }: HttpContext) {
    const data = request.all()
    const [error, payload] = await storeTenantValidator.tryValidate(data)
    if (error) {
      console.log(error)
      return response.badRequest(error)
    }
    const tenant = await Tenant.create(payload)
    return response.created({ status: 201, data: tenant })
  }
}
