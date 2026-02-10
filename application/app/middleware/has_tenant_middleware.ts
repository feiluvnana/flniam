import { TenantService } from '#services/tenant_service'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class HasTenantMiddleware {
  constructor(private tenantService: TenantService) {}

  async handle(ctx: HttpContext, next: NextFn) {
    const { request } = ctx
    const id = request.header('X-Tenant-Id')
    const secret = request.header('X-Tenant-Secret')
    if (!id || !secret) return ctx.response.unauthorized({ message: 'Tenant not found' })
    const tenant = await this.tenantService.findByIdAndSecretOrFail(id, secret)
    ctx.tenant = tenant
    return next()
  }
}
