'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import ChatBox from '@/components/chat/ChatBox';
import DiagramViewer from '@/components/diagrams/DiagramViewer';
import ChatHistory from '@/components/chat/ChatHistory';
import ProtectedLayout from '@/components/layout/ProtectedLayout';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { currentDiagram, chatHistory, setCurrentDiagram } = useChat();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <ProtectedLayout>
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left sidebar for chat history */}
        <div className="w-64 border-r bg-gray-50 hidden lg:block">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-4">Recent Chats</h3>
            <ChatHistory />
          </div>
        </div>

        {/* Main chat area */}
        <div className="flex-1">
          <ChatBox
            onNewDiagram={setCurrentDiagram}
            initialMessages={chatHistory}
          />
        </div>

        {/* Right sidebar for diagram preview */}
        <div className="w-96 border-l bg-gray-50 p-4 hidden lg:block">
          <div className="text-sm font-medium text-gray-500 mb-4">Diagram Preview</div>
          <div className="aspect-square bg-white rounded-lg border">
            <DiagramViewer code={currentDiagram} />
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}