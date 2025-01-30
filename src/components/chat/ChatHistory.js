import React, { useEffect, useState } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, FileText, Trash2, Grid, Search, Clock } from 'lucide-react';
import { diagramAPI } from '@/lib/api';

const ChatHistory = () => {
  const { chatHistory, loadChatHistory, setCurrentDiagram } = useChat();
  const [diagrams, setDiagrams] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadDiagrams();
  }, []);

  const loadDiagrams = async () => {
    try {
      setIsLoading(true);
      const diagramsData = await diagramAPI.getAll();
      setDiagrams(diagramsData);
    } catch (error) {
      console.error('Failed to load diagrams:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (itemId, isDiagram = false, e) => {
    e?.stopPropagation();
    try {
      if (isDiagram) {
        await diagramAPI.delete(itemId);
        await loadDiagrams();
      } else {
        await fetch(`/api/chat/${itemId}`, { method: 'DELETE' });
        loadChatHistory();
      }
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  const handleDiagramClick = async (diagramId) => {
    try {
      const diagram = await diagramAPI.getById(diagramId);
      if (diagram?.content?.mermaid) {
        const cleanMermaid = diagram.content.mermaid
          .replace(/```mermaid\n?/g, '')
          .replace(/```\n?/g, '')
          .trim();
        setCurrentDiagram(cleanMermaid);
      }
    } catch (error) {
      console.error('Failed to load diagram:', error);
    }
  };

  // Combine and filter history
  const combinedHistory = [
    ...(chatHistory || []).map(chat => ({ ...chat, type: 'chat' })),
    ...(diagrams || []).map(diagram => ({ 
      ...diagram, 
      type: 'diagram',
      createdAt: diagram.createdAt || diagram.generatedAt
    }))
  ]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .filter(item => {
      const searchLower = searchTerm.toLowerCase();
      const content = String(item.content || item.message || item.description || '');
      return content.toLowerCase().includes(searchLower);
    });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 p-[2px] animate-spin">
          <div className="w-full h-full bg-white rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Search Bar */}
      <div className="px-2 pb-4">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-100 border-0 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto">
        {!combinedHistory.length ? (
          <div className="text-center py-8 px-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">No conversations yet</p>
          </div>
        ) : (
          <div className="space-y-1 px-2">
            {combinedHistory.map((item) => (
              <div
                key={item.id}
                onClick={() => item.type === 'diagram' && handleDiagramClick(item.id)}
                className={`group rounded-xl p-3 cursor-pointer transition-all hover:shadow-sm ${
                  item.type === 'diagram' 
                    ? 'hover:bg-purple-50 hover:border-purple-100' 
                    : 'hover:bg-blue-50 hover:border-blue-100'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      item.type === 'diagram'
                        ? 'bg-gradient-to-br from-purple-500 to-purple-600'
                        : 'bg-gradient-to-br from-blue-500 to-blue-600'
                    }`}>
                      {item.type === 'diagram' ? (
                        <Grid className="w-5 h-5 text-white" />
                      ) : (
                        <MessageSquare className="w-5 h-5 text-white" />
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 line-clamp-2">
                          {item.type === 'diagram' ? item.description : item.content || item.message}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            item.type === 'diagram'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {item.type === 'diagram' ? 'Diagram' : 'Chat'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={(e) => handleDelete(item.id, item.type === 'diagram', e)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHistory;