const Joi = require('joi');
const {
    BadRequestException,
    } = require('../exceptions');

const validateCreateCategoryMiddleware = (req, _res, next) => {
    const createUserSchemaRules = {
      name: Joi.string().required(),
  };

  const userSchema = Joi.object(createUserSchemaRules);
  const { error } = userSchema.validate(req.body);
  if (error) throw new BadRequestException(error.details[0].message);
  next();
};

module.exports = {
  validateCreateCategoryMiddleware,  
};