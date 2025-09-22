import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSession } from '../providers/SessionProvider';
import { Spinner } from '../components/ui';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { session, loading } = useSession();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Spinner size="lg" />
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  return <>{children}</>;
};