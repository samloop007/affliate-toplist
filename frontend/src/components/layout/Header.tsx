import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = 'Travel Tool' }) => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-travel-blue">
            {title}
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="outline" asChild>
            <Link to="/domains">Domains</Link>
          </Button>
          <Button asChild>
            <Link to="/admin">Admin</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
