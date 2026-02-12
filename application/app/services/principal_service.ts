import Principal from '#models/principal'
import ServiceAccountDetail from '#models/service_account_detail'
import UserDetail from '#models/user_detail'
import { ApiNotFoundError } from '#utils/exceptions'
import hash from '@adonisjs/core/services/hash'

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
    await Promise.all([principal.load('userDetail'), principal.load('serviceAccountDetail')])
    return principal
  }

  async findByUsernameAndPasswordOrFail(tenantId: string, username: string, password: string) {
    const userDetail = await UserDetail.query().where('username', username).first()
    if (!userDetail) throw new ApiNotFoundError('User not found')
    const isPasswordValid = await hash.use('bcrypt').verify(userDetail.password, password)
    if (!isPasswordValid) throw new ApiNotFoundError('Principal not found')
    return this.findOrFail(tenantId, userDetail.principalId)
  }

  async findByClientIdAndClientSecretOrFail(
    tenantId: string,
    clientId: string,
    clientSecret: string
  ) {
    const serviceAccountDetail = await ServiceAccountDetail.query()
      .where('client_id', clientId)
      .first()
    if (!serviceAccountDetail) throw new ApiNotFoundError('Service account not found')
    const isClientSecretValid = await hash
      .use('bcrypt')
      .verify(serviceAccountDetail.clientSecret, clientSecret)
    if (!isClientSecretValid) throw new ApiNotFoundError('Service account not found')
    return this.findOrFail(tenantId, serviceAccountDetail.principalId)
  }

  async deleteOrFail(tenantId: string, id: string) {
    const principal = await this.findOrFail(tenantId, id)
    await principal.delete()
  }
}
