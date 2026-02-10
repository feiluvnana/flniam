import { ApiException } from '#utils/exceptions'
import { ExceptionHandler, HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { ValidationError } from '@vinejs/vine'

export default class HttpExceptionHandler extends ExceptionHandler {
  protected debug = !app.inProduction
  protected renderStatusPages = app.inProduction

  async handle(error: unknown, ctx: HttpContext) {
    if (error instanceof ApiException) {
      return ctx.response.status(error.status).json({
        message: error.message,
      })
    } else if (error instanceof ValidationError) {
      return ctx.response.badRequest({
        messages: error.messages,
      })
    }
    return super.handle(error, ctx)
  }

  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
