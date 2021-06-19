const defineUserModel = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    displayName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    image: DataTypes.STRING,
  },
  {
    timestamps: false,
  });

  User.associate = (models) => {
    User.hasMany(models.BlogPost,
      { 
        foreignKey: 'userId',
        as: 'blogPosts',
      });
  };

  return User;
};

module.exports = defineUserModel;
