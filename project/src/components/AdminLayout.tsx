import React from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  FileText, 
  LogOut, 
  Map, 
  LayoutDashboard,
  GitBranch
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active: boolean;
}

function SidebarItem({ icon, label, to, active }: SidebarItemProps) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        active 
          ? 'bg-blue-100 text-blue-700' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
}

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const menuItems = [
    {
      icon: <LayoutDashboard size={24} />,
      label: 'Tableau de bord',
      to: '/admin',
      roles: ['super_admin', 'admin'],
    },
    {
      icon: <Map size={24} />,
      label: 'Provinces',
      to: '/admin/provinces',
      roles: ['super_admin'],
    },
    {
      icon: <Building2 size={24} />,
      label: 'Directions',
      to: '/admin/directions',
      roles: ['super_admin'],
    },
    {
      icon: <GitBranch size={24} />,
      label: 'Antennes',
      to: '/admin/branches',
      roles: ['super_admin', 'admin'],
    },
    {
      icon: <Users size={24} />,
      label: 'Utilisateurs',
      to: '/admin/users',
      roles: ['super_admin', 'admin'],
    },
    {
      icon: <FileText size={24} />,
      label: 'Plaintes',
      to: '/complaints',
      roles: ['super_admin', 'admin', 'complaint_manager', 'inspector'],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-4">
        <div className="flex flex-col h-full">
          <div className="mb-8">
            <h1 className="text-xl font-bold text-gray-900">
              Administration
            </h1>
          </div>

          <nav className="flex-1 space-y-2">
            {menuItems
              .filter(item => item.roles.includes(profile?.role))
              .map(item => (
                <SidebarItem
                  key={item.to}
                  icon={item.icon}
                  label={item.label}
                  to={item.to}
                  active={location.pathname === item.to}
                />
              ))}
          </nav>

          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-3 w-full text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut size={24} />
              <span className="font-medium">Déconnexion</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}