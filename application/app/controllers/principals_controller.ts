import { PrincipalService } from '#services/principal_service'
import { indexPrincipalValidator } from '#validators/principal'
import type { HttpContext } from '@adonisjs/core/http'

export default class PrincipalsController {
  constructor(private readonly principalService: PrincipalService) {}

  /**
   * @index
   * @paramQuery limit -  - @type(number)
   * @paramQuery lastPrincipalId -  - @type(string)
   * @responseBody 200 - {"data": "<Principal[]>", "hasMore": "<boolean>", "lastPrincipalId": "<string>"}
   */
  async index({ tenant, request, response }: HttpContext) {
    const payload = await indexPrincipalValidator.validate(request.all())
    const limit = payload.limit || 10
    const result = await this.principalService.paginateOrFail(
      tenant.id,
      limit,
      payload.lastPrincipalId
    )
    return response.ok(result)
  }

  /**
   * @show
   * @paramPath id -  - @type(string)
   * @responseBody 200 - {"data": "<Principal>"}
   */
  async show({ tenant, params, response }: HttpContext) {
    const principal = await this.principalService.findOrFail(tenant.id, params.id)
    return response.ok({ data: principal })
  }

  /**
   * @destroy
   * @paramPath id -  - @type(string)
   * @responseBody 204 - No Content
   */
  async destroy({ tenant, params, response }: HttpContext) {
    await this.principalService.deleteOrFail(tenant.id, params.id)
    return response.noContent()
  }
}
