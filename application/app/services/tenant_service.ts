import Tenant from '#models/tenant'
import { ApiBadRequestError, ApiNotFoundError } from '#utils/exceptions'
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
    if (!(await hash.use('bcrypt').verify(tenant.secret, secret))) {
      throw new ApiNotFoundError('Tenant not found')
    }
    return tenant
  }

  async createOrFail(name: string, description?: string): Promise<Tenant> {
    let tenant = await Tenant.query().where('name', name).first()
    if (tenant) throw new ApiBadRequestError('Tenant already exists')
    const secret = Generators.secret()
    tenant = await Tenant.create({
      name,
      description,
      secret: await hash.use('bcrypt').make(secret),
    })
    return { ...tenant.serialize(), secret } as Tenant
  }
}
