import React, { useState } from 'react';
import { X, Video, Phone, MessageSquare, Calendar, Clock, User, Stethoscope } from 'lucide-react';

interface DoctorConsultationModalProps {
  onClose: () => void;
}

const DoctorConsultationModal: React.FC<DoctorConsultationModalProps> = ({ onClose }) => {
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [consultationType, setConsultationType] = useState<'video' | 'audio' | 'chat'>('video');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [patientDetails, setPatientDetails] = useState({
    name: '',
    age: '',
    gender: '',
    phone: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState(false);

  const doctors = [
    {
      id: '1',
      name: 'Dr. Rajesh Kumar',
      specialization: 'General Medicine',
      experience: '15 years',
      rating: 4.8,
      fee: 300,
      image: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg',
      availability: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
    },
    {
      id: '2',
      name: 'Dr. Priya Sharma',
      specialization: 'Pediatrics',
      experience: '12 years',
      rating: 4.9,
      fee: 350,
      image: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg',
      availability: ['10:00', '11:00', '12:00', '15:00', '16:00', '17:00']
    },
    {
      id: '3',
      name: 'Dr. Amit Patel',
      specialization: 'Cardiology',
      experience: '20 years',
      rating: 4.7,
      fee: 500,
      image: 'https://images.pexels.com/photos/6129967/pexels-photo-6129967.jpeg',
      availability: ['09:00', '10:00', '14:00', '15:00']
    },
    {
      id: '4',
      name: 'Dr. Sunita Reddy',
      specialization: 'Gynecology',
      experience: '18 years',
      rating: 4.8,
      fee: 400,
      image: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg',
      availability: ['11:00', '12:00', '16:00', '17:00', '18:00']
    }
  ];

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate booking process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setBooked(true);
    setLoading(false);
  };

  const selectedDoctorData = doctors.find(d => d.id === selectedDoctor);

  if (booked) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Stethoscope className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Consultation Booked!</h3>
          <p className="text-gray-600 mb-4">
            Your consultation with {selectedDoctorData?.name} has been scheduled successfully.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-blue-800">
              <strong>Appointment ID:</strong> DOC{Date.now()}<br/>
              <strong>Date & Time:</strong> {appointmentDate} at {appointmentTime}<br/>
              <strong>Type:</strong> {consultationType.charAt(0).toUpperCase() + consultationType.slice(1)} Consultation<br/>
              <strong>Fee:</strong> ₹{selectedDoctorData?.fee}
            </p>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            You will receive a confirmation SMS and email with the consultation link.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Book Doctor Consultation</h2>
              <p className="text-gray-600 mt-1">Consult with qualified doctors online</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleBooking} className="p-6 space-y-6">
          {/* Consultation Type */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Consultation Type</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { type: 'video', icon: Video, label: 'Video Call', description: 'Face-to-face consultation' },
                { type: 'audio', icon: Phone, label: 'Audio Call', description: 'Voice-only consultation' },
                { type: 'chat', icon: MessageSquare, label: 'Chat', description: 'Text-based consultation' }
              ].map(({ type, icon: Icon, label, description }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setConsultationType(type as any)}
                  className={`p-4 border-2 rounded-lg text-left transition-colors ${
                    consultationType === type
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className={`w-6 h-6 mb-2 ${
                    consultationType === type ? 'text-blue-600' : 'text-gray-600'
                  }`} />
                  <h4 className="font-medium text-gray-900">{label}</h4>
                  <p className="text-sm text-gray-600">{description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Doctor Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Doctor</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {doctors.map((doctor) => (
                <button
                  key={doctor.id}
                  type="button"
                  onClick={() => setSelectedDoctor(doctor.id)}
                  className={`p-4 border-2 rounded-lg text-left transition-colors ${
                    selectedDoctor === doctor.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{doctor.name}</h4>
                      <p className="text-sm text-gray-600">{doctor.specialization}</p>
                      <p className="text-sm text-gray-500">{doctor.experience} experience</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center">
                          <span className="text-yellow-400">★</span>
                          <span className="text-sm text-gray-600 ml-1">{doctor.rating}</span>
                        </div>
                        <span className="text-lg font-semibold text-green-600">₹{doctor.fee}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Date and Time Selection */}
          {selectedDoctor && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date *
                </label>
                <input
                  type="date"
                  required
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Time *
                </label>
                <select
                  required
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Time</option>
                  {selectedDoctorData?.availability.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Patient Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient Name *
                </label>
                <input
                  type="text"
                  required
                  value={patientDetails.name}
                  onChange={(e) => setPatientDetails({...patientDetails, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter patient name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age *
                </label>
                <input
                  type="number"
                  required
                  value={patientDetails.age}
                  onChange={(e) => setPatientDetails({...patientDetails, age: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter age"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender *
                </label>
                <select
                  required
                  value={patientDetails.gender}
                  onChange={(e) => setPatientDetails({...patientDetails, gender: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={patientDetails.phone}
                  onChange={(e) => setPatientDetails({...patientDetails, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter phone number"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={patientDetails.email}
                  onChange={(e) => setPatientDetails({...patientDetails, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter email address"
                />
              </div>
            </div>
          </div>

          {/* Symptoms */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe Symptoms *
            </label>
            <textarea
              required
              rows={4}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Please describe your symptoms in detail..."
            />
          </div>

          {/* Fee Summary */}
          {selectedDoctor && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Consultation Fee</h4>
              <div className="flex justify-between items-center">
                <span className="text-green-800">Total Amount:</span>
                <span className="text-xl font-bold text-green-900">₹{selectedDoctorData?.fee}</span>
              </div>
            </div>
          )}

          {/* Submit Button */}
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
              disabled={loading || !selectedDoctor}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Booking...</span>
                </div>
              ) : (
                'Book Consultation'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorConsultationModal;