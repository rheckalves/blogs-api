const definePostCategoryModel = (sequelize, _DataTypes) => {
    const PostCategory = sequelize.define('PostsCategory', {}, { timestamps: false });
    PostCategory.associate = (models) => {
      models.BlogPost.belongsToMany(models.Category, {
        as: 'categories',
        through: PostCategory,
        foreignKey: 'postId',
        otherKey: 'categoryId',
      }); models.Category.belongsToMany(models.BlogPost, {
        as: 'posts',
        through: PostCategory,
        foreignKey: 'categoryId',
        otherKey: 'postId',
      });
    };
    return PostCategory;
  };
  
  module.exports = definePostCategoryModel;