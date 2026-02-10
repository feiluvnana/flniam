import Tenant from '#models/tenant'

declare module '@adonisjs/core/http' {
  interface HttpContext {
    tenant: Tenant
  }
}
