const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Progress = sequelize.define("Progress",{

  id:{
    type:DataTypes.UUID,
    defaultValue:DataTypes.UUIDV4,
    primaryKey:true
  },

  studentId:DataTypes.UUID,

  courseId:DataTypes.UUID,

  progress:DataTypes.INTEGER,

  quizzesTaken:DataTypes.INTEGER,

  averageScore:DataTypes.FLOAT

});

module.exports = Progress;