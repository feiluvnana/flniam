import { HttpContext } from '@adonisjs/core/http'
import { NextFn } from '@adonisjs/core/types/http'

export default class LogRequestMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const { request, logger, response } = ctx
    await next()
    logger.info(`${request.method()} ${request.url()} ${response.getStatus()}`)
  }
}
