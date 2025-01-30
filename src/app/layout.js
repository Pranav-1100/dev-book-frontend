import { AuthProvider } from '@/contexts/AuthContext';
import { ChatProvider } from '@/contexts/ChatContext';
import './globals.css';

export const metadata = {
  title: 'DevBook - Developer Documentation Assistant',
  description: 'Chat-based platform for developer documentation and diagrams',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
<body>
  <AuthProvider>
    <ChatProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 relative">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-400/10 to-green-400/10 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3" />
          <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-gradient-to-r from-purple-400/5 to-pink-400/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        {children}
      </div>
    </ChatProvider>
  </AuthProvider>
</body>
    </html>
  );
}


