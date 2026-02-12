import { PrincipalService } from '#services/principal_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

@inject()
export default class HasPrincipal {
  constructor(private principalService: PrincipalService) {}

  async handle(ctx: HttpContext, next: NextFn) {
    const { request, tenant } = ctx
    try {
      const authorization = request.header('Authorization')
      if (authorization) {
        const [username, password] = Buffer.from(authorization, 'base64')
          .toString('utf-8')
          .split(':')
        ctx.principal = await this.principalService.findByUsernameAndPasswordOrFail(
          tenant.id,
          username,
          password
        )
        return next()
      } else {
        const clientId = request.header('X-Client-Id')
        const clientSecret = request.header('X-Client-Secret')
        ctx.principal = await this.principalService.findByClientIdAndClientSecretOrFail(
          tenant.id,
          clientId!,
          clientSecret!
        )
        return next()
      }
    } catch (error) {
      return ctx.response.badRequest({ message: 'Principal not found' })
    }
  }
}
