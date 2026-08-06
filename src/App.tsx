import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginForm from './components/auth/LoginForm';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import Dashboard from './components/dashboard/Dashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import UserManagement from './components/views/UserManagement';
import Applications from './components/views/Applications';
import Training from './components/views/Training';
import Certificates from './components/views/Certificates';
import Healthcare from './components/views/Healthcare';
import Marketplace from './components/views/Marketplace';
import Analytics from './components/views/Analytics';
import Wallet from './components/views/Wallet';
import Support from './components/views/Support';
import Settings from './components/views/Settings';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
            <span className="text-white font-bold text-2xl">RS</span>
          </div>
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Rural Services Portal...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const isAdmin = user.role === 'admin' || user.role === 'sub_admin';

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return isAdmin ? <AdminDashboard /> : <Dashboard />;
      case 'services':
        return <Dashboard />;
      case 'users':
        return <UserManagement />;
      case 'applications':
        return <Applications />;
      case 'training':
        return <Training />;
      case 'certificates':
        return <Certificates />;
      case 'healthcare':
        return <Healthcare />;
      case 'marketplace':
        return <Marketplace />;
      case 'analytics':
        return <Analytics />;
      case 'wallet':
        return <Wallet />;
      case 'support':
        return <Support />;
      case 'settings':
        return <Settings />;
      default:
        return isAdmin ? <AdminDashboard /> : <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-6 overflow-hidden">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
