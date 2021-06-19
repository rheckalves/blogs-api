const express = require('express');

const route = express.Router();

const {
    validateCreateUserMiddleware,
    validateUniqueUserMiddleware,
    validateLoginUserMiddleware,
    validatePasswordMiddleware,
    createUserMiddleware,
    validateTokenMiddleware,
} = require('./services/userMiddlewares');

const {
    validateCreateCategoryMiddleware,
} = require('./services/categoryMiddlewares');

const {
    validateCreatePostMiddleware,
    validateExistentCategoriesMiddleware,
    validateLoggedUserMiddleware,
    validateUpdatePostMiddleware,
} = require('./services/blogPostMiddlewares');

const {
    createUserController,
    loginUserController,
    getAllUsersController,
    getUserByIdController,
    deleteLoggedUserController,
} = require('./controllers/userController');

const {
    createCategoryController,
    getAllCategoriesController,
} = require('./controllers/categoryController');

const {
    createPostController,
    getAllPostsController,
    getPostByIdController,
    updatePostController,
    deletePostController,
    searchPostByQueryParams,
} = require('./controllers/postController');

route.use(express.static(`${__dirname}uploads/`));

route.post(
    '/user',
    validateCreateUserMiddleware,
    validateUniqueUserMiddleware,
    createUserMiddleware,
    createUserController,
);

route.post(
    '/login',
    validateLoginUserMiddleware,
    validatePasswordMiddleware,
    loginUserController,
);

const USER_ID = '/user/:id';
route.get('/user', validateTokenMiddleware, getAllUsersController);
route.get(USER_ID, validateTokenMiddleware, getUserByIdController); 

route.delete('/user/me', validateTokenMiddleware, deleteLoggedUserController); 

route.post(
    '/categories',
    validateCreateCategoryMiddleware,
    validateTokenMiddleware,
    createCategoryController,
);

route.get(
    '/categories',
    validateTokenMiddleware,
    getAllCategoriesController,
);

route.post(
    '/post',
    validateCreatePostMiddleware,
    validateExistentCategoriesMiddleware,
    validateTokenMiddleware,
    createPostController,
);

route.get(
    '/post',
    validateTokenMiddleware,
    getAllPostsController,
);

route.get(
    '/post/search',
    validateTokenMiddleware,
    searchPostByQueryParams,
);

const POST_ID = '/post/:id';
route.get(
    POST_ID,
    validateTokenMiddleware,
    getPostByIdController,
);

route.put(
    POST_ID,
    validateUpdatePostMiddleware,
    validateTokenMiddleware,
    validateLoggedUserMiddleware,
    updatePostController,
    );
 
route.delete(
    POST_ID,
    validateTokenMiddleware,
    validateLoggedUserMiddleware,
    deletePostController,
    );

module.exports = route;
