import React from 'react';
import { LogOut, User, Wallet, Bell, MessageCircle, Mail } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      super_distributor: 'bg-purple-100 text-purple-800',
      distributor: 'bg-blue-100 text-blue-800',
      white_label: 'bg-green-100 text-green-800',
      retailer: 'bg-yellow-100 text-yellow-800',
      reseller: 'bg-gray-100 text-gray-800',
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatRole = (role: string) => {
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">RS</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Rural Services</h1>
                <p className="text-sm text-gray-500">Digital India for Villages</p>
              </div>
            </div>
          </div>

          {/* User Info and Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell className="w-5 h-5" />
            </button>

            {/* Support Links */}
            <div className="flex items-center space-x-2">
              <a
                href="https://wa.me/919391931543"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-green-600 hover:text-green-700 transition-colors"
                title="WhatsApp Support"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href="mailto:support@ruraltechstore.com"
                className="p-2 text-blue-600 hover:text-blue-700 transition-colors"
                title="Email Support"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
            {/* Wallet Balance (for non-admin users) */}
            {user?.role !== 'admin' && user?.walletBalance !== undefined && (
              <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg">
                <Wallet className="w-4 h-4 text-green-600" />
                <span className="text-green-800 font-medium">
                  ₹{user.walletBalance.toLocaleString('en-IN')}
                </span>
              </div>
            )}

            {/* User Info */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-400" />
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user?.role || '')}`}>
                    {formatRole(user?.role || '')}
                  </span>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;