'use client';

import React, { useEffect, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: true,
  theme: 'neutral',
  securityLevel: 'loose',
  fontFamily: 'ui-sans-serif, system-ui, sans-serif',
});

const DiagramViewer = ({ code }) => {
  const [svgCode, setSvgCode] = useState('');

  useEffect(() => {
    if (!code) return;

    const renderDiagram = async () => {
      try {
        const { svg } = await mermaid.render('diagram', code);
        setSvgCode(svg);
      } catch (error) {
        console.error('Failed to render diagram:', error);
      }
    };

    renderDiagram();
  }, [code]);

  if (!code) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Enter a diagram description to generate
      </div>
    );
  }

  return (
    <div 
      className="w-full h-full flex items-center justify-center p-4"
      dangerouslySetInnerHTML={{ __html: svgCode }}
    />
  );
};

export default DiagramViewer;
