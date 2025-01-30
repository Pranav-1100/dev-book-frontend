import React, { useEffect, useState } from 'react';
import mermaid from 'mermaid';
import { Grid, AlertCircle } from 'lucide-react';

mermaid.initialize({
  startOnLoad: true,
  theme: 'neutral',
  securityLevel: 'loose',
  fontFamily: 'ui-sans-serif, system-ui, sans-serif',
  flowchart: {
    htmlLabels: true,
    curve: 'basis',
    padding: 50,
    nodeSpacing: 80,
    rankSpacing: 80,
    diagramPadding: 50,
    useMaxWidth: false
  }
});

const DiagramViewer = ({ code }) => {
  const [svgCode, setSvgCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!code) return;

    const renderDiagram = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Clean up the mermaid code
        let diagramCode = code;
        
        // Handle JSON string
        if (typeof code === 'string' && code.includes('"mermaid":')) {
          try {
            const parsed = JSON.parse(code);
            diagramCode = parsed.content.mermaid;
          } catch (e) {
            console.log('Not a JSON string, using as is');
          }
        }
        
        // Remove mermaid wrapper if present
        diagramCode = diagramCode
          .replace(/```mermaid\n?/g, '')
          .replace(/```\n?/g, '')
          .trim();

        const id = 'diagram-' + Math.random().toString(36).substr(2, 9);
        const { svg } = await mermaid.render(id, diagramCode);
        
        // Modify the SVG to be responsive and add padding
        const modifiedSvg = svg
          .replace(/<svg /, '<svg preserveAspectRatio="xMidYMid meet" ')
          .replace(/style="/, 'style="padding: 40px; max-width: 100%; ');
        
        setSvgCode(modifiedSvg);
      } catch (error) {
        console.error('Failed to render diagram:', error);
        setError('Failed to render diagram. Please check the syntax.');
        setSvgCode('');
      } finally {
        setIsLoading(false);
      }
    };

    renderDiagram();
  }, [code]);

  if (!code) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <Grid className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500 font-medium mb-2">No Diagram Selected</p>
        <p className="text-sm text-gray-400">
          Enter a diagram description in chat to generate one
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8">
        <div className="w-16 h-16 mb-4">
          <div className="w-full h-full rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
        </div>
        <p className="text-gray-600 font-medium">Rendering Diagram...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 mb-4 rounded-2xl bg-red-100 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <p className="text-red-600 font-medium mb-2">Rendering Error</p>
        <p className="text-sm text-gray-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-50 to-white rounded-xl border shadow-sm overflow-hidden">
      <div className="w-full h-full overflow-auto">
        {/* Zoom Controls */}
        <div className="sticky top-0 right-0 p-4 flex justify-end">
          <div className="bg-white rounded-lg shadow-sm border flex items-center p-1">
            <button
              onClick={() => {
                const diagram = document.querySelector('.diagram-container svg');
                if (diagram) {
                  diagram.style.transform = 'scale(1)';
                }
              }}
              className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md"
            >
              Reset Zoom
            </button>
          </div>
        </div>
        
        {/* Diagram Container */}
        <div 
          className="diagram-container w-full min-h-[600px] p-8 flex items-center justify-center"
        >
          <div 
            className="transform-gpu transition-transform duration-200"
            dangerouslySetInnerHTML={{ __html: svgCode }}
          />
        </div>
      </div>
    </div>
  );
};

export default DiagramViewer;