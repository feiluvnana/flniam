import Tenant from '#models/tenant'
import { ApiNotFoundError } from '#utils/exceptions'
import hash from '@adonisjs/core/services/hash'

export class TenantService {
  async findOrFail(id: string) {
    const tenant = await Tenant.find(id)
    if (!tenant) throw new ApiNotFoundError('Tenant not found')
    return tenant
  }

  async findByIdAndSecretOrFail(id: string, secret: string) {
    const tenant = await Tenant.query()
      .where('id', id)
      .where('secret', await hash.use('sha256').make(secret))
      .first()
    if (!tenant) throw new ApiNotFoundError('Tenant not found')
    return tenant
  }
}
