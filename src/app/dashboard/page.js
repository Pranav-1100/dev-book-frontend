'use client';

import { useState } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { Clock, Grid, MessageSquare } from 'lucide-react';
import ChatHistory from '@/components/chat/ChatHistory';
import DiagramToggle from '@/components/diagrams/DiagramToggle';
import ProtectedLayout from '@/components/layout/ProtectedLayout';

export default function DashboardPage() {
  const [view, setView] = useState('chat'); // 'chat' or 'diagrams'
  const { chatHistory, currentDiagram } = useChat();

  return (
    <ProtectedLayout>
      <div className="h-[calc(100vh-4rem)] flex">
        {/* Left Sidebar */}
        <div className="w-64 border-r bg-gray-50">
          <div className="p-4">
            <div className="flex space-x-2 mb-6">
              <button
                onClick={() => setView('chat')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm flex items-center justify-center gap-2 ${
                  view === 'chat'
                    ? 'bg-blue-100 text-blue-600'
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                Chats
              </button>
              <button
                onClick={() => setView('diagrams')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm flex items-center justify-center gap-2 ${
                  view === 'diagrams'
                    ? 'bg-purple-100 text-purple-600'
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <Grid className="w-4 h-4" />
                Diagrams
              </button>
            </div>
            
            {/* Recent Activity */}
            <div className="mb-4">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-3">
                <Clock className="w-4 h-4" />
                Recent Activity
              </div>
              <ChatHistory />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          <div className="flex-1 h-full">
            {/* Your existing ChatBox component */}
            <div className="h-full flex flex-col">
              {view === 'chat' ? (
                <div className="flex-1 p-4">
                  <h1 className="text-2xl font-bold mb-4">Chat History</h1>
                  {/* Add your chat content here */}
                </div>
              ) : (
                <div className="flex-1 p-4">
                  <h1 className="text-2xl font-bold mb-4">Diagrams</h1>
                  {/* Add your diagrams content here */}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-96 border-l bg-gray-50">
            <DiagramToggle />
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}














