import router from '@adonisjs/core/services/router'
import server from '@adonisjs/core/services/server'

server
  .errorHandler(() => import('#exceptions/handler'))
  .use([
    () => import('@adonisjs/core/bodyparser_middleware'),
    () => import('#middleware/container_bindings_middleware'),
  ])
  .use([() => import('#middleware/log_request_middleware')])

export const middleware = router.named({
  hasTenant: () => import('#middleware/has_tenant_middleware'),
  hasPrincipal: () => import('#middleware/has_principal_middleware'),
})
