const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {

  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },

  name: {
    type: DataTypes.STRING,
    allowNull:false
  },

  email: {
    type: DataTypes.STRING,
    unique:true
  },

  password: {
    type: DataTypes.STRING
  },

  role: {
    type: DataTypes.ENUM("admin","educator","student")
  },

  phone: DataTypes.STRING,
  bio: DataTypes.TEXT,
  grade: DataTypes.STRING,
  school: DataTypes.STRING

});

module.exports = User;