// errors/HttpError.js
export class HttpError extends Error {
  constructor(message, code, status) {
    super(message)
    this.code = code
    this.status = status
    Error.captureStackTrace(this, this.constructor)
  }

  // 🔒 401 Unauthorized
  static Unauthorized(message = 'Unauthorized') {
    return new HttpError(message, 401, 'Unauthorized')
  }

  // 🚫 403 Forbidden
  static Forbidden(message = 'Forbidden') {
    return new HttpError(message, 403, 'Forbidden')
  }

  // ❌ 404 Not Found
  static NotFound(message = 'Not Found') {
    return new HttpError(message, 404, 'Not Found')
  }

  // 💣 500 Internal Server Error
  static Internal(message = 'Internal Server Error') {
    return new HttpError(message, 500, 'Internal Server Error')
  }

  // 👎 400 Bad Request
  static BadRequest(message = 'Bad Request') {
    return new HttpError(message, 400, 'Bad Request')
  }
}
