const sequelize = require("../config/database");

const User = require("./User");
const Course = require("./Course");
const Assignment = require("./Assignment");
const Progress = require("./Progress");
const AIConversation = require("./AIConversation");
const UploadedMaterial = require("./UploadedMaterial");
const Message = require("./Message");

// Setup associations
const models = {
  User,
  Course,
  Assignment,
  Progress,
  AIConversation,
  UploadedMaterial,
  Message
};

Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

sequelize.sync({ alter: true }).catch(err => console.error("Sync error:", err));

module.exports = {
  sequelize,
  User,
  Course,
  Assignment,
  Progress,
  AIConversation,
  UploadedMaterial,
  Message
};