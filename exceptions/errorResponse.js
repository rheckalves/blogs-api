const BAD_REQUEST = {
  code: 400,
  messages: {
    invalidFields: 'Invalid fields',
    categoryNotFound: '"categoryIds" not found',
    editNotAllowed: 'Categories cannot be edited',
  },
};

const NOT_FOUND = {
  code: 404,
  messages: { userNotFound: 'User does not exist', postNotFound: 'Post does not exist' } };

const CONFLICT = { code: 409, messages: { userRegistered: 'User already registered' } };

const UNAUTHORIZED = {
  code: 401,
  messages: {
    missingToken: 'Token not found',
    invalidToken: 'Expired or invalid token',
    unauthorizedUser: 'Unauthorized user',
  },
};

module.exports = {
    BAD_REQUEST,
    NOT_FOUND,
    CONFLICT,
    UNAUTHORIZED,
};
