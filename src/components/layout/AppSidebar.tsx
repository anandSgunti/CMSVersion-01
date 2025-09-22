import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  PanelsTopLeft, 
  FileText, 
  ClipboardCheck, 
  LogOut, 
  Settings,
  User,
  Shield,
  Activity
} from 'lucide-react';
import { Button } from '../ui';
import { useSession } from '../../providers/SessionProvider';
import { useProfile } from '../../hooks/useProfile';
import { supabase } from '../../lib/supabaseClient';
import { useToast } from '../../providers/ToastProvider';
import logo from "../../assets/med1.png"; // Fixed path


export const AppSidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useSession();
  const { data: profile } = useProfile();
  const { showToast } = useToast();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      showToast('Successfully signed out', 'success');
    } catch (error) {
      showToast('Failed to sign out', 'error');
    }
  };

  const navItems = [
   
    {
      to: '/projects',
      label: 'Projects',
      icon: PanelsTopLeft,
    },
    {
      to: '/docs',
      label: 'My Documents',
      icon: FileText,
    },
    {
      to: '/reviews',
      label: 'Library',
      icon: ClipboardCheck,
    },
     {
      to: '/dashboard',
      label: 'Dashboard',
      icon: Activity,
    },
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-gradient-to-b from-[#D22630] to-[#A30C14] min-h-screen w-80 flex flex-col shadow-lg transition-colors">
      {/* Johnson & Johnson Brand Header */}
      <div className="p-8 border-b border-white/10">
        <div className="flex items-center gap-4 mb-6">
            <img
              src={logo}
              alt="Mednet Health Logo"
              className="w-12 h-12 object-contain"
            />
          <div>
            <h1 className="text-xl font-bold text-white">
              Healthcare Innovation Platform
            </h1>
            <p className="text-sm text-white/80 font-medium">
            </p>
          </div>
        </div>

        {/* User Profile Section */}
        {user && profile && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-md border border-white/30">
                {profile.name ? getInitials(profile.name) : <User size={20} />}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-white truncate">
                  {profile.name || 'User'}
                </h3>
                <p className="text-xs text-white/70 truncate">
                  {profile.email || user.email}
                </p>
                {profile.global_role === 'admin' && (
                  <div className="flex items-center gap-1 mt-1">
                    <Shield size={12} className="text-white/90" />
                    <span className="text-xs text-white/90 font-medium">
                      Administrator
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Navigation Menu */}
      <nav className="flex-1 px-6 py-8">
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to || 
              (item.to === '/projects' && location.pathname.startsWith('/projects'));
            
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`group flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-[#D22630] shadow-lg transform scale-[1.02]'
                    : 'text-white hover:bg-white/10 hover:text-white'
                }`}
                style={{ color: isActive ? '#D22630' : 'white' }}
              >
                <div className={`p-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-red-50' 
                    : 'bg-white/10 group-hover:bg-white/20'
                }`}>
                  <Icon size={20} className={isActive ? 'text-[#D22630]' : 'text-white group-hover:text-white'} style={{ color: isActive ? '#D22630' : 'white' }} />
                </div>
                <div className="flex-1">
                  <div className={`font-semibold text-sm ${
                    isActive ? 'text-[#D22630]' : 'text-white'
                  }`} style={{ color: isActive ? '#D22630' : 'white' }}>
                    {item.label}
                  </div>
                  <div className={`text-xs mt-0.5 ${
                    isActive 
                      ? 'text-[#D22630]/70' 
                      : 'text-white/60 group-hover:text-white/80'
                  }`}>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Healthcare Mission Statement
        <div className="mt-12 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
          <div className="flex items-center gap-2 mb-2">
            <Activity size={16} className="text-white/90" />
            <span className="text-sm font-semibold text-white">
              Our Mission
            </span>
          </div>
          <p className="text-xs text-white/70 leading-relaxed">
            Advancing healthcare innovation through collaborative research and development
          </p>
        </div> */}
      </nav>

      {/* Bottom Actions */}
      <div className="p-6 border-t border-white/10">
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-white/90 hover:bg-white/10 hover:text-white"
          >
            <Settings size={16} className="mr-3" />
            Settings
          </Button>
          
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="w-full justify-start text-white/90 hover:bg-white/10 hover:text-white"
          >
            <LogOut size={16} className="mr-3" />
            Sign Out
          </Button>
        </div>

        {/* J&J Footer */}
        {/* <div className="mt-6 pt-4 border-t border-white/10">
          <div className="flex items-center justify-center gap-2 text-xs text-white/70">
            <Heart size={12} className="text-white/90" />
          </div>
        </div> */}
      </div>
    </div>
  );
};