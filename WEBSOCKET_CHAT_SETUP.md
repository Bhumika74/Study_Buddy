# WebSocket Chat Feature - Installation Guide

## Overview
A real-time messaging system has been added to Study Buddy that allows educators and students to communicate via WebSocket with message history storage and deletion options.

## Features Implemented
✓ Real-time messaging via WebSocket (Socket.IO)
✓ Message history stored in database
✓ Delete message for self only
✓ Delete message for everyone (sender only)
✓ User online/offline status
✓ Message list with user filtering

## Installation Steps

### Backend Setup

#### 1. Install Required Packages
Run these commands in the backend directory:

```bash
cd backend
npm install socket.io
```

#### 2. Files Created/Modified
- **New Files:**
  - `models/Message.js` - Message model for storing chats
  - `controllers/chatController.js` - Chat business logic
  - `routes/chatRoutes.js` - Chat API endpoints

- **Modified Files:**
  - `server.js` - Added Socket.IO integration
  - `models/User.js` - Added associations with Message model
  - `models/index.js` - Added Message model and setup associations
  - `package.json` - Add `socket.io` to dependencies

#### 3. API Endpoints
```
GET  /api/chat/users                              - Get list of users to chat with
GET  /api/chat/messages/:userId                   - Get messages with specific user
POST /api/chat/send                               - Send a message
DELETE /api/chat/message/:messageId/delete-me     - Delete message for self
DELETE /api/chat/message/:messageId/delete-all    - Delete message for everyone
```

#### 4. Socket Events
- `user-online` - Emit when user comes online
- `user-offline` - Emit when user goes offline
- `send-message` - Send real-time message
- `receive-message` - Receive real-time message
- `delete-message-me` - Delete message for self
- `delete-message-all` - Delete message for everyone

### Frontend Setup

#### 1. Install Required Packages
Run these commands in the frontend directory:

```bash
cd frontend
npm install socket.io-client
```

#### 2. Files Created/Modified
- **New Files:**
  - `pages/MessagesCenter.jsx` - Main chat component

- **Modified Files:**
  - `pages/EducatorDashboard.jsx` - Added Messages route and navigation
  - `pages/StudentDashboard.jsx` - Added Messages route and navigation

#### 3. Navigation Updates
Both educator and student dashboards now have:
- "Messages" menu item with chat icon
- Route: `/educator/messages` and `/student/messages`

### Running the Application

#### 1. Start Backend Server
```bash
cd backend
npm start
```
Server runs on port 5000 with Socket.IO enabled.

#### 2. Start Frontend
```bash
cd frontend
npm run dev
```
Frontend runs on port 3000 and connects to Socket.IO server.

## Usage

### For Educators
1. Click "Messages" in the sidebar
2. View list of students you've chatted with
3. Click a student to open chat
4. Type and send messages
5. Hover over your messages to delete (delete for you or everyone)

### For Students
1. Click "Messages" in the sidebar
2. View list of educators you've chatted with
3. Click an educator to open chat
4. Type and send messages
5. Hover over your messages to delete (delete for you or everyone)

## Features Detailed

### Message Storage
- All messages are stored in the database permanently
- Includes sender, receiver, timestamp, and deletion status
- Deleted messages can be marked as "deleted for me" or "deleted for all"

### Real-Time Communication
- Socket.IO handles real-time message delivery
- Messages appear instantly for both users
- User online/offline status updates in real-time
- Deleted messages remove instantly for both parties

### Deletion Options
1. **Delete for Me**: Hides message only for current user
2. **Delete for Everyone**: Marks message as deleted for all users (sender only)

## Database Schema

### Message Table
```
id                UUID (Primary Key)
senderId          UUID (Foreign Key - User)
receiverId        UUID (Foreign Key - User)
courseId          UUID (Optional - for course-specific chat)
message           TEXT
isDeleted         BOOLEAN (default: false)
deletedFor        JSON Array (User IDs who deleted message)
createdAt         TIMESTAMP
```

## Troubleshooting

### Socket.IO Connection Issues
- Ensure backend is running on port 5000
- Check CORS configuration in server.js
- Verify socket client connects to http://localhost:5000

### Messages Not Sending
- Check network tab in browser dev tools
- Verify token is being sent in Authorization header
- Ensure user is authenticated before sending messages

### Database Sync Issues
- Run backend with `npm start` to trigger Sequelize sync
- Check MySQL database for Message table creation
- Verify all model associations are properly defined

## Next Steps
- Add message notifications
- Add typing indicators
- Add message read status
- Add file sharing in chat
- Add group messaging support
