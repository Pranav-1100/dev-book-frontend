import { useState } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { Download, Copy, X } from 'lucide-react';
import DiagramViewer from './DiagramViewer';

const DiagramToggle = () => {
  const { currentDiagram } = useChat();
  const [showPreview, setShowPreview] = useState(true);

  const getDiagramCode = () => {
    if (!currentDiagram) return '';
    return currentDiagram
      .replace(/```mermaid\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
  };

  const handleDownload = () => {
    if (!currentDiagram) return;
    const diagramCode = getDiagramCode();
    
    const blob = new Blob([diagramCode], { type: 'text/plain' });
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
    navigator.clipboard.writeText(getDiagramCode());
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
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="px-6 py-4 border-b bg-white sticky top-0 z-10"> {/* Increased padding */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-900">Diagram Preview</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-2 hover:bg-gray-100 rounded-lg" // Increased button padding
              title="Copy diagram code"
            >
              <Copy className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-gray-100 rounded-lg" // Increased button padding
              title="Download diagram"
            >
              <Download className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => setShowPreview(false)}
              className="p-2 hover:bg-gray-100 rounded-lg" // Increased button padding
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
            className={`flex-1 py-2 px-4 text-sm rounded-lg ${
              showPreview
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setShowPreview(false)}
            className={`flex-1 py-2 px-4 text-sm rounded-lg ${
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
      <div className="flex-1 overflow-auto">
        {showPreview ? (
          <div className="h-full min-h-[600px]"> {/* Increased minimum height */}
            <DiagramViewer code={currentDiagram} />
          </div>
        ) : (
          <pre className="text-sm bg-gray-50 p-6 rounded-lg overflow-auto m-6"> {/* Increased margins and padding */}
            <code>{getDiagramCode()}</code>
          </pre>
        )}
      </div>
    </div>
  );
};

export default DiagramToggle;