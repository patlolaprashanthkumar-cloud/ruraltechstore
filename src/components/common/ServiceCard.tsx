import React from 'react';
import { ExternalLink, FileText, IndianRupee } from 'lucide-react';
import { Service } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface ServiceCardProps {
  service: Service;
  onApplyNow?: (service: Service) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onApplyNow }) => {
  const { user } = useAuth();

  const handleServiceClick = () => {
    if (service.redirectUrl && !service.hasApplyForm) {
      window.open(service.redirectUrl, '_blank', 'noopener,noreferrer');
    } else if (service.hasApplyForm && onApplyNow) {
      onApplyNow(service);
    } else if (service.redirectUrl) {
      window.open(service.redirectUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const getCommissionForUser = () => {
    if (!user?.role) return null;
    return service.commission[user.role as keyof typeof service.commission];
  };

  const commission = getCommissionForUser();

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
      {/* Service Image */}
      <div className="aspect-video relative overflow-hidden bg-gray-100">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {commission && commission > 0 && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
            <IndianRupee className="w-3 h-3 mr-1" />
            {commission}
          </div>
        )}
      </div>

      {/* Service Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">
          {service.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {service.description}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {service.redirectUrl && (
            <button
              onClick={() => window.open(service.redirectUrl, '_blank', 'noopener,noreferrer')}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Visit Portal</span>
            </button>
          )}
          
          {service.hasApplyForm && (
            <button
              onClick={handleServiceClick}
              className={`flex-1 border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
                !service.redirectUrl ? 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100' : ''
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Apply Now</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;