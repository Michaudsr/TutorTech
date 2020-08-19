'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tutor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.tutor.belongsTo(models.user)
      // models.tutor.belongsToMany(models.student, {
      //   through: 'tutoringSession',
      //   as: 'student',
      //   foreignKey: 'tutorId',
      //   otherKey: 'studentId'
      // });

      models.tutor.belongsToMany(models.tutoringSession, {through: 'tutorId'})
      // this.myAssociation = models.tutor.belongsTo(models.user)
      // models.tutor.belongsTo(models.user, { 
      //   foreignKey: 'userId', 
      //   as: 'user'
      // });
    }
  };
  tutor.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    description: DataTypes.TEXT,
    rating: DataTypes.INTEGER,
    hourlyRate: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'tutor',
  });
  return tutor;
};