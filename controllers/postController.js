const SUCCESS = 200;
const CREATED = 201;
const NO_CONTENT = 204;
const { Op } = require('sequelize');
const { BlogPost, Category, PostsCategory, User } = require('../models');
const { NotFoundException, BadRequestException } = require('../exceptions');

const createPostController = async (req, res, next) => {
    try {
        const { title, categoryIds, content } = req.body;
        const { id: userId } = req.user.dataValues;
        const newPost = await BlogPost.create({
            title,
            content,
            userId,
            published: new Date(Date.now()),
            updated: new Date(Date.now()) });
        const postId = newPost.id;
        const postCategories = categoryIds.map((categoryId) => ({
            postId: [postId], categoryId: [categoryId],
        }));
        await PostsCategory.bulkCreate(postCategories);
        res.status(CREATED).json({ id: postId, userId, title, content });
    } catch (err) {
      next(err);
    }
};

const updatePostController = async (req, res, next) => {
    try {
        const { title, content } = req.body;
        const { id: postId } = req.params;
        if (req.body.categoryIds) throw new BadRequestException('editNotAllowed');
        await BlogPost.update({
            title,
            content,
            updated: new Date(Date.now()),
        }, { where: { id: req.params.id } });
        const updatedPost = await BlogPost.findOne({
            where: { id: postId },
            include: { model: Category, as: 'categories' },
          });
        res.status(SUCCESS).json(updatedPost);
    } catch (err) {
      next(err);
    }
};

const getAllPostsController = async (req, res, next) => {
  try {
    const post = await BlogPost.findAll({
      include: [{ model: User, as: 'user' }, { model: Category, as: 'categories' }],
    });

    res.status(SUCCESS).json(post);
  } catch (err) {
    next(err);
  }
};

const getPostByIdController = async (req, res, next) => {
  try {
    const { id: postId } = req.params;
    const post = await BlogPost.findOne({
      where: { id: postId },
      include: [{ model: User, as: 'user' }, { model: Category, as: 'categories' }],
    });

    if (!post) throw new NotFoundException('postNotFound');

    res.status(SUCCESS).json(post);
  } catch (err) {
    next(err);
  }
};

const deletePostController = async (req, res, next) => {
  try {
    const { id: postId } = req.params;
    await BlogPost.destroy({
        where: {
          id: postId,
        },
      });

    res.status(NO_CONTENT).send();
  } catch (err) {
    next(err);
  }
};

const searchPostByQueryParams = async (req, res, next) => {
  try {
    const { q } = req.query;
    const post = await BlogPost.findAll({
      where: {
        [Op.or]: [{ title: { [Op.like]: q } },
        { content: { [Op.like]: q } }] },
      include: [{ model: User, as: 'user' }, { model: Category, as: 'categories' }],
    });
    const allPosts = await BlogPost.findAll({
      include: [{ model: User, as: 'user' }, { model: Category, as: 'categories' }],
    });
    const result = q === '' ? allPosts : post;
    res.status(SUCCESS).json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
    createPostController,
    getAllPostsController,
    getPostByIdController,
    updatePostController,
    deletePostController,
    searchPostByQueryParams,
};