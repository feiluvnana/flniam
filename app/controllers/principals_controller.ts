import Permission from '#models/permission'
import Principal from '#models/principal'
import Role from '#models/role'
import Tenant from '#models/tenant'
import Generators from '#utils/generators'
import { storePrincipalValidator } from '#validators/principals_validator'
import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import db from '@adonisjs/lucid/services/db'

export default class PrincipalsController {
  /**
   * @index
   * @responseBody 200 - {"status": 200, "data": "<Principal[]>"}
   */
  async index({ response }: HttpContext) {
    const principals = await Principal.all()
    return response.ok({ status: 200, data: principals })
  }

  /**
   * @store
   * @requestBody <storePrincipalValidator>
   * @responseBody 201 - {"status": 201, "data": "<Principal>"}
   */
  async store({ request, response }: HttpContext) {
    const data = request.all()
    const [error, payload] = await storePrincipalValidator.tryValidate(data)
    if (error) {
      return response.badRequest(error)
    }

    await db.transaction(async (txn) => {
      const tenant = await Tenant.findOrFail(payload.tenantId, { client: txn })
      if (!tenant) {
        return response.notFound({ status: 404, message: 'Tenant not found' })
      }
      const principal = await Principal.create(
        { tenantId: tenant.id, type: payload.type, status: 'active' },
        { client: txn }
      )
      if (payload.type === 'user' && payload.user) {
        await principal
          .related('userDetail')
          .create(
            { username: payload.user.username, password: await hash.make(payload.user.password) },
            { client: txn }
          )
      }
      if (payload.type === 'service_account') {
        const clientId = Generators.id('cid')
        const clientSecret = Generators.secret()
        await principal
          .related('serviceAccountDetail')
          .create({ clientId, clientSecret }, { client: txn })
      }
      const roles = await Role.query({ client: txn })
        .whereIn('id', payload.roleIds)
        .where('tenant_id', tenant.id)
        .select('id')
        .exec()
      if (roles.length !== payload.roleIds.length) {
        return response.notFound({ status: 404, message: 'Role not found' })
      }
      const permissions = await Permission.query({ client: txn })
        .whereIn('id', payload.permissionIds)
        .where('tenant_id', tenant.id)
        .select('id')
        .exec()
      if (permissions.length !== payload.permissionIds.length) {
        return response.notFound({ status: 404, message: 'Permission not found' })
      }
      await principal.related('roles').attach(payload.roleIds, txn)
      await principal.related('permissions').attach(payload.permissionIds, txn)
      await principal.load('userDetail')
      await principal.load('serviceAccountDetail')
      await principal.load('roles')
      await principal.load('permissions')
      return response.created({ status: 201, data: principal })
    })
  }
}
