const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Progress = sequelize.define("Progress", {

  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },

  studentId: {
    type: DataTypes.UUID,
    allowNull: false
  },

  courseId: {
    type: DataTypes.UUID,
    allowNull: false
  },

  assignmentId: DataTypes.UUID,

  progress: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },

  assignmentsCompleted: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },

  quizzesTaken: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },

  averageScore: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },

  submittedAssignments: {
    type: DataTypes.JSON,
    defaultValue: []
  },

  lastAccessed: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },

  completedAt: DataTypes.DATE,

  status: {
    type: DataTypes.ENUM("in-progress", "completed", "not-started"),
    defaultValue: "in-progress"
  },

  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }

});

module.exports = Progress;