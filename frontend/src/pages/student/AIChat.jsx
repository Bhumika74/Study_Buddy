import { useState, useRef, useEffect } from 'react';

const AIChat = () => {
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);

  const defaultMessages = [
    {
      id: 1,
      role: 'assistant',
      content: "Hello! I'm your AI tutor. I can help you understand concepts, explain topics, generate study materials, and answer questions. How can I assist you today?",
      timestamp: new Date()
    }
  ];

  const [messages, setMessages] = useState(defaultMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await fetch('http://localhost:5000/api/student/ai-chats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setChats(data);
        }
      } catch (err) {
        console.error("Failed to fetch chats:", err);
      }
    };
    fetchChats();
  }, []);

  const loadChat = (chatId) => {
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setCurrentChatId(chat.id);
      const parsedMessages = chat.messages.map(m => ({
        ...m,
        timestamp: new Date(m.timestamp)
      }));
      setMessages(parsedMessages);
    }
  };

  const handleNewChat = () => {
    setCurrentChatId(null);
    setMessages(defaultMessages);
  };

  const suggestedPrompts = [
    "Explain quantum mechanics in simple terms",
    "Help me understand photosynthesis",
    "What are the key principles of OOP?",
    "Summarize the causes of World War II"
  ];

  const saveChatToDb = async (chatId, title, messagesToSave) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;

      if (chatId) {
        await fetch(`http://localhost:5000/api/student/ai-chats/${chatId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ messages: messagesToSave })
        });
        return chatId;
      } else {
        const res = await fetch(`http://localhost:5000/api/student/ai-chats`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ title, messages: messagesToSave })
        });
        const newChat = await res.json();
        setChats(prev => [newChat, ...prev]);
        setCurrentChatId(newChat.id);
        return newChat.id;
      }
    } catch (err) {
      console.error("Failed to save chat", err);
      return chatId;
    }
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: input,
      timestamp: new Date()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    const messageToSend = input;
    setInput("");
    setIsLoading(true);

    let activeChatId = currentChatId;
    if (!activeChatId) {
      const title = messageToSend.length > 30 ? messageToSend.substring(0, 30) + '...' : messageToSend;
      activeChatId = await saveChatToDb(null, title, updatedMessages);
    } else {
      await saveChatToDb(activeChatId, null, updatedMessages);
    }

    try {
      const response = await fetch("http://localhost:5000/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageToSend })
      });

      const data = await response.json();

      const aiMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: data.reply || "No response from AI.",
        timestamp: new Date()
      };

      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);

      if (activeChatId) {
        await saveChatToDb(activeChatId, null, finalMessages);
      }

    } catch (error) {
      console.error(error);
      const errorMessage = {
        id: Date.now() + 2,
        role: "assistant",
        content: "⚠️ Failed to contact AI server.",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedPrompt = (prompt) => {
    setInput(prompt);
  };

  return (
    <div style={{ height: 'calc(100vh - 8rem)', display: 'flex', gap: 16, fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        .aic-sidebar { width: 240px; background: #111827; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 16px; display: flex; flex-direction: column; }
        .aic-chat-btn { width: 100%; padding: 10px 14px; margin-bottom: 14px; background: linear-gradient(135deg,#a855f7,#ec4899); border: none; border-radius: 10px; color: white; font-weight: 700; font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: opacity 0.2s; }
        .aic-chat-btn:hover { opacity: 0.88; }
        .aic-hist-item { width: 100%; text-align: left; padding: 8px 10px; border-radius: 8px; background: none; border: none; color: rgba(255,255,255,0.5); font-size: 0.8rem; cursor: pointer; transition: all 0.15s; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .aic-hist-item:hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.85); }
        .aic-hist-item.active { background: rgba(168,85,247,0.15); color: #a855f7; font-weight: 600; }
        .aic-main { flex: 1; display: flex; flex-direction: column; gap: 12px; min-width: 0; }
        .aic-header { background: #111827; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 14px 18px; display: flex; align-items: center; justify-content: space-between; }
        .aic-messages-wrap { flex: 1; background: #111827; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; overflow: hidden; display: flex; flex-direction: column; }
        .aic-messages { flex: 1; overflow-y: auto; padding: 18px; display: flex; flex-direction: column; gap: 14px; }
        .aic-messages::-webkit-scrollbar { width: 4px; }
        .aic-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
        .aic-bubble-user { align-self: flex-end; background: linear-gradient(135deg,#a855f7,#ec4899); color: white; padding: 11px 16px; border-radius: 18px 18px 4px 18px; max-width: 75%; }
        .aic-bubble-ai { align-self: flex-start; background: #1e293b; color: rgba(255,255,255,0.85); padding: 11px 16px; border-radius: 18px 18px 18px 4px; max-width: 75%; border: 1px solid rgba(255,255,255,0.07); }
        .aic-input-row { padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); display: flex; gap: 10px; }
        .aic-input { flex: 1; background: #1e293b; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 10px 16px; color: white; font-size: 0.875rem; outline: none; transition: border-color 0.2s; }
        .aic-input::placeholder { color: rgba(255,255,255,0.3); }
        .aic-input:focus { border-color: rgba(168,85,247,0.5); }
        .aic-send { padding: 10px 20px; background: linear-gradient(135deg,#a855f7,#ec4899); border: none; border-radius: 12px; color: white; font-weight: 700; font-size: 0.85rem; cursor: pointer; transition: opacity 0.2s; }
        .aic-send:disabled { opacity: 0.4; cursor: not-allowed; }
        .aic-send:hover:not(:disabled) { opacity: 0.88; }
        .aic-suggested { padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); display: flex; flex-direction: column; gap: 6px; }
        .aic-suggest-btn { text-align: left; padding: 8px 12px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 8px; color: rgba(255,255,255,0.55); font-size: 0.8rem; cursor: pointer; transition: all 0.15s; }
        .aic-suggest-btn:hover { background: rgba(168,85,247,0.12); border-color: rgba(168,85,247,0.25); color: #a855f7; }
        .aic-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.4); animation: bounce 1.2s infinite; }
        .aic-dot:nth-child(2) { animation-delay: 0.15s; }
        .aic-dot:nth-child(3) { animation-delay: 0.3s; }
        @keyframes bounce { 0%,80%,100%{ transform:translateY(0);} 40%{ transform:translateY(-8px);} }
      `}</style>

      {/* Sidebar */}
      <div className="aic-sidebar" style={{ display: 'none' }}>
        {/* hidden on small, visible on md+ via inline style below */}
      </div>
      <div className="aic-sidebar" style={{ display: 'flex' }}>
        <button className="aic-chat-btn" onClick={handleNewChat}>
          <svg style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Chat
        </button>

        <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.25)', marginBottom: 8, paddingLeft: 4 }}>Recent Chats</p>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {chats.map(chat => (
            <button
              key={chat.id}
              onClick={() => loadChat(chat.id)}
              className={`aic-hist-item${currentChatId === chat.id ? ' active' : ''}`}
            >
              💬 {chat.title}
            </button>
          ))}
          {chats.length === 0 && (
            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.25)', fontStyle: 'italic', padding: '4px 10px' }}>No previous chats</p>
          )}
        </div>
      </div>

      {/* Main Chat */}
      <div className="aic-main">
        {/* Header */}
        <div className="aic-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: 'linear-gradient(135deg,#a855f7,#ec4899)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem'
            }}>🤖</div>
            <div>
              <h1 style={{ fontSize: '1rem', fontWeight: 700, color: 'white' }}>AI Tutor</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981' }} />
                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Online · Ask me anything about your studies</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleNewChat}
            style={{ padding: '7px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', cursor: 'pointer' }}
          >New Chat</button>
        </div>

        {/* Messages Box */}
        <div className="aic-messages-wrap">
          <div className="aic-messages">
            {messages.map((message) => (
              <div key={message.id} className={message.role === 'user' ? 'aic-bubble-user' : 'aic-bubble-ai'}>
                <p style={{ whiteSpace: 'pre-wrap', fontSize: '0.875rem', lineHeight: 1.6 }}>{message.content}</p>
                <p style={{ fontSize: '0.7rem', marginTop: 5, opacity: 0.6, textAlign: message.role === 'user' ? 'right' : 'left' }}>
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            ))}

            {isLoading && (
              <div className="aic-bubble-ai" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '12px 16px' }}>
                <div className="aic-dot" />
                <div className="aic-dot" />
                <div className="aic-dot" />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested prompts */}
          {messages.length <= 1 && (
            <div className="aic-suggested">
              <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', marginBottom: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Suggested</p>
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedPrompt(prompt)}
                  className="aic-suggest-btn"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSendMessage} className="aic-input-row">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="aic-input"
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !input.trim()} className="aic-send">
              Send →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIChat;