'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { chatAPI, diagramAPI } from '@/lib/api';
import { useAuth } from './AuthContext';
import { useRouter } from 'next/navigation';

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentDiagram, setCurrentDiagram] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      loadChatHistory();
    } else {
      setMessages([]);
      setChatHistory([]);
      setCurrentDiagram(null);
    }
  }, [user]);

  const handleAuthError = () => {
    logout();
    router.push('/auth/login');
  };

  const loadChatHistory = async () => {
    try {
      const history = await chatAPI.getHistory();
      if (Array.isArray(history)) {
        setChatHistory(history);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
      if (error.message === 'Authentication required') {
        handleAuthError();
      }
    }
  };

  const sendMessage = async (messageData) => {
    setLoading(true);
    setError(null);

    try {
      if (!user) {
        throw new Error('Authentication required');
      }

      const messageContent = typeof messageData === 'string' ? messageData : messageData.content;
      const messageType = messageData.type || 'chat';

      // Add user message to UI
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: 'user',
        content: messageContent,
        type: messageType,
        timestamp: new Date().toISOString()
      }]);

      // Send to API
      const response = await chatAPI.sendMessage(messageContent);

      if (!response || !response.response) {
        throw new Error('Invalid response from server');
      }

      // Add assistant's response
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.response,
        type: messageType,
        context: response.context,
        timestamp: response.context?.timestamp || new Date().toISOString()
      }]);

      return response;
    } catch (error) {
      console.error('Chat error:', error);
      setError(error.message);
      
      if (error.message === 'Authentication required') {
        handleAuthError();
      }
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setCurrentDiagram(null);
    setError(null);
  };

  const value = {
    messages,
    chatHistory,
    currentDiagram,
    loading,
    error,
    sendMessage,
    clearChat,
    loadChatHistory
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};