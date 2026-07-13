import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Users, TrendingUp, Download } from 'lucide-react';
import { SERVICE_CATEGORIES, Service, INDIAN_STATES } from '../../types';
import { COMPREHENSIVE_SERVICES } from '../../data/comprehensiveServices';
import ServiceCard from '../common/ServiceCard';
import ServiceModal from '../modals/ServiceModal';
import ChatBot from '../common/ChatBot';

const AdminDashboard: React.FC = () => {
  const [services, setServices] = useState<Service[]>(COMPREHENSIVE_SERVICES);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');

  const handleAddService = () => {
    setSelectedService(null);
    setIsEditMode(false);
    setShowServiceModal(true);
  };

  const handleEditService = (service: Service) => {
    setSelectedService(service);
    setIsEditMode(true);
    setShowServiceModal(true);
  };

  const handleDeleteService = (serviceId: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      setServices(services.filter(s => s.id !== serviceId));
    }
  };

  const handleToggleService = (serviceId: string) => {
    setServices(services.map(s => 
      s.id === serviceId ? { ...s, isActive: !s.isActive } : s
    ));
  };

  const handleServiceSave = (serviceData: Partial<Service>) => {
    if (isEditMode && selectedService) {
      setServices(services.map(s => 
        s.id === selectedService.id 
          ? { ...s, ...serviceData, updatedAt: new Date().toISOString() }
          : s
      ));
    } else {
      const newService: Service = {
        id: `service-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...serviceData as Service,
      };
      setServices([...services, newService]);
    }
    setShowServiceModal(false);
  };

  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const matchesState = selectedState === 'all' || 
                        !service.states || 
                        service.states.includes(selectedState);
    return matchesCategory && matchesState;
  });

  const downloadServiceReport = () => {
    const reportData = services.map(service => ({
      title: service.title,
      category: service.category,
      isActive: service.isActive,
      enabledRoles: service.enabledRoles.join(', '),
      commission: Object.entries(service.commission)
        .map(([role, amount]) => `${role}: ₹${amount}`)
        .join(', '),
      states: service.states?.join(', ') || 'All States'
    }));
    
    const csvContent = [
      'Title,Category,Status,Enabled Roles,Commission,States',
      ...reportData.map(row => 
        `"${row.title}","${row.category}","${row.isActive ? 'Active' : 'Inactive'}","${row.enabledRoles}","${row.commission}","${row.states}"`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'services-report.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStats = () => {
    const totalServices = services.length;
    const activeServices = services.filter(s => s.isActive).length;
    const totalCategories = new Set(services.map(s => s.category)).size;
    const avgCommission = services.reduce((sum, s) => {
      const commissions = Object.values(s.commission).filter(c => c && c > 0) as number[];
      return sum + (commissions.length > 0 ? commissions.reduce((a, b) => a + b, 0) / commissions.length : 0);
    }, 0) / services.length;

    return { totalServices, activeServices, totalCategories, avgCommission };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Admin Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Services</p>
              <p className="text-2xl font-bold text-blue-900">{stats.totalServices}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Active Services</p>
              <p className="text-2xl font-bold text-green-900">{stats.activeServices}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Categories</p>
              <p className="text-2xl font-bold text-purple-900">{stats.totalCategories}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Avg Commission</p>
              <p className="text-2xl font-bold text-orange-900">₹{stats.avgCommission.toFixed(1)}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Service Management Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Service Management</h2>
            <p className="text-gray-600">Add, edit, and manage all portal services</p>
          </div>
          
          <div className="flex items-center gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              {Object.entries(SERVICE_CATEGORIES).map(([key, category]) => (
                <option key={key} value={key}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
            
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All States</option>
              {INDIAN_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            
            <button
              onClick={downloadServiceReport}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            
            <button
              onClick={handleAddService}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Service</span>
            </button>
          </div>
        </div>
      </div>

      {/* Services Grid with Admin Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredServices.map((service) => (
          <div key={service.id} className="relative group">
            <ServiceCard service={service} />
            
            {/* Admin Actions Overlay */}
            <div className="absolute top-2 left-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleToggleService(service.id)}
                className={`p-1.5 rounded-full text-white text-xs ${
                  service.isActive ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
                }`}
                title={service.isActive ? 'Disable Service' : 'Enable Service'}
              >
                {service.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              </button>
              
              <button
                onClick={() => handleEditService(service)}
                className="p-1.5 bg-blue-500 hover:bg-blue-600 rounded-full text-white text-xs"
                title="Edit Service"
              >
                <Edit className="w-3 h-3" />
              </button>
              
              <button
                onClick={() => handleDeleteService(service.id)}
                className="p-1.5 bg-red-500 hover:bg-red-600 rounded-full text-white text-xs"
                title="Delete Service"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>

            {/* Status Badge */}
            <div className={`absolute bottom-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${
              service.isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {service.isActive ? 'Active' : 'Disabled'}
            </div>
          </div>
        ))}
      </div>

      {/* Service Modal */}
      {showServiceModal && (
        <ServiceModal
          service={selectedService}
          isEdit={isEditMode}
          onSave={handleServiceSave}
          onClose={() => setShowServiceModal(false)}
        />
      )}
      
      {/* AI ChatBot */}
      <ChatBot />
    </div>
  );
};

export default AdminDashboard;