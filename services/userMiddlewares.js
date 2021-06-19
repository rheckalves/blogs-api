const Joi = require('joi');
// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = 'secret';

const {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  } = require('../exceptions');

const validateCreateUserMiddleware = (req, _res, next) => {
  const createUserSchemaRules = {
    displayName: Joi.string().min(8).required(),
    email: Joi.string().email().required(),
    password: Joi.string().length(6).required(),
    image: Joi.string().required(),
};

const userSchema = Joi.object(createUserSchemaRules);
    const { error } = userSchema.validate(req.body);
    if (error) throw new BadRequestException(error.details[0].message);
    next();
  };

  const validateLoginUserMiddleware = (req, _res, next) => {
    const loginUserSchemaRules = {
    email: Joi.string().required(),
    password: Joi.string().required(),
  };

  const userSchema = Joi.object(loginUserSchemaRules);
      const { error } = userSchema.validate(req.body);
      if (error) throw new BadRequestException(error.details[0].message);
      next();
    };

  const validateUniqueUserMiddleware = async (req, _res, next) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ where: { email } });
      if (user) throw new ConflictException('userRegistered');
      next();
    } catch (err) {
      next(err);
    }
  };

  const createUserMiddleware = async (req, _res, next) => {
    const { displayName, email, password, image } = req.body;
    // let { password } = req.body;

    // const salt = bcrypt.genSaltSync(5);
    // password = bcrypt.hashSync(password, salt);

    const newUser = await User.create({ displayName, email, password, image });
    if (!newUser) throw Error;
    const jwtConfig = {
        expiresIn: 3600 * 5,
        algorithm: 'HS256',
      };
    const token = jwt.sign({ data: newUser.email }, JWT_SECRET, jwtConfig);
    req.body.token = token;
    next();
  };

  const validatePasswordMiddleware = async (req, _res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user) throw new BadRequestException('invalidFields');
      // const isMatch = bcrypt.compareSync(password, user.password);
      const isMatch = password === user.password;
      if (!isMatch) throw new BadRequestException('invalidFields');
      const jwtConfig = {
        expiresIn: 3600 * 5,
        algorithm: 'HS256',
      };
      const token = jwt.sign({ data: user.email }, JWT_SECRET, jwtConfig);
      req.body.token = token;
      next();
    } catch (err) {
      next(err);
    }
  };

  const validateTokenMiddleware = async (req, _res, next) => {
    const token = req.headers.authorization;
    try {
        if (!token) throw new UnauthorizedException('missingToken');
        const decoded = jwt.verify(token, JWT_SECRET, (err, decodedJwt) => {
            if (err) throw new UnauthorizedException('invalidToken');
            return decodedJwt;
        });
        const userEmail = decoded.data;
        const user = await User.findOne({ where: { email: userEmail } });
        if (!user) throw new NotFoundException('userNotFound');
        req.user = user;
        next();
    } catch (err) {
        next(err);
    }
};

  module.exports = {
    validateCreateUserMiddleware,
    validateLoginUserMiddleware,
    validatePasswordMiddleware,
    validateUniqueUserMiddleware,
    createUserMiddleware,
    validateTokenMiddleware,
  };
