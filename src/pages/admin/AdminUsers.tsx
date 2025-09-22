import React, { useState } from 'react';
import { Search, Shield, User } from 'lucide-react';
import { Button, Input, Spinner } from '../../components/ui';
import { useAdminUserList } from '../../hooks/useAdminUserList';
import { useAdminSetUserRole } from '../../hooks/useAdminSetUserRole';
import { useToast } from '../../providers/ToastProvider';

export const AdminUsers: React.FC = () => {
  const [search, setSearch] = useState('');
  const { showToast } = useToast();
  const { data: users, isLoading, error } = useAdminUserList(search);
  const setUserRole = useAdminSetUserRole();

  const handleRoleToggle = async (userId: string, currentRole: 'admin' | 'user') => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    
    try {
      await setUserRole.mutateAsync({ userId, role: newRole });
      showToast(`User role updated to ${newRole}`, 'success');
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Failed to update user role',
        'error'
      );
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage user accounts and permissions</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search users by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Spinner size="lg" />
              <span className="ml-3 text-gray-600">Loading users...</span>
            </div>
          )}

          {error && (
            <div className="p-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-red-600">
                  {error instanceof Error ? error.message : 'Failed to load users'}
                </p>
              </div>
            </div>
          )}

          {!isLoading && !error && users && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Activity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.user_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {user.global_role === 'admin' ? (
                              <Shield size={16} className="text-red-500" />
                            ) : (
                              <User size={16} className="text-gray-400" />
                            )}
                            <span className={`text-sm font-medium ${
                              user.global_role === 'admin' ? 'text-red-600' : 'text-gray-600'
                            }`}>
                              {user.global_role}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.projects_count} projects, {user.documents_count} documents
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(user.last_login)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRoleToggle(user.user_id, user.global_role)}
                            disabled={setUserRole.isPending}
                          >
                            {setUserRole.isPending ? 'Updating...' : 
                              user.global_role === 'admin' ? 'Remove Admin' : 'Make Admin'
                            }
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};