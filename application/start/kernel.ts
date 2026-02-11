import server from '@adonisjs/core/services/server'

server
  .errorHandler(() => import('#exceptions/handler'))
  .use([
    () => import('@adonisjs/core/bodyparser_middleware'),
    () => import('#middleware/container_bindings_middleware'),
  ])
  .use([() => import('#middleware/log_request_middleware')])
