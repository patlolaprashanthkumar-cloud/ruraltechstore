import React from 'react';
import { 
  LayoutDashboard, 
  Grid3x3, 
  Users, 
  Settings, 
  FileText, 
  Wallet,
  PieChart,
  Headphones,
  GraduationCap,
  Stethoscope,
  ShoppingCart,
  Award
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { user } = useAuth();

  const getMenuItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'services', label: 'Services', icon: Grid3x3 },
    ];

    if (user?.role === 'admin' || user?.role === 'sub_admin') {
      return [
        ...baseItems,
        { id: 'users', label: 'User Management', icon: Users },
        { id: 'applications', label: 'Applications', icon: FileText },
        { id: 'training', label: 'Training Modules', icon: GraduationCap },
        { id: 'certificates', label: 'Certificates', icon: Award },
        { id: 'marketplace', label: 'Marketplace', icon: ShoppingCart },
        { id: 'analytics', label: 'Analytics', icon: PieChart },
        { id: 'settings', label: 'Settings', icon: Settings },
      ];
    } else {
      return [
        ...baseItems,
        { id: 'applications', label: 'My Applications', icon: FileText },
        { id: 'training', label: 'Training', icon: GraduationCap },
        { id: 'certificates', label: 'My Certificates', icon: Award },
        { id: 'healthcare', label: 'Healthcare', icon: Stethoscope },
        { id: 'marketplace', label: 'Marketplace', icon: ShoppingCart },
        { id: 'wallet', label: 'Wallet', icon: Wallet },
        { id: 'support', label: 'Support', icon: Headphones },
      ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 h-full">
      <nav className="mt-6 px-3">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;