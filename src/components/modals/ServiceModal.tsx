import React, { useState, useEffect } from 'react';
import { X, Upload, ExternalLink } from 'lucide-react';
import { Service, SERVICE_CATEGORIES, UserRole, INDIAN_STATES } from '../../types';

interface ServiceModalProps {
  service: Service | null;
  isEdit: boolean;
  onSave: (service: Partial<Service>) => void;
  onClose: () => void;
}

const ServiceModal: React.FC<ServiceModalProps> = ({ service, isEdit, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'utility' as keyof typeof SERVICE_CATEGORIES,
    image: '',
    redirectUrl: '',
    hasApplyForm: false,
    isActive: true,
    enabledRoles: [] as UserRole[],
    commission: {
      admin: 0,
      sub_admin: 0,
      super_distributor: 0,
      retailer: 0,
      distributor: 0,
    },
    states: [] as string[],
    documents: [] as string[],
    processingTime: '',
    fees: 0,
  });

  const roles: UserRole[] = ['admin', 'sub_admin', 'super_distributor', 'distributor', 'retailer'];

  useEffect(() => {
    if (isEdit && service) {
      setFormData({
        title: service.title,
        description: service.description,
        category: service.category,
        image: service.image,
        redirectUrl: service.redirectUrl || '',
        hasApplyForm: service.hasApplyForm,
        isActive: service.isActive,
        enabledRoles: [...service.enabledRoles],
        commission: { ...service.commission },
        states: service.states || [],
        documents: service.documents || [],
        processingTime: service.processingTime || '',
        fees: service.fees || 0,
      });
    }
  }, [isEdit, service]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleRoleToggle = (role: UserRole) => {
    setFormData(prev => ({
      ...prev,
      enabledRoles: prev.enabledRoles.includes(role)
        ? prev.enabledRoles.filter(r => r !== role)
        : [...prev.enabledRoles, role],
    }));
  };

  const handleStateToggle = (state: string) => {
    setFormData(prev => ({
      ...prev,
      states: prev.states.includes(state)
        ? prev.states.filter(s => s !== state)
        : [...prev.states, state],
    }));
  };

  const handleDocumentChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.map((doc, i) => i === index ? value : doc),
    }));
  };

  const addDocument = () => {
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ''],
    }));
  };

  const removeDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  const handleCommissionChange = (role: UserRole, value: string) => {
    setFormData(prev => ({
      ...prev,
      commission: {
        ...prev.commission,
        [role]: parseFloat(value) || 0,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {isEdit ? 'Edit Service' : 'Add New Service'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter service title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {Object.entries(SERVICE_CATEGORIES).map(([key, category]) => (
                    <option key={key} value={key}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Image URL *
                </label>
                <div className="relative">
                  <input
                    type="url"
                    name="image"
                    required
                    value={formData.image}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12"
                    placeholder="https://images.pexels.com/..."
                  />
                  <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Redirect URL (Optional)
                </label>
                <div className="relative">
                  <input
                    type="url"
                    name="redirectUrl"
                    value={formData.redirectUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12"
                    placeholder="https://official-portal.gov.in"
                  />
                  <ExternalLink className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Processing Time
                </label>
                <input
                  type="text"
                  name="processingTime"
                  value={formData.processingTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 7-10 days"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Government Fees (₹)
                </label>
                <input
                  type="number"
                  name="fees"
                  value={formData.fees}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the service..."
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="hasApplyForm"
                    id="hasApplyForm"
                    checked={formData.hasApplyForm}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-offset-0 focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <label htmlFor="hasApplyForm" className="ml-2 text-sm text-gray-700">
                    Enable "Apply Now" form
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-offset-0 focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                    Service is active
                  </label>
                </div>
              </div>

              {formData.image && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image Preview
                  </label>
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Invalid+URL';
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* Required Documents */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Documents</h3>
            <div className="space-y-2">
              {formData.documents.map((doc, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={doc}
                    onChange={(e) => handleDocumentChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Document name"
                  />
                  <button
                    type="button"
                    onClick={() => removeDocument(index)}
                    className="px-3 py-2 text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addDocument}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                + Add Document
              </button>
            </div>
          </div>
          
          {/* State Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Applicable States (Leave empty for all states)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-4">
              {INDIAN_STATES.map(state => (
                <label key={state} className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={formData.states.includes(state)}
                    onChange={() => handleStateToggle(state)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-offset-0 focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="text-gray-700">{state}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Role Permissions */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Role Permissions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {roles.map(role => (
                <div key={role} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <input
                      type="checkbox"
                      id={role}
                      checked={formData.enabledRoles.includes(role)}
                      onChange={() => handleRoleToggle(role)}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-offset-0 focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <label htmlFor={role} className="ml-2 text-sm font-medium text-gray-900 capitalize">
                      {role.replace('_', ' ')}
                    </label>
                  </div>
                  
                  {formData.enabledRoles.includes(role) && (
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Commission (₹)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.commission[role] || 0}
                        onChange={(e) => handleCommissionChange(role, e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0.00"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              {isEdit ? 'Update Service' : 'Create Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceModal;