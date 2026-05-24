const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const AIConversation = sequelize.define("AIConversation",{

  id:{
    type:DataTypes.UUID,
    defaultValue:DataTypes.UUIDV4,
    primaryKey:true
  },

  studentId:DataTypes.UUID,

  title: {
    type: DataTypes.STRING,
    defaultValue: "New Chat"
  },

  messages:DataTypes.JSON

});

module.exports = AIConversation;