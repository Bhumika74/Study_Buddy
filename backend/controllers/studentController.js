const { Progress, Course, User, Assignment, UploadedMaterial, AIConversation } = require("../models");
const { Op } = require("sequelize");

// Validation helpers
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  if (!phone) return true; // Phone is optional
  const phoneRegex = /^[0-9]{10}$/; // Exactly 10 digits
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

exports.getCourses = async(req, res) => {
  try {
    const courses = await Course.findAll();
    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};

exports.getCourseDetails = async(req, res) => {
  try {
    const { courseId } = req.params;
    
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const assignments = await Assignment.findAll({ where: { courseId } });
    const materials = await UploadedMaterial.findAll({ where: { courseId } });

    res.json({
      ...course.toJSON(),
      assignments,
      materials
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch course details" });
  }
};

exports.enrollCourse = async(req, res) => {
  try {
    const { courseId } = req.body;
    const studentId = req.user.id;

    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Check if already enrolled
    const existingProgress = await Progress.findOne({
      where: { studentId, courseId }
    });

    if (existingProgress) {
      return res.status(400).json({ error: "Already enrolled in this course" });
    }

    // Create progress record
    const progress = await Progress.create({
      studentId,
      courseId,
      status: "in-progress",
      progress: 0
    });

    res.json({ success: true, message: "Enrolled successfully", progress });
  } catch (error) {
    console.error("Error enrolling in course:", error);
    res.status(500).json({ error: "Failed to enroll in course" });
  }
};

exports.getProgress = async(req, res) => {
  try {
    const progress = await Progress.findAll({
      where: { studentId: req.user.id }
    });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch progress" });
  }
};

exports.getCourseProgress = async(req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    const progress = await Progress.findOne({
      where: { studentId, courseId }
    });

    if (!progress) {
      return res.status(404).json({ error: "Not enrolled in this course" });
    }

    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch progress" });
  }
};

exports.submitAssignment = async(req, res) => {
  try {
    const { assignmentId, courseId, score } = req.body;
    const studentId = req.user.id;

    // Get or create progress record
    let progress = await Progress.findOne({
      where: { studentId, courseId }
    });

    if (!progress) {
      progress = await Progress.create({
        studentId,
        courseId,
        assignmentsCompleted: 1,
        averageScore: score || 0,
        submittedAssignments: [assignmentId],
        status: "in-progress"
      });
    } else {
      // Check if assignment was already submitted
      const submittedAssignments = progress.submittedAssignments || [];
      if (!submittedAssignments.includes(assignmentId)) {
        submittedAssignments.push(assignmentId);
        progress.assignmentsCompleted = (progress.assignmentsCompleted || 0) + 1;
        progress.averageScore = ((progress.averageScore || 0) + (score || 0)) / 2;
      }
      progress.submittedAssignments = submittedAssignments;
      progress.lastAccessed = new Date();
      await progress.save();
    }

    res.json({ success: true, progress });
  } catch (error) {
    console.error("Error submitting assignment:", error);
    res.status(500).json({ error: "Failed to submit assignment" });
  }
};

// Update student profile
exports.updateProfile = async(req, res) => {
  try {
    const { name, email, phone, bio, grade, school } = req.body;
    const userId = req.user.id;

    // Validation
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Name is required' });
    }

    if (email && !validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (phone && !validatePhone(phone)) {
      return res.status(400).json({ error: 'Phone number must be 10 digits' });
    }

    // Check if email already exists for another user
    if (email) {
      const existingUser = await User.findOne({
        where: { email, id: { [Op.ne]: userId } }
      });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }

    // Update user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.update({
      name: name || user.name,
      email: email || user.email,
      phone: phone || user.phone,
      bio: bio || user.bio,
      grade: grade || user.grade,
      school: school || user.school
    });

    res.json({ 
      success: true, 
      message: 'Profile updated successfully',
      user: user.toJSON()
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// ────────── STATISTICS ──────────
exports.getStats = async (req, res) => {
  try {
    const studentId = req.user.id;

    const progressRecords = await Progress.findAll({ where: { studentId } });
    
    let completedLessons = 0;
    let quizzesTaken = 0;
    let lastAccessedDate = new Date(0);

    progressRecords.forEach(p => {
      completedLessons += p.assignmentsCompleted || 0;
      quizzesTaken += p.quizzesTaken || 0;
      if (p.lastAccessed && new Date(p.lastAccessed) > lastAccessedDate) {
        lastAccessedDate = new Date(p.lastAccessed);
      }
    });

    // Simple streak calculation (active in last 24h = 1, otherwise 0)
    // Note: a real streak system requires tracking daily logins
    const studyStreak = (new Date() - lastAccessedDate) < (24 * 60 * 60 * 1000) ? 1 : 0;

    // AI Chats today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const aiChatsToday = await AIConversation.count({
      where: {
        studentId,
        createdAt: {
          [Op.gte]: startOfDay
        }
      }
    });

    res.json({
      coursesEnrolled: progressRecords.length,
      completedLessons,
      quizzesTaken,
      studyStreak,
      aiChatsToday,
      uploadedNotes: completedLessons // mock proxy for notes uploaded, or query if needed
    });

  } catch (error) {
    console.error("Error fetching student stats:", error);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
};

// ────────── AI CHATS ──────────
exports.getAIChats = async (req, res) => {
  try {
    const chats = await AIConversation.findAll({
      where: { studentId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch AI chats" });
  }
};

exports.createAIChat = async (req, res) => {
  try {
    const { title, messages } = req.body;
    const chat = await AIConversation.create({
      studentId: req.user.id,
      title: title || "New Chat",
      messages: messages || []
    });
    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: "Failed to create AI chat" });
  }
};

exports.updateAIChat = async (req, res) => {
  try {
    const { id } = req.params;
    const { messages, title } = req.body;
    
    const chat = await AIConversation.findOne({
      where: { id, studentId: req.user.id }
    });

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    if (messages) chat.messages = messages;
    if (title) chat.title = title;
    
    await chat.save();
    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: "Failed to update AI chat" });
  }
};