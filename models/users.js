'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      users.hasOne(models.student, { 
        foreignKey: 'userId', 
        as: 'student', 
        onDelete: 'CASCADE' 
      });
      users.hasOne(models.tutor, { 
        foreignKey: 'userId', 
        as: 'tutor', 
        onDelete: 'CASCADE' 
      });
    }
  };
  users.init({
    distinction: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'users',
  });
  return users;
};