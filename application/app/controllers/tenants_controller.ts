import Tenant from '#models/tenant'
import { storeTenantValidator, updateTenantValidator } from '#validators/tenant'
import type { HttpContext } from '@adonisjs/core/http'

export default class TenantsController {
  /**
   * @show
   * @paramPath id -  - @type(string)
   * @responseBody 200 - {"status": 200, "data": "<Tenant>"}
   */
  async show({ params, response }: HttpContext) {
    const tenant = await Tenant.find(params.id)
    if (!tenant) {
      return response.notFound({ status: 404, message: 'Tenant not found' })
    }
    return response.ok({ status: 200, data: tenant })
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
      return response.badRequest(error)
    }
    const tenant = await Tenant.create(payload)
    return response.created({ status: 201, data: tenant })
  }

  /**
   * @update
   * @paramPath id -  - @type(string)
   * @requestBody <updateTenantValidator>
   * @responseBody 200 - {"status": 200, "data": "<Tenant>"}
   */
  public async update({ params, request, response }: HttpContext) {
    const data = request.all()
    const [error, payload] = await updateTenantValidator.tryValidate(data)
    if (error) {
      return response.badRequest(error)
    }
    const tenant = await Tenant.find(params.id)
    if (!tenant) {
      return response.notFound({ status: 404, message: 'Tenant not found' })
    }
    tenant.merge(payload)
    await tenant.save()
    return response.ok({ status: 200, data: tenant })
  }

  /**
   * @destroy
   * @paramPath id -  - @type(string)
   * @responseBody 204 - No Content
   */
  public async destroy({ params, response }: HttpContext) {
    const tenant = await Tenant.find(params.id)
    if (!tenant) {
      return response.notFound({ status: 404, message: 'Tenant not found' })
    }
    await tenant.delete()
    return response.noContent()
  }
}
