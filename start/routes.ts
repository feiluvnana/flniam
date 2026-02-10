import swagger from '#config/swagger'
import router from '@adonisjs/core/services/router'
import AutoSwagger from 'adonis-autoswagger'

router.get('/swagger', async () => {
  return AutoSwagger.default.docs(router.toJSON(), swagger)
})
router.get('/docs', async () => {
  return AutoSwagger.default.ui('/swagger', swagger)
})

const TenantsController = () => import('#controllers/tenants_controller')
router.get('tenants', [TenantsController, 'index'])
router.post('tenants', [TenantsController, 'store'])

const PermissionsController = () => import('#controllers/permissions_controller')
router.get('permissions', [PermissionsController, 'index'])
router.post('permissions', [PermissionsController, 'store'])

const RolesController = () => import('#controllers/roles_controller')
router.get('roles', [RolesController, 'index'])
router.post('roles', [RolesController, 'store'])

const PrincipalsController = () => import('#controllers/principals_controller')
router.get('principals', [PrincipalsController, 'index'])
router.post('principals', [PrincipalsController, 'store'])
