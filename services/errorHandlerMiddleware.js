const {
BadRequestException,
ConflictException,
NotFoundException,
UnauthorizedException,
} = require('../exceptions');

const {
  BAD_REQUEST,
  CONFLICT,
  NOT_FOUND,
  UNAUTHORIZED,
} = require('../exceptions/errorResponse');

const getErrorData = (err) => {
  if (err instanceof BadRequestException) {
    return BAD_REQUEST;
  }
  if (err instanceof ConflictException) {
    return CONFLICT;
  }
  if (err instanceof NotFoundException) {
    return NOT_FOUND;
  }
  if (err instanceof UnauthorizedException) {
    return UNAUTHORIZED;
  }
  return null;
};

const errorHandlerMiddleware = (err, _req, res, _next) => {
    let code = 500;
    if (getErrorData(err) !== null) code = getErrorData(err).code;
    const statusResponse = code;
    const message = code === 500 ? err.message
    : getErrorData(err).messages[`${err.message}`];
    const errorResponse = message ? { message } : { message: err.message };
    return res.status(statusResponse)
      .json(errorResponse);
};

module.exports = errorHandlerMiddleware;
