const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Course = sequelize.define("Course",{

  id:{
    type:DataTypes.UUID,
    defaultValue:DataTypes.UUIDV4,
    primaryKey:true
  },

  title:DataTypes.STRING,

  description:DataTypes.TEXT,

  syllabus:DataTypes.TEXT,

  materials:DataTypes.JSON,

  instructorId:DataTypes.UUID

});

module.exports = Course;