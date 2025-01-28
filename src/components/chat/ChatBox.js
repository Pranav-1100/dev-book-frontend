'use client';

import { useState } from 'react';
import { Settings2, Trash2 } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { useChat } from '@/contexts/ChatContext';

const ChatBox = () => {
  const [mode, setMode] = useState('chat');
  const { messages, loading, error, sendMessage, clearChat } = useChat();

  const handleSubmit = async (input) => {
    if (!input.trim()) return;

    try {
      await sendMessage({
        content: input,
        type: mode
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="chat-container">
      {/* Mode Toggle */}
      <div className="border-b">
        <div className="max-w-3xl mx-auto p-4 flex items-center justify-between">
          <div className="flex space-x-4">
            <button
              onClick={() => setMode('chat')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                mode === 'chat' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Chat
            </button>
            <button
              onClick={() => setMode('diagram')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                mode === 'diagram' 
                  ? 'bg-purple-50 text-purple-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Diagram
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={clearChat}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
              title="Clear chat"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Settings2 className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="message-container">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            <h2 className="text-2xl font-semibold mb-2">Welcome to DevBook</h2>
            <p>Ask me about programming books or request a diagram!</p>
          </div>
        )}
        
        {messages.map((message) => (
          <ChatMessage key={message.id || Date.now()} message={message} />
        ))}

        {error && (
          <div className="message assistant-message bg-red-50 border-red-200">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-red-600">!</span>
              </div>
              <div className="flex-1">
                <div className="font-medium mb-1 text-red-600">Error</div>
                <div className="text-red-500">{error}</div>
              </div>
            </div>
          </div>
        )}
        
        {loading && (
          <div className="message assistant-message">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
              </div>
              <div className="flex-1">
                <div className="font-medium mb-1">Assistant</div>
                <div className="text-gray-500">Thinking...</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <ChatInput 
        onSubmit={handleSubmit} 
        mode={mode} 
        disabled={loading}
      />
    </div>
  );
};

export default ChatBox;