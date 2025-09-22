import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Users, FileText } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';

export const AdminNavigation: React.FC = () => {
  const location = useLocation();
  const { data: profile } = useProfile();

  if (!profile || profile.global_role !== 'admin') {
    return null;
  }

  const adminLinks = [
    {
      to: '/admin',
      label: 'Admin Dashboard',
      icon: BarChart3,
    },
    {
      to: '/admin/users',
      label: 'Users',
      icon: Users,
    },
    {
      to: '/admin/documents',
      label: 'Documents',
      icon: FileText,
    },
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-8">
        <nav className="flex space-x-8">
          {adminLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={16} />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};