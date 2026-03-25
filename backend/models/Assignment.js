const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Assignment = sequelize.define("Assignment", {

  id:{
    type:DataTypes.UUID,
    defaultValue:DataTypes.UUIDV4,
    primaryKey:true
  },

  courseId:DataTypes.UUID,

  title:DataTypes.STRING,

  description:DataTypes.TEXT,

  dueDate:DataTypes.DATE

});

module.exports = Assignment;