'use client';

import { useState } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { Download, Copy, X } from 'lucide-react';
import DiagramViewer from './DiagramViewer';

const DiagramToggle = () => {
  const { currentDiagram } = useChat();
  const [showPreview, setShowPreview] = useState(true);

  const handleDownload = () => {
    if (!currentDiagram) return;

    // Create blob and download
    const blob = new Blob([currentDiagram], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'diagram.mmd';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    if (!currentDiagram) return;
    navigator.clipboard.writeText(currentDiagram);
    // You might want to show a toast notification here
  };

  if (!currentDiagram) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 p-4 text-center">
        No diagram to display.
        <br />
        Use the diagram mode to generate one.
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-900">Diagram Preview</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-1 hover:bg-gray-100 rounded-lg"
              title="Copy diagram code"
            >
              <Copy className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={handleDownload}
              className="p-1 hover:bg-gray-100 rounded-lg"
              title="Download diagram"
            >
              <Download className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => setShowPreview(false)}
              className="p-1 hover:bg-gray-100 rounded-lg"
              title="Close preview"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Preview Toggle */}
        <div className="flex space-x-2">
          <button
            onClick={() => setShowPreview(true)}
            className={`flex-1 py-1 px-3 text-sm rounded-lg ${
              showPreview
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setShowPreview(false)}
            className={`flex-1 py-1 px-3 text-sm rounded-lg ${
              !showPreview
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Code
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {showPreview ? (
          <div className="h-full">
            <DiagramViewer code={currentDiagram} />
          </div>
        ) : (
          <pre className="text-sm bg-gray-50 p-4 rounded-lg overflow-auto">
            <code>{currentDiagram}</code>
          </pre>
        )}
      </div>
    </div>
  );
};

export default DiagramToggle;