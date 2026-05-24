const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Message = sequelize.define("Message", {

  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },

  senderId: {
    type: DataTypes.UUID,
    allowNull: false
  },

  receiverId: {
    type: DataTypes.UUID,
    allowNull: false
  },

  courseId: DataTypes.UUID,

  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },

  deletedFor: {
    type: DataTypes.JSON,
    defaultValue: []
  },

  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }

});

// Define associations
Message.associate = (models) => {
  Message.belongsTo(models.User, { as: "sender", foreignKey: "senderId" });
  Message.belongsTo(models.User, { as: "receiver", foreignKey: "receiverId" });
};

module.exports = Message;
