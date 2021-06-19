const SUCCESS = 200;
const CREATED = 201;
const { Category } = require('../models');

const createCategoryController = async (req, res, next) => {
    try {
        const { name } = req.body;
        const newCategory = await Category.create({ name });
        res.status(CREATED).json(newCategory);
    } catch (err) {
      next(err);
    }
};

const getAllCategoriesController = async (_req, res, next) => {
    try {
      const categories = await Category.findAll();
      return res.status(SUCCESS).json(categories);
    } catch (err) {
      next(err);
    }
  };

  module.exports = {
      createCategoryController,
      getAllCategoriesController,
  };