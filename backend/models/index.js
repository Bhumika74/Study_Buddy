const sequelize = require("../config/database");

const User = require("./User");
const Course = require("./Course");
const Assignment = require("./Assignment");
const Progress = require("./Progress");
const AIConversation = require("./AIConversation");
const UploadedMaterial = require("./UploadedMaterial");

sequelize.sync();

module.exports = {
  sequelize,
  User,
  Course,
  Assignment,
  Progress,
  AIConversation,
  UploadedMaterial
};