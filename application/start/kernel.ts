import server from '@adonisjs/core/services/server'

server.errorHandler(() => import('#exceptions/handler'))
server.use([
  () => import('#middleware/container_bindings_middleware'),
  () => import('#middleware/log_request_middleware'),
])
