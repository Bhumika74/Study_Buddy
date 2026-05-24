const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Assignment = sequelize.define("Assignment", {

  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },

  courseId: {
    type: DataTypes.UUID,
    allowNull: false
  },

  title: {
    type: DataTypes.STRING,
    allowNull: false
  },

  description: DataTypes.TEXT,

  instructions: DataTypes.TEXT,

  dueDate: {
    type: DataTypes.DATE,
    allowNull: false
  },

  maxMarks: {
    type: DataTypes.INTEGER,
    defaultValue: 100
  },

  educatorId: {
    type: DataTypes.UUID,
    allowNull: false
  },

  status: {
    type: DataTypes.ENUM("active", "closed", "archived"),
    defaultValue: "active"
  },

  attachments: DataTypes.JSON,

  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }

});

module.exports = Assignment;