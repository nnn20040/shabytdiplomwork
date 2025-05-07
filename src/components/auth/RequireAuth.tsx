
import React from 'react';

interface RequireAuthProps {
  children: React.ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  // No authentication checks, no loading state - just render children directly
  return <>{children}</>;
};

export default RequireAuth;
