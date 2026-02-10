import router from '@adonisjs/core/services/router'
import server from '@adonisjs/core/services/server'

server.errorHandler(() => import('#exceptions/handler'))

server.use([() => import('#middleware/container_bindings_middleware')])

router.use([() => import('@adonisjs/core/bodyparser_middleware'), () => import('#middleware/initialize_bouncer_middleware'), () => import('@adonisjs/auth/initialize_auth_middleware')])

export const middleware = router.named({
  guest: () => import('#middleware/guest_middleware'),
  auth: () => import('#middleware/auth_middleware')
})
