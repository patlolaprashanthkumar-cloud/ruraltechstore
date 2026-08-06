import React, { useState } from 'react';
import { SERVICE_CATEGORIES, INDIAN_STATES } from '../../types';
import { COMPREHENSIVE_SERVICES } from '../../data/comprehensiveServices';
import { useAuth } from '../../contexts/AuthContext';
import ServiceCard from '../common/ServiceCard';
import ApplicationModal from '../modals/ApplicationModal';
import PassportApplicationModal from '../modals/PassportApplicationModal';
import DoctorConsultationModal from '../modals/DoctorConsultationModal';
import ChatBot from '../common/ChatBot';
import { Service } from '../../types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showPassportModal, setShowPassportModal] = useState(false);
  const [showDoctorModal, setShowDoctorModal] = useState(false);

  // Filter services based on user role
  const availableServices = COMPREHENSIVE_SERVICES.filter(service => 
    service.isActive && 
    service.enabledRoles.includes(user?.role as any)
  );

  // Filter services based on category, state, and search
  const filteredServices = availableServices.filter(service => {
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const matchesState = selectedState === 'all' || 
                        !service.states || 
                        service.states.includes(selectedState);
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesState && matchesSearch;
  });

  const handleApplyNow = (service: Service) => {
    if (service.category === 'passport') {
      setSelectedService(service);
      setShowPassportModal(true);
      return;
    }
    
    if (service.id === 'doctor-consultation') {
      setShowDoctorModal(true);
      return;
    }
    
    setSelectedService(service);
    setShowApplicationModal(true);
  };

  const handleCloseModal = () => {
    setShowApplicationModal(false);
    setShowPassportModal(false);
    setShowDoctorModal(false);
    setSelectedService(null);
  };

  const getServiceStats = () => {
    const totalServices = availableServices.length;
    const categories = new Set(availableServices.map(s => s.category)).size;
    const withCommission = availableServices.filter(s => 
      s.commission[user?.role as keyof typeof s.commission] && 
      s.commission[user?.role as keyof typeof s.commission]! > 0
    ).length;

    return { totalServices, categories, withCommission };
  };

  const stats = getServiceStats();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome, {user?.name}!</h1>
        <p className="text-blue-100 mb-4">
          Access all government and partner services from your {user?.role.replace('_', ' ')} panel
        </p>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold">{stats.totalServices}</div>
            <div className="text-sm text-blue-100">Available Services</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold">{stats.categories}</div>
            <div className="text-sm text-blue-100">Service Categories</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold">{stats.withCommission}</div>
            <div className="text-sm text-blue-100">Commission Services</div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="lg:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              {Object.entries(SERVICE_CATEGORIES).map(([key, category]) => (
                <option key={key} value={key}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="lg:w-64">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All States</option>
              {INDIAN_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredServices.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onApplyNow={handleApplyNow}
          />
        ))}
      </div>

      {/* No Results */}
      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
          <p className="text-gray-500">
            Try adjusting your search or category filter
          </p>
        </div>
      )}

      {/* Application Modal */}
      {showApplicationModal && selectedService && (
        <ApplicationModal
          service={selectedService}
          onClose={handleCloseModal}
        />
      )}
      
      {/* Passport Application Modal */}
      {showPassportModal && selectedService && (
        <PassportApplicationModal
          service={selectedService}
          onClose={handleCloseModal}
        />
      )}
      
      {/* Doctor Consultation Modal */}
      {showDoctorModal && (
        <DoctorConsultationModal
          onClose={handleCloseModal}
        />
      )}
      
      {/* AI ChatBot */}
      <ChatBot />
    </div>
  );
};

export default Dashboard;