const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Course = sequelize.define("Course", {

  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },

  title: {
    type: DataTypes.STRING,
    allowNull: false
  },

  subject: DataTypes.STRING,

  description: DataTypes.TEXT,

  grade: DataTypes.STRING,

  duration: DataTypes.INTEGER, // in weeks

  maxStudents: DataTypes.INTEGER,

  syllabus: DataTypes.TEXT,

  materials: DataTypes.JSON,

  educatorId: {
    type: DataTypes.UUID,
    allowNull: false
  },

  thumbnail: DataTypes.STRING,

  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }

});

module.exports = Course;