import { useState, useRef, useEffect } from 'react';

const AIChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content:
        "Hello! I'm your AI tutor. I can help you understand concepts, explain topics, generate study materials, and answer questions. How can I assist you today?",
      timestamp: new Date()
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const suggestedPrompts = [
    "Explain quantum mechanics in simple terms",
    "Help me understand photosynthesis",
    "What are the key principles of OOP?",
    "Summarize the causes of World War II"
  ];

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: input,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageToSend = input;
    setInput("");
    setIsLoading(true);

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

      setMessages((prev) => [...prev, aiMessage]);

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

  const handleClearChat = () => {
    setMessages([
      {
        id: 1,
        role: "assistant",
        content: "Chat cleared! How can I help you?",
        timestamp: new Date()
      }
    ]);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">

      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* ✅ teal avatar */}
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
              style={{ background: '#1a7a6e' }}>
              🤖
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">AI Tutor Chat</h1>
              <p className="text-sm text-gray-500">Ask me anything about your studies</p>
            </div>
          </div>
          <button
            onClick={handleClearChat}
            className="px-4 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
          >
            Clear Chat
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`rounded-2xl px-4 py-3 max-w-[80%] ${
                  message.role === "user" ? "text-white" : "bg-gray-100 text-gray-800"
                }`}
                style={message.role === "user" ? { background: '#1a7a6e' } : {}}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-1 ${message.role === "user" ? "text-green-100" : "text-gray-400"}`}>
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="text-gray-500 text-sm">AI is thinking...</div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested prompts */}
        {messages.length <= 1 && (
          <div className="p-4 border-t">
            {suggestedPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedPrompt(prompt)}
                className="block w-full text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg mb-2 transition"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSendMessage} className="p-4 border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 px-4 py-3 border rounded-xl outline-none transition"
              style={{ '--tw-ring-color': '#1a7a6e' }}
              onFocus={e => e.target.style.borderColor = '#1a7a6e'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              disabled={isLoading}
            />
            {/* ✅ teal Send button */}
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-6 py-3 text-white rounded-xl transition"
              style={{ background: isLoading || !input.trim() ? '#9ca3af' : '#1a7a6e' }}
              onMouseEnter={e => { if (!isLoading && input.trim()) e.currentTarget.style.background = '#155f55'; }}
              onMouseLeave={e => { if (!isLoading && input.trim()) e.currentTarget.style.background = '#1a7a6e'; }}
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIChat;