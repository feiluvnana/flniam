import Authorizators from '#utils/authorizators'
import { checkAuthValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  /**
   * @check
   * @requestBody <checkAuthValidator>
   * @responseBody 200 - {"authorized": "<boolean>", "data": "<Array<Object>>"}
   */
  async check({ principal, request, response }: HttpContext) {
    const payload = await checkAuthValidator.validate(request.all())
    const missingPermissions = Authorizators.check(payload, principal.permissions)
    return response.ok({ authorized: missingPermissions.length === 0, data: missingPermissions })
  }
}
