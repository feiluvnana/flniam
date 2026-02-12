import { ApiException } from '#utils/exceptions'
import { ExceptionHandler, HttpContext } from '@adonisjs/core/http'
import { ValidationError } from '@vinejs/vine'

export default class HttpExceptionHandler extends ExceptionHandler {
  async handle(error: unknown, ctx: HttpContext) {
    if (error instanceof ApiException) {
      return ctx.response.status(error.status).json({
        errors: [{ message: error.message }],
      })
    } else if (error instanceof ValidationError) {
      return ctx.response.badRequest({
        errors: error.messages,
      })
    }
    return super.handle(error, ctx)
  }
}
