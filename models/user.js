'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user.hasOne(models.student, { 
        foreignKey: 'userId', 
        as: 'student', 
        onDelete: 'CASCADE' 
      });
      user.hasOne(models.tutor, { 
        foreignKey: 'userId', 
        as: 'tutor', 
        onDelete: 'CASCADE' 
      });
    }
  };
  user.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    distinction: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};