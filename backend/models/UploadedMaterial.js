const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UploadedMaterial = sequelize.define("UploadedMaterial", {

  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },

  courseId: {
    type: DataTypes.UUID,
    allowNull: false
  },

  educatorId: {
    type: DataTypes.UUID,
    allowNull: false
  },

  studentId: DataTypes.UUID, // optional, for student uploads

  title: {
    type: DataTypes.STRING,
    allowNull: false
  },

  type: {
    type: DataTypes.ENUM("notes", "syllabus", "pdf", "video", "reference", "other"),
    defaultValue: "notes"
  },

  description: DataTypes.TEXT,

  chapter: DataTypes.STRING,

  fileName: DataTypes.STRING,

  fileUrl: DataTypes.STRING,

  summary: DataTypes.TEXT,

  topics: DataTypes.JSON,

  downloads: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },

  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }

});

module.exports = UploadedMaterial;