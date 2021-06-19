// const bcrypt = require('bcrypt');

const SUCCESS = 200;
const CREATED = 201;
const NO_CONTENT = 204;
const { User } = require('../models');
const { NotFoundException } = require('../exceptions');

const createUserController = async (req, res, next) => {
    try {
        const { token } = req.body;
        res.status(CREATED).json({ token });
    } catch (err) {
      next(err);
    }
};

const getAllUsersController = async (_req, res, next) => {
    try {
      const users = await User.findAll();
      return res.status(SUCCESS).json(users);
    } catch (err) {
      next(err);
    }
  };

  const getUserByIdController = async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (user !== null) return res.status(SUCCESS).json(user);
      throw new NotFoundException('userNotFound');
    } catch (err) {
      next(err);
    }
  };

const loginUserController = async (req, res, next) => {
  try {
    const { token } = req.body;
    res.status(SUCCESS).json({ token });
  } catch (err) {
    next(err);
  }
};

const deleteLoggedUserController = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    await User.destroy({
        where: {
          id: userId,
        },
      });

    res.status(NO_CONTENT).send();
  } catch (err) {
    next(err);
  }
};

module.exports = {
    createUserController,
    getAllUsersController,
    getUserByIdController,
    loginUserController,
    deleteLoggedUserController,
};
