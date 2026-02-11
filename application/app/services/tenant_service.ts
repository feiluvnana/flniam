import Tenant from '#models/tenant'
import { ApiNotFoundError } from '#utils/exceptions'
import Generators from '#utils/generators'
import hash from '@adonisjs/core/services/hash'

export class TenantService {
  async findOrFail(id: string) {
    const tenant = await Tenant.find(id)
    if (!tenant) throw new ApiNotFoundError('Tenant not found')
    return tenant
  }

  async findByIdAndSecretOrFail(id: string, secret: string) {
    const tenant = await Tenant.findOrFail(id)
    if (!(await hash.use('sha256').verify(tenant.secret, secret))) {
      throw new ApiNotFoundError('Tenant not found')
    }
    return tenant
  }

  async createOrFail(name: string, description?: string): Promise<Tenant> {
    const secret = Generators.secret()
    const tenant = await Tenant.create({
      name,
      description,
      secret: await hash.use('sha256').make(secret),
    })
    return { ...tenant, secret }
  }
}
