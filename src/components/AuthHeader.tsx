import React from 'react';
import { useSession } from '../providers/SessionProvider';

export const AuthHeader: React.FC = () => {
  const { loading } = useSession();

  if (loading) {
    return (
      <header className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="h-8"></div>
      </header>
    );
  }

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-8 py-4 transition-colors">
      {/* Header content can be added here if needed */}
    </header>
  );
};