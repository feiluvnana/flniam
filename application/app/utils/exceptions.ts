export class ApiException extends Error {
  public status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export class ApiBadRequestError extends ApiException {
  constructor(message: string) {
    super(message, 400)
  }
}

export class ApiNotFoundError extends ApiException {
  constructor(message: string) {
    super(message, 404)
  }
}

export class ApiUnauthorizedError extends ApiException {
  constructor(message: string) {
    super(message, 401)
  }
}

export class ApiForbiddenError extends ApiException {
  constructor(message: string) {
    super(message, 403)
  }
}

export class ApiInternalServerError extends ApiException {
  constructor(message: string) {
    super(message, 500)
  }
}
