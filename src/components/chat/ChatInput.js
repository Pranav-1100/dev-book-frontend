'use client';

import { Send, Wand2 } from 'lucide-react';
import React, { useState } from 'react';

const ChatInput = ({ onSubmit, mode }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    try {
      await onSubmit(input);
      setInput('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="input-container">
      <form onSubmit={handleSubmit} className="flex gap-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            mode === 'chat'
              ? "Ask a question..."
              : "Describe your diagram (e.g., 'Login flow with authentication')"
          }
          className="flex-1 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            mode === 'chat'
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : 'bg-purple-500 hover:bg-purple-600 text-white'
          }`}
          disabled={isLoading}
        >
          {mode === 'chat' ? (
            <>
              <Send className="w-4 h-4" />
              Send
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              Generate
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ChatInput;





























