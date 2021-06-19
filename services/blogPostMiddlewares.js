const Joi = require('joi');
const { Op } = require('sequelize');
const { Category, BlogPost } = require('../models');
const {
    BadRequestException,
    UnauthorizedException,
    NotFoundException,
    } = require('../exceptions');

const validateCreatePostMiddleware = (req, _res, next) => {
    const createUserSchemaRules = {
      title: Joi.string().required(),
      content: Joi.string().required(),
      categoryIds: Joi.array().required(),
  };

  const userSchema = Joi.object(createUserSchemaRules);
  const { error } = userSchema.validate(req.body);
  if (error) throw new BadRequestException(error.details[0].message);
  next();
};

const validateUpdatePostMiddleware = (req, _res, next) => {
    const createUserSchemaRules = {
      title: Joi.string().required(),
      content: Joi.string().required(),
      categoryIds: Joi.array(),
  };

  const userSchema = Joi.object(createUserSchemaRules);
  const { error } = userSchema.validate(req.body);
  if (error) throw new BadRequestException(error.details[0].message);
  next();
};

const validateExistentCategoriesMiddleware = async (req, _res, next) => {
    try {
    const { categoryIds } = req.body;
    const categories = await Category.findAll({
        where: {
         id: { [Op.in]: [...categoryIds] },
        },
      });
      if (categories.length !== categoryIds.length) {
          throw new BadRequestException('categoryNotFound');
      }
      next();
    } catch (err) {
        next(err);
    }
};

const validateLoggedUserMiddleware = async (req, _res, next) => {
try {
    const { id: postId } = req.params;
    const { id: userId } = req.user.dataValues;
    const post = await BlogPost.findOne({
        where: { id: postId },
    });
      if (!post) throw new NotFoundException('postNotFound');
    const { userId: postUserId } = post;
    if (userId !== postUserId) throw new UnauthorizedException('unauthorizedUser');
    next();
  } catch (err) {
      next(err);
  }
};

module.exports = {
  validateCreatePostMiddleware,
  validateExistentCategoriesMiddleware,
  validateLoggedUserMiddleware,
  validateUpdatePostMiddleware,
};