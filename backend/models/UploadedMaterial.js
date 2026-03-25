const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UploadedMaterial = sequelize.define("UploadedMaterial",{

  id:{
    type:DataTypes.UUID,
    defaultValue:DataTypes.UUIDV4,
    primaryKey:true
  },

  studentId:DataTypes.UUID,

  fileName:DataTypes.STRING,

  fileUrl:DataTypes.STRING,

  summary:DataTypes.TEXT,

  topics:DataTypes.JSON

});

module.exports = UploadedMaterial;