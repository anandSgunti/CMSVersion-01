import React from 'react';
import { Navigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import { Spinner } from '../components/ui';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { data: profile, isLoading, error } = useProfile();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Spinner size="lg" />
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !profile || profile.global_role !== 'admin') {
    return <Navigate to="/projects" replace />;
  }

  return <>{children}</>;
};