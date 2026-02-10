import Permission from '#models/permission'
import Principal from '#models/principal'
import Role from '#models/role'
import Tenant from '#models/tenant'
import Generators from '#utils/generators'
import { indexPrincipalValidator, storePrincipalValidator } from '#validators/principal'
import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import db from '@adonisjs/lucid/services/db'

export default class PrincipalsController {
  /**
   * @index
   * @responseBody 200 - {"status": 200, "data": "<Principal[]>"}
   */
  async index({ request, response }: HttpContext) {
    const data = request.all()
    const [error, payload] = await indexPrincipalValidator.tryValidate(data)
    if (error) {
      return response.badRequest(error)
    }
    const limit = payload.limit || 10
    const principalQuery = Principal.query()
      .orderBy('id', 'asc')
      .limit(limit + 1)

    if (payload.tenantId) {
      principalQuery.where('tenant_id', payload.tenantId)
    }
    if (payload.lastPrincipalId) {
      principalQuery.andWhere('id', '>', payload.lastPrincipalId)
    }

    const principals = await principalQuery.exec()
    return response.ok({
      data: principals.slice(0, limit),
      lastPrincipalId: principals.length > limit ? principals[limit].id : null,
    })
  }

  /**
   * @show
   * @responseBody 200 - {"status": 200, "data": "<Principal>"}
   */
  async show({ params, response }: HttpContext) {
    const principal = await Principal.find(params.id)
    if (!principal) {
      return response.notFound({ message: 'Principal not found' })
    }
    return response.ok({ data: principal })
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
        return response.notFound({ message: 'Tenant not found' })
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
        return response.notFound({ message: 'Role not found' })
      }
      const permissions = await Permission.query({ client: txn })
        .whereIn('id', payload.permissionIds)
        .where('tenant_id', tenant.id)
        .select('id')
        .exec()
      if (permissions.length !== payload.permissionIds.length) {
        return response.notFound({ message: 'Permission not found' })
      }
      await principal.related('roles').attach(payload.roleIds, txn)
      await principal.related('permissions').attach(payload.permissionIds, txn)
      await principal.load('userDetail')
      await principal.load('serviceAccountDetail')
      await principal.load('roles')
      await principal.load('permissions')
      return response.created({ data: principal })
    })
  }

  /**
   * @destroy
   * @responseBody 204 - No Content
   */
  async destroy({ params, response }: HttpContext) {
    const principal = await Principal.find(params.id)
    if (!principal) {
      return response.notFound({ message: 'Principal not found' })
    }
    await principal.delete()
    return response.noContent()
  }
}
