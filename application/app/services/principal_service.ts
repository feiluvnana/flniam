import Principal from '#models/principal'
import { ApiNotFoundError } from '#utils/exceptions'

export class PrincipalService {
  async paginateOrFail(tenantId: string, limit: number, lastPrincipalId?: string) {
    const principals = await Principal.query()
      .where('tenant_id', tenantId)
      .if(lastPrincipalId, (q) => q.andWhere('id', '>', lastPrincipalId!))
      .orderBy('id', 'asc')
      .limit(limit + 1)
      .exec()
    return {
      data: principals.slice(0, limit),
      lastPrincipalId: principals.length > limit ? principals[limit].id : null,
    }
  }

  async findOrFail(tenantId: string, id: string) {
    const principal = await Principal.query().where('id', id).where('tenant_id', tenantId).first()
    if (!principal) throw new ApiNotFoundError('Principal not found')
    return principal
  }

  async deleteOrFail(tenantId: string, id: string) {
    const principal = await this.findOrFail(tenantId, id)
    await principal.delete()
  }
}
