'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tutoringSession extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  tutoringSession.init({
    studentId: DataTypes.INTEGER,
    tutorId: DataTypes.INTEGER,
    time: DataTypes.TIME,
    date: DataTypes.DATE,
    length: DataTypes.INTEGER,
    virtual: DataTypes.BOOLEAN,
    category: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'tutoringSession',
  });
  return tutoringSession;
};