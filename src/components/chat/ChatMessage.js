'use client';

import { User, Bot } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div
      className={`message ${isUser ? 'user-message' : 'assistant-message'}`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-blue-100' : 'bg-purple-100'
        }`}>
          {isUser ? (
            <User className="w-5 h-5 text-blue-600" />
          ) : (
            <Bot className="w-5 h-5 text-purple-600" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="font-medium">
              {isUser ? 'You' : 'Assistant'}
            </div>
            {message.timestamp && (
              <div className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
              </div>
            )}
          </div>
          <div className="mt-1 prose max-w-none">
            {message.content}
          </div>
          {message.context && !isUser && (
            <div className="mt-2 text-xs text-gray-500">
              {message.context.processedBooks && (
                <div>Processed {message.context.processedBooks} books</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;