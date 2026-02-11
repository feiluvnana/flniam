import { TenantService } from '#services/tenant_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

@inject()
export default class HasTenantMiddleware {
  constructor(private tenantService: TenantService) {}

  async handle(ctx: HttpContext, next: NextFn) {
    const { request } = ctx
    const id = request.header('X-Tenant-Id')
    const secret = request.header('X-Tenant-Secret')
    if (!id || !secret) return ctx.response.badRequest({ message: 'Tenant not found' })
    try {
      const tenant = await this.tenantService.findByIdAndSecretOrFail(id, secret)
      ctx.tenant = tenant
    } catch (error) {
      return ctx.response.badRequest({ message: 'Tenant not found' })
    }
    return next()
  }
}
