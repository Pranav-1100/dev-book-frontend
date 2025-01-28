'use client';

import { useChat } from '@/contexts/ChatContext';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, FileText, Trash2 } from 'lucide-react';

const ChatHistory = () => {
  const { chatHistory, loadChatHistory } = useChat();

  const handleDelete = async (chatId) => {
    try {
      await fetch(`/api/chat/${chatId}`, {
        method: 'DELETE',
      });
      loadChatHistory(); // Refresh the chat history
    } catch (error) {
      console.error('Failed to delete chat:', error);
    }
  };

  const getDisplayText = (chat) => {
    if (!chat) return 'Unknown message';
    
    // Check for different message formats
    if (chat.message) return chat.message;
    if (chat.content) return chat.content;
    if (chat.response) return chat.response;
    
    return 'Unknown message';
  };

  if (!chatHistory?.length) {
    return (
      <div className="text-sm text-gray-500 text-center py-4">
        No chat history yet
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {chatHistory.map((chat) => {
        const displayText = getDisplayText(chat);
        
        return (
          <div
            key={chat.id}
            className="group flex items-start gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
          >
            <div className="flex-shrink-0">
              {chat.type === 'diagram' ? (
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-purple-600" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 truncate">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {displayText.substring(0, 40)}...
                  </p>
                  <p className="text-xs text-gray-500">
                    {chat.createdAt && formatDistanceToNow(new Date(chat.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(chat.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded-full transition-opacity"
                >
                  <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                </button>
              </div>
              {chat.type === 'diagram' && (
                <div className="mt-1 text-xs text-purple-600">
                  Diagram
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatHistory;