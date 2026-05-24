import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';

const MessagesCenter = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    const newSocket = io('http://localhost:5000');

    newSocket.on('connect', () => {
      console.log('Connected to socket server');
      newSocket.emit('user-online', user.id);
    });

    newSocket.on('receive-message', (data) => {
      if (selectedUser && (data.senderId === selectedUser.id)) {
        setMessages(prev => [...prev, {
          id: Date.now(),
          senderId: data.senderId,
          message: data.message,
          createdAt: data.timestamp,
          sender: selectedUser
        }]);
      }
    });

    newSocket.on('message-deleted-me', (data) => {
      setMessages(prev => prev.filter(msg => msg.id !== data.messageId));
    });

    newSocket.on('message-deleted-all', (data) => {
      setMessages(prev => prev.filter(msg => msg.id !== data.messageId));
    });

    setSocket(newSocket);
    fetchUsers();

    return () => {
      newSocket.emit('user-offline', user.id);
      newSocket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/chat/users', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchMessages = async (userId) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/chat/messages/${userId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = (selectUser) => {
    setSelectedUser(selectUser);
    fetchMessages(selectUser.id);
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedUser) return;

    try {
      const response = await fetch('http://localhost:5000/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ receiverId: selectedUser.id, message: messageInput })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages([...messages, data.message]);
        setMessageInput('');

        if (socket) {
          socket.emit('send-message', {
            senderId: user.id,
            receiverId: selectedUser.id,
            message: messageInput
          });
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleDeleteForMe = async (messageId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/chat/message/${messageId}/delete-me`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.ok) {
        setMessages(messages.filter(m => m.id !== messageId));
        if (socket) {
          socket.emit('delete-message-me', { messageId, userId: user.id });
        }
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleDeleteForAll = async (messageId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/chat/message/${messageId}/delete-all`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.ok) {
        setMessages(messages.filter(m => m.id !== messageId));
        if (socket) {
          socket.emit('delete-message-all', { messageId, senderId: user.id });
        }
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  if (!user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'rgba(255,255,255,0.5)', background: '#0d1117' }}>
        Loading...
      </div>
    );
  }

  const currentUserId = user.id;

  const getInitials = (name) => name ? name.charAt(0).toUpperCase() : '?';
  const getAvatarColor = (name) => {
    const colors = ['linear-gradient(135deg,#a855f7,#ec4899)', 'linear-gradient(135deg,#06b6d4,#3b82f6)', 'linear-gradient(135deg,#10b981,#06b6d4)', 'linear-gradient(135deg,#f59e0b,#ef4444)'];
    return colors[(name?.charCodeAt(0) || 0) % colors.length];
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 0px)', background: '#0d1117', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        .mc-user-item { padding: 12px 16px; cursor: pointer; transition: background 0.15s; border-bottom: 1px solid rgba(255,255,255,0.04); }
        .mc-user-item:hover { background: rgba(255,255,255,0.04); }
        .mc-user-item.selected { background: rgba(168,85,247,0.1); border-left: 3px solid #a855f7; }
        .mc-bubble-me { align-self: flex-end; background: linear-gradient(135deg,#a855f7,#ec4899); color: white; }
        .mc-bubble-them { align-self: flex-start; background: #1e293b; color: rgba(255,255,255,0.85); border: 1px solid rgba(255,255,255,0.07); }
        .mc-del-group { display: none; position: absolute; right: -88px; top: 0; flex-direction: column; gap: 4px; }
        .mc-bubble-wrap:hover .mc-del-group { display: flex; }
        .mc-input { flex: 1; background: #1e293b; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 10px 16px; color: white; font-size: 0.875rem; outline: none; transition: border-color 0.2s; }
        .mc-input::placeholder { color: rgba(255,255,255,0.3); }
        .mc-input:focus { border-color: rgba(168,85,247,0.5); }
        .mc-send-btn { padding: 10px 22px; background: linear-gradient(135deg,#a855f7,#ec4899); border: none; border-radius: 12px; color: white; font-weight: 700; font-size: 0.875rem; cursor: pointer; transition: opacity 0.2s; }
        .mc-send-btn:hover { opacity: 0.88; }
        .mc-messages::-webkit-scrollbar { width: 4px; }
        .mc-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      `}</style>

      {/* Users List */}
      <div style={{ width: 280, background: '#0d1b2e', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        {/* Header */}
        <div style={{ padding: '20px 16px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 style={{ color: 'white', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.01em', marginBottom: 12 }}>Messages</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '8px 12px', border: '1px solid rgba(255,255,255,0.07)' }}>
            <svg style={{ width: 14, height: 14, color: 'rgba(255,255,255,0.3)', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" />
            </svg>
            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>Search messages...</span>
          </div>
        </div>

        {/* Active dot row */}
        {users.length > 0 && (
          <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.25)', marginBottom: 10 }}>Active Now</p>
            <div style={{ display: 'flex', gap: 8 }}>
              {users.slice(0, 5).map((u, i) => (
                <div key={i} style={{ position: 'relative', cursor: 'pointer' }} onClick={() => handleSelectUser(u)}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: getAvatarColor(u.name), display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.85rem', border: '2px solid #0d1b2e' }}>
                    {getInitials(u.name)}
                  </div>
                  <div style={{ position: 'absolute', bottom: 0, right: 0, width: 9, height: 9, background: '#10b981', border: '2px solid #0d1b2e', borderRadius: '50%' }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Messages label */}
        <div style={{ padding: '10px 16px 4px' }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.25)' }}>
            Messages {users.length > 0 && <span style={{ background: '#a855f7', color: 'white', borderRadius: 100, padding: '1px 6px', fontSize: '0.6rem', marginLeft: 4 }}>{users.length}</span>}
          </p>
        </div>

        {/* User List */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {users.length === 0 ? (
            <div style={{ padding: '24px 16px', textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>
              No chat history yet
            </div>
          ) : (
            users.map(chatUser => (
              <div
                key={chatUser.id}
                onClick={() => handleSelectUser(chatUser)}
                className={`mc-user-item${selectedUser?.id === chatUser.id ? ' selected' : ''}`}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: getAvatarColor(chatUser.name), display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>
                    {getInitials(chatUser.name)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontWeight: 600, color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem', marginBottom: 2 }}>{chatUser.name}</h3>
                    <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', textTransform: 'capitalize' }}>{chatUser.role}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div style={{ background: '#0d1b2e', padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: '50%', background: getAvatarColor(selectedUser.name), display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '1rem' }}>
                {getInitials(selectedUser.name)}
              </div>
              <div>
                <h2 style={{ fontWeight: 700, color: 'white', fontSize: '1rem' }}>{selectedUser.name}</h2>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'capitalize' }}>{selectedUser.role}</p>
              </div>
              <div style={{ marginLeft: 'auto' }}>
                <button style={{ padding: '7px 16px', background: 'linear-gradient(135deg,#a855f7,#ec4899)', border: 'none', borderRadius: 8, color: 'white', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>
                  📞 Call
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="mc-messages" style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 12, background: '#0d1117' }}>
              {loading ? (
                <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', marginTop: 40 }}>
                  Loading messages...
                </div>
              ) : messages.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.35)', marginTop: 60 }}>
                  <div style={{ fontSize: '2rem', marginBottom: 12 }}>💬</div>
                  <p style={{ fontSize: '0.9rem' }}>No messages yet. Start a conversation!</p>
                </div>
              ) : (
                messages.map(msg => (
                  <div
                    key={msg.id}
                    className="mc-bubble-wrap"
                    style={{ display: 'flex', justifyContent: msg.senderId === currentUserId ? 'flex-end' : 'flex-start', position: 'relative' }}
                  >
                    {msg.senderId !== currentUserId && (
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: getAvatarColor(selectedUser.name), display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.8rem', marginRight: 8, flexShrink: 0, alignSelf: 'flex-end' }}>
                        {getInitials(selectedUser.name)}
                      </div>
                    )}
                    <div style={{ position: 'relative' }}>
                      <div
                        className={msg.senderId === currentUserId ? 'mc-bubble-me' : 'mc-bubble-them'}
                        style={{ maxWidth: 340, padding: '10px 15px', borderRadius: msg.senderId === currentUserId ? '18px 18px 4px 18px' : '18px 18px 18px 4px', position: 'relative' }}
                      >
                        <p style={{ fontSize: '0.875rem', lineHeight: 1.5 }}>{msg.message}</p>
                        <p style={{ fontSize: '0.68rem', marginTop: 4, opacity: 0.5, textAlign: msg.senderId === currentUserId ? 'right' : 'left' }}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>

                        {/* Delete Options */}
                        {msg.senderId === currentUserId && (
                          <div className="mc-del-group">
                            <button
                              onClick={() => handleDeleteForMe(msg.id)}
                              style={{ padding: '4px 8px', background: '#f59e0b', border: 'none', borderRadius: 6, color: 'white', fontSize: '0.72rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
                              title="Delete for me only"
                            >Delete Me</button>
                            <button
                              onClick={() => handleDeleteForAll(msg.id)}
                              style={{ padding: '4px 8px', background: '#ef4444', border: 'none', borderRadius: 6, color: 'white', fontSize: '0.72rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
                              title="Delete for everyone"
                            >Delete All</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{ background: '#0d1b2e', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '14px 20px', display: 'flex', gap: 10 }}>
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                className="mc-input"
              />
              <button onClick={handleSendMessage} className="mc-send-btn">
                Send →
              </button>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.25)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>💬</div>
            <p style={{ fontSize: '1rem', fontWeight: 600 }}>Select a user to start messaging</p>
            <p style={{ fontSize: '0.8rem', marginTop: 6, color: 'rgba(255,255,255,0.18)' }}>Choose from the list on the left</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesCenter;
