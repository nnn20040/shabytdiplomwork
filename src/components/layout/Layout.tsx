
import React, { ReactNode } from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
  redirectAuthenticatedTo?: string;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  requireAuth = false,
  redirectAuthenticatedTo
}) => {
  // Removed authentication checks and redirects

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="py-4">
        {children}
      </div>
    </div>
  );
};

export default Layout;
