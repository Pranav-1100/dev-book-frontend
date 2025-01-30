// Generates a Mermaid diagram code based on user input
export function generateDiagramCode(input) {
  // This is a simple example - in a real app, you'd want to use NLP or a more sophisticated approach
  const words = input.split(' ').filter(word => word.length > 2);
  let diagramCode = 'graph TD\n';
  
  for (let i = 0; i < words.length - 1; i++) {
    diagramCode += `    ${words[i]}[${words[i]}] --> ${words[i + 1]}[${words[i + 1]}]\n`;
  }
  
  return diagramCode;
}

// Format chat messages for display
export function formatMessage(message) {
  if (message.type === 'assistant' && message.diagram) {
    return {
      ...message,
      content: `${message.content}\n\`\`\`mermaid\n${message.diagram}\n\`\`\``,
    };
  }
  return message;
}

// Generate a unique ID for messages
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}