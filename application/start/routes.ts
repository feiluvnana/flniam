import swagger from '#config/swagger'
import router from '@adonisjs/core/services/router'
import AutoSwagger from 'adonis-autoswagger'
import { middleware } from './kernel.js'

router.group(() => {
  router.get('/swagger', async () => {
    return AutoSwagger.default.docs(router.toJSON(), swagger)
  })
  router.get('/docs', async () => {
    return AutoSwagger.default.ui('/swagger', swagger)
  })
})

router.group(() => {
  const TenantsController = () => import('#controllers/tenants_controller')
  router.post('tenants', [TenantsController, 'store'])
})

router
  .group(() => {
    const AuthController = () => import('#controllers/auth_controller')
    router.post('auth/check', [AuthController, 'check'])
  })
  .use([middleware.hasTenant(), middleware.hasPrincipal()])

router
  .group(() => {
    const PermissionsController = () => import('#controllers/permissions_controller')
    router.get('permissions', [PermissionsController, 'index'])
    router.get('permissions/:id', [PermissionsController, 'show'])
    router.post('permissions', [PermissionsController, 'store'])
    router.delete('permissions/:id', [PermissionsController, 'destroy'])

    const RolesController = () => import('#controllers/roles_controller')
    router.get('roles', [RolesController, 'index'])
    router.get('roles/:id', [RolesController, 'show'])
    router.post('roles', [RolesController, 'store'])
    router.delete('roles/:id', [RolesController, 'destroy'])

    const PrincipalsController = () => import('#controllers/principals_controller')
    router.get('principals', [PrincipalsController, 'index'])
    router.get('principals/:id', [PrincipalsController, 'show'])
    router.delete('principals/:id', [PrincipalsController, 'destroy'])
  })
  .use(middleware.hasTenant())
