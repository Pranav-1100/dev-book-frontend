'use client';

import { useState } from 'react';
import { Settings2, Trash2, MessageSquare, Grid, Sparkles } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { useChat } from '@/contexts/ChatContext';

const ChatBox = ({ onNewDiagram }) => {
  const [mode, setMode] = useState('chat');
  const { messages, loading, error, sendMessage, clearChat } = useChat();

  const handleSubmit = async (input) => {
    if (!input.trim()) return;

    try {
      if (mode === 'diagram') {
        // Send message with diagram type
        await sendMessage({
          content: input,
          type: 'diagram'
        });
      } else {
        // Regular chat message
        await sendMessage({
          content: input,
          type: 'chat'
        });
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white/60">
      {/* Mode Toggle Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex p-1 bg-gray-100 rounded-xl">
              <button
                onClick={() => setMode('chat')}
                className={`px-6 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                  mode === 'chat' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span className="font-medium">Chat</span>
              </button>
              <button
                onClick={() => setMode('diagram')}
                className={`px-6 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                  mode === 'diagram' 
                    ? 'bg-white text-purple-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid className="w-4 h-4" />
                <span className="font-medium">Diagram</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={clearChat}
                className="p-2.5 hover:bg-red-50 rounded-lg text-gray-600 hover:text-red-600 transition-colors"
                title="Clear chat"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button className="p-2.5 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors">
                <Settings2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Welcome to DevBook AI
              </h2>
              <p className="text-gray-600 text-lg mb-4">
                {mode === 'chat' 
                  ? 'Ask me anything about programming books and best practices!' 
                  : 'Describe your diagram and I\'ll create it for you!'}
              </p>
              {mode === 'diagram' && (
                <div className="bg-purple-50 rounded-xl p-4 max-w-md mx-auto">
                  <p className="text-purple-700 text-sm">
                    Try: "User Login Process with Authentication and Database"
                  </p>
                </div>
              )}
            </div>
          )}
          
          {messages.map((message) => (
            <ChatMessage 
              key={message.id || Date.now()} 
              message={message}
              mode={mode}
            />
          ))}

          {error && (
            <div className="bg-red-50 border border-red-200/50 rounded-xl p-4 text-red-600">
              {error}
            </div>
          )}
          
          {loading && (
            <div className="bg-white border rounded-xl p-4 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Assistant</div>
                  <div className="text-gray-600">
                    {mode === 'diagram' ? 'Generating diagram...' : 'Thinking...'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t bg-white/80 backdrop-blur-sm p-4">
        <div className="max-w-3xl mx-auto">
          <ChatInput 
            onSubmit={handleSubmit} 
            mode={mode} 
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
