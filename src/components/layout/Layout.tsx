
import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

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
  const { isAuthenticated, user } = useAuth();
  
  // Redirect authenticated users if specified
  if (isAuthenticated && redirectAuthenticatedTo) {
    return <Navigate to={redirectAuthenticatedTo} />;
  }
  
  // Redirect unauthenticated users if auth is required
  if (!isAuthenticated && requireAuth) {
    return <Navigate to="/login" />;
  }

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
