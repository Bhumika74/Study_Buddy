const { Message, User, Course } = require("../models");
const { Op } = require("sequelize");

// Get all doubts in a course (for educators)
exports.getCourseDoubts = async (req, res) => {
  try {
    const { courseId } = req.params;
    const currentUserId = req.user.id;

    // Get course and verify user is educator
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    if (course.educatorId !== currentUserId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Get all messages for this course
    const messages = await Message.findAll({
      where: {
        courseId,
        isDeleted: false
      },
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["id", "name", "profilePic", "email"]
        }
      ],
      order: [["createdAt", "ASC"]]
    });

    res.json(messages);
  } catch (error) {
    console.error("Error fetching course doubts:", error);
    res.status(500).json({ error: "Failed to fetch course doubts" });
  }
};

// Get doubts for a specific course (for students)
exports.getCourseChat = async (req, res) => {
  try {
    const { courseId } = req.params;
    const currentUserId = req.user.id;

    // Get course
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Get messages for this course where current user is involved
    const messages = await Message.findAll({
      where: {
        courseId,
        [Op.or]: [
          { senderId: currentUserId },
          { receiverId: currentUserId }
        ]
      },
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["id", "name", "profilePic", "email"]
        }
      ],
      order: [["createdAt", "ASC"]]
    });

    // Filter out deleted messages for current user
    const filteredMessages = messages.filter(msg => {
      if (msg.isDeleted) return false;
      if (msg.deletedFor?.includes(currentUserId)) return false;
      return true;
    });

    res.json(filteredMessages);
  } catch (error) {
    console.error("Error fetching course chat:", error);
    res.status(500).json({ error: "Failed to fetch course chat" });
  }
};

// Post a doubt in a course (students ask teachers)
exports.postDoubt = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { message } = req.body;
    const senderId = req.user.id;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    // Verify course exists
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Create message (student to teacher)
    const newMessage = await Message.create({
      senderId,
      receiverId: course.educatorId, // Teacher of the course
      courseId,
      message: message.trim(),
      isDeleted: false,
      deletedFor: []
    });

    // Fetch the created message with sender details
    const messageWithSender = await Message.findByPk(newMessage.id, {
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["id", "name", "profilePic"]
        }
      ]
    });

    res.status(201).json({ success: true, message: messageWithSender });
  } catch (error) {
    console.error("Error posting doubt:", error);
    res.status(500).json({ error: "Failed to post doubt" });
  }
};

// Reply to a doubt
exports.replyToDoubt = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { reply } = req.body;
    const senderId = req.user.id;

    if (!reply || !reply.trim()) {
      return res.status(400).json({ error: "Reply cannot be empty" });
    }

    // Get the original message
    const originalMessage = await Message.findByPk(messageId);
    if (!originalMessage) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Create a reply message
    const replyMessage = await Message.create({
      senderId,
      receiverId: originalMessage.senderId, // Reply to the person who asked
      courseId: originalMessage.courseId,
      message: reply.trim(),
      isDeleted: false,
      deletedFor: []
    });

    // Fetch the created message with sender details
    const messageWithSender = await Message.findByPk(replyMessage.id, {
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["id", "name", "profilePic"]
        }
      ]
    });

    res.status(201).json({ success: true, message: messageWithSender });
  } catch (error) {
    console.error("Error posting reply:", error);
    res.status(500).json({ error: "Failed to post reply" });
  }
};

// Delete message for me
exports.deleteMessageForMe = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await Message.findByPk(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Add user to deletedFor array
    const deletedFor = message.deletedFor || [];
    if (!deletedFor.includes(userId)) {
      deletedFor.push(userId);
    }
    await message.update({ deletedFor });

    res.json({ success: true, message: "Message deleted for you" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ error: "Failed to delete message" });
  }
};

// Delete message for all (only sender can do this)
exports.deleteMessageForAll = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await Message.findByPk(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Only sender can delete for all
    if (message.senderId !== userId) {
      return res.status(403).json({ error: "Only sender can delete message for all" });
    }

    await message.update({ isDeleted: true });
    res.json({ success: true, message: "Message deleted for everyone" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ error: "Failed to delete message" });
  }
};
