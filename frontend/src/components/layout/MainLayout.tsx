import React from 'react';
import Header from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, title = 'Travel Tool' }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header title={title} />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
