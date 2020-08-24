'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class student extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.student.belongsTo(models.user)
      models.student.belongsToMany(models.tutor, {through: 'tutoringSession'})
    }
  };
  student.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    description: DataTypes.TEXT,
    url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'student',
  });
  return student;
};