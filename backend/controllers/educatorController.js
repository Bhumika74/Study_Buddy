const { Course, Assignment, User, UploadedMaterial, Progress } = require("../models");
const fs = require("fs");

// ────────── COURSES ──────────
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({ where: { educatorId: req.user.id } });
    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const { title, subject, description, grade, duration, maxStudents } = req.body;

    if (!title || !subject || !description) {
      return res.status(400).json({ error: "Title, subject, and description are required" });
    }

    const course = await Course.create({
      title,
      subject,
      description,
      grade,
      duration,
      maxStudents,
      educatorId: req.user.id
    });

    res.json({ success: true, course });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ error: "Failed to create course" });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course || course.educatorId !== req.user.id) {
      return res.status(404).json({ error: "Course not found" });
    }
    await course.update(req.body);
    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ error: "Failed to update course" });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course || course.educatorId !== req.user.id) {
      return res.status(404).json({ error: "Course not found" });
    }
    await course.destroy();
    res.json({ success: true, message: "Course deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete course" });
  }
};

// ────────── ASSIGNMENTS ──────────
exports.getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.findAll({ where: { educatorId: req.user.id } });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch assignments" });
  }
};

exports.createAssignment = async (req, res) => {
  try {
    const { title, courseId, description, instructions, dueDate, maxMarks } = req.body;

    if (!title || !courseId || !description || !dueDate || !maxMarks) {
      // Clean up uploaded file if validation fails
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: "All fields are required" });
    }

    const course = await Course.findByPk(courseId);
    if (!course || course.educatorId !== req.user.id) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: "Course not found" });
    }

    // Build attachments array if a file was uploaded
    const attachments = req.file
      ? [{ fileName: req.file.originalname, fileUrl: `/uploads/${req.file.filename}` }]
      : [];

    const assignment = await Assignment.create({
      title,
      courseId,
      description,
      instructions,
      dueDate,
      maxMarks,
      educatorId: req.user.id,
      status: "active",
      attachments
    });

    res.json({ success: true, assignment });
  } catch (error) {
    console.error("Error creating assignment:", error);
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: "Failed to create assignment" });
  }
};

exports.updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id);
    if (!assignment || assignment.educatorId !== req.user.id) {
      return res.status(404).json({ error: "Assignment not found" });
    }
    await assignment.update(req.body);
    res.json({ success: true, assignment });
  } catch (error) {
    res.status(500).json({ error: "Failed to update assignment" });
  }
};

exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id);
    if (!assignment || assignment.educatorId !== req.user.id) {
      return res.status(404).json({ error: "Assignment not found" });
    }
    await assignment.destroy();
    res.json({ success: true, message: "Assignment deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete assignment" });
  }
};

// ────────── MATERIALS ──────────
exports.getMaterials = async (req, res) => {
  try {
    const materials = await UploadedMaterial.findAll({ where: { educatorId: req.user.id } });
    res.json(materials);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch materials" });
  }
};

exports.uploadMaterial = async (req, res) => {
  try {
    const { title, courseId, type, description, chapter } = req.body;

    if (!title || !courseId || !type) {
      return res.status(400).json({ error: "Title, course, and type are required" });
    }

    const course = await Course.findByPk(courseId);
    if (!course || course.educatorId !== req.user.id) {
      return res.status(404).json({ error: "Course not found" });
    }

    const material = await UploadedMaterial.create({
      title,
      courseId,
      type,
      description,
      chapter,
      educatorId: req.user.id,
      fileUrl: req.file ? `/uploads/${req.file.filename}` : null,
      fileName: req.file ? req.file.originalname : null,
      createdAt: new Date()
    });

    res.json({ success: true, material });
  } catch (error) {
    console.error("Error uploading material:", error);
    res.status(500).json({ error: "Failed to upload material" });
  }
};

exports.updateMaterial = async (req, res) => {
  try {
    const material = await UploadedMaterial.findByPk(req.params.id);
    if (!material || material.educatorId !== req.user.id) {
      return res.status(404).json({ error: "Material not found" });
    }
    await material.update(req.body);
    res.json({ success: true, material });
  } catch (error) {
    res.status(500).json({ error: "Failed to update material" });
  }
};

exports.deleteMaterial = async (req, res) => {
  try {
    const material = await UploadedMaterial.findByPk(req.params.id);
    if (!material || material.educatorId !== req.user.id) {
      return res.status(404).json({ error: "Material not found" });
    }

    // Delete file if exists
    if (material.fileUrl) {
      try {
        fs.unlinkSync(`uploads/${material.fileUrl}`);
      } catch (err) {
        console.error("Error deleting file:", err);
      }
    }

    await material.destroy();
    res.json({ success: true, message: "Material deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete material" });
  }
};

// ────────── STUDENTS ──────────
exports.getStudents = async (req, res) => {
  try {
    const courses = await Course.findAll({ where: { educatorId: req.user.id } });
    const courseIds = courses.map(c => c.id);

    // Get all progress records for these courses
    const progressRecords = await Progress.findAll({
      where: { courseId: courseIds }
    });

    // Fetch all users registered as students in the database
    const students = await User.findAll({
      where: { role: "student" },
      attributes: ["id", "name", "email", "grade"]
    });

    // Add course enrollment and progress
    const studentList = students.map(student => {
      // Find all progress records for this student
      const studentProgress = progressRecords.filter(p => p.studentId === student.id);
      
      // Calculate aggregates
      let totalProgress = 0;
      let totalAssignments = 0;
      let totalQuizzes = 0;
      let lastAccessed = new Date(0);

      studentProgress.forEach(p => {
        totalProgress += p.progress || 0;
        totalAssignments += p.assignmentsCompleted || 0;
        totalQuizzes += p.quizzesTaken || 0;
        if (p.lastAccessed && new Date(p.lastAccessed) > lastAccessed) {
          lastAccessed = new Date(p.lastAccessed);
        }
      });

      const avgProgress = studentProgress.length > 0 
        ? Math.floor(totalProgress / studentProgress.length) 
        : 0;

      // Determine if active in the last 7 days
      const isActive = (new Date() - lastAccessed) < (7 * 24 * 60 * 60 * 1000);

      return {
        id: student.id,
        name: student.name,
        email: student.email,
        grade: student.grade,
        courseName: studentProgress.length > 0 ? "Multiple Courses" : "No Course", // Simplification
        progress: avgProgress,
        active: isActive,
        assignmentsCompleted: totalAssignments,
        quizzesCompleted: totalQuizzes
      };
    });

    res.json(studentList);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Failed to fetch students" });
  }
};

exports.getStudentDetails = async (req, res) => {
  try {
    const student = await User.findByPk(req.params.id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const courses = await Course.findAll({ where: { educatorId: req.user.id } });
    const courseIds = courses.map(c => c.id);

    const studentProgress = await Progress.findAll({
      where: { studentId: student.id, courseId: courseIds }
    });

    let totalProgress = 0;
    let totalAssignments = 0;
    let totalQuizzes = 0;
    let totalScore = 0;
    let validScores = 0;
    let lastActive = new Date(0);

    studentProgress.forEach(p => {
      totalProgress += p.progress || 0;
      totalAssignments += p.assignmentsCompleted || 0;
      totalQuizzes += p.quizzesTaken || 0;
      if (p.averageScore) {
        totalScore += p.averageScore;
        validScores++;
      }
      if (p.lastAccessed && new Date(p.lastAccessed) > lastActive) {
        lastActive = new Date(p.lastAccessed);
      }
    });

    const avgProgress = studentProgress.length > 0 ? Math.floor(totalProgress / studentProgress.length) : 0;
    const avgScore = validScores > 0 ? Math.floor(totalScore / validScores) : 0;

    res.json({
      id: student.id,
      name: student.name,
      email: student.email,
      grade: student.grade,
      overallProgress: avgProgress,
      assignmentsCompleted: totalAssignments,
      quizzesCompleted: totalQuizzes,
      averageScore: `${avgScore}%`,
      lastActive: lastActive.getTime() > 0 ? lastActive : "Never",
      recentActivity: [
        { description: "Last Course Access", date: lastActive.getTime() > 0 ? lastActive.toDateString() : "N/A" },
      ]
    });
  } catch (error) {
    console.error("Error fetching student details:", error);
    res.status(500).json({ error: "Failed to fetch student details" });
  }
};

// ────────── STATISTICS ──────────
exports.getStats = async (req, res) => {
  try {
    const courses = await Course.findAll({ where: { educatorId: req.user.id } });
    const assignments = await Assignment.findAll({ where: { educatorId: req.user.id } });
    const materials = await UploadedMaterial.findAll({ where: { educatorId: req.user.id } });
    
    // Fetch count of all registered students
    const totalStudentsCount = await User.count({ where: { role: "student" } });

    res.json({
      activeCourses: courses.length,
      totalStudents: totalStudentsCount,
      totalAssignments: assignments.length,
      materialsUploaded: materials.length
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
};

// ────────── PROGRESS TRACKING ──────────
exports.getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const course = await Course.findByPk(courseId);
    if (!course || course.educatorId !== req.user.id) {
      return res.status(404).json({ error: "Course not found" });
    }

    const progressRecords = await Progress.findAll({ where: { courseId } });
    
    res.json(progressRecords);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch course progress" });
  }
};

exports.getStudentCourseProgress = async (req, res) => {
  try {
    const { courseId, studentId } = req.params;
    
    const course = await Course.findByPk(courseId);
    if (!course || course.educatorId !== req.user.id) {
      return res.status(404).json({ error: "Course not found" });
    }

    const progress = await Progress.findOne({
      where: { courseId, studentId }
    });

    res.json(progress || { message: "No progress yet" });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch student progress" });
  }
};

exports.updateStudentProgress = async (req, res) => {
  try {
    const { studentId, courseId, assignmentId } = req.body;
    const { score = 0 } = req.body;

    const course = await Course.findByPk(courseId);
    if (!course || course.educatorId !== req.user.id) {
      return res.status(404).json({ error: "Course not found" });
    }

    let progress = await Progress.findOne({
      where: { studentId, courseId }
    });

    if (!progress) {
      progress = await Progress.create({
        studentId,
        courseId,
        assignmentId,
        assignmentsCompleted: 1,
        averageScore: score,
        status: "in-progress"
      });
    } else {
      progress.assignmentsCompleted += 1;
      progress.averageScore = (progress.averageScore + score) / 2;
      progress.lastAccessed = new Date();
      await progress.save();
    }

    res.json({ success: true, progress });
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({ error: "Failed to update progress" });
  }
};

exports.completeStudentCourse = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;

    const course = await Course.findByPk(courseId);
    if (!course || course.educatorId !== req.user.id) {
      return res.status(404).json({ error: "Course not found" });
    }

    const progress = await Progress.findOne({
      where: { studentId, courseId }
    });

    if (progress) {
      progress.status = "completed";
      progress.completedAt = new Date();
      progress.progress = 100;
      await progress.save();
    }

    res.json({ success: true, progress });
  } catch (error) {
    res.status(500).json({ error: "Failed to complete course" });
  }
};