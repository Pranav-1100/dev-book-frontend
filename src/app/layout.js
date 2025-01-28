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
            <div className="min-h-screen bg-white">
              {children}
            </div>
          </ChatProvider>
        </AuthProvider>
      </body>
    </html>
  );
}


