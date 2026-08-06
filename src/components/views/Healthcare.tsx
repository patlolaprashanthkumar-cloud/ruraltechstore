import React, { useState } from 'react';
import {
  Heart, Video, Phone, MessageSquare, Calendar, Clock, Star,
  ChevronRight, Activity, Pill, FileText, RefreshCw, Plus,
  User, Stethoscope, CheckCircle, AlertCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import DoctorConsultationModal from '../modals/DoctorConsultationModal';

interface Appointment {
  id: string; doctorName: string; specialization: string;
  date: string; time: string; type: 'video' | 'audio' | 'chat';
  status: 'upcoming' | 'completed' | 'cancelled'; fees: number;
  notes?: string; prescription?: string;
}

const APPOINTMENTS: Appointment[] = [
  { id: '1', doctorName: 'Dr. Rajesh Kumar', specialization: 'General Medicine', date: '2024-06-20', time: '10:00', type: 'video', status: 'upcoming', fees: 300 },
  { id: '2', doctorName: 'Dr. Priya Sharma', specialization: 'Pediatrics', date: '2024-06-10', time: '11:00', type: 'audio', status: 'completed', fees: 350, notes: 'Child health checkup. Vitamin D supplement recommended.', prescription: 'Vitamin D3 1000 IU daily for 3 months' },
  { id: '3', doctorName: 'Dr. Amit Patel', specialization: 'Cardiology', date: '2024-05-25', time: '14:00', type: 'video', status: 'completed', fees: 500, notes: 'ECG normal. BP 120/80. Annual checkup recommended.' },
  { id: '4', doctorName: 'Dr. Sunita Reddy', specialization: 'Gynecology', date: '2024-05-15', time: '16:00', type: 'chat', status: 'cancelled', fees: 400 },
];

const HEALTH_PACKAGES = [
  { name: 'Basic Health Check', tests: 12, price: 999, popular: false, includes: ['CBC', 'Blood Sugar', 'Urine', 'BP', 'BMI', 'Thyroid', 'Cholesterol', 'Liver Function', 'Kidney Function', 'ECG', 'Chest X-Ray', 'Doctor Consultation'] },
  { name: 'Comprehensive Package', tests: 28, price: 2499, popular: true, includes: ['All Basic Tests', 'Vitamin B12', 'Vitamin D', 'HbA1c', 'PSA / CA-125', 'Bone Density', 'Eye Checkup', 'Dental Checkup', 'Diet Consultation', 'Cardiac Risk Profile', 'Ultrasound Abdomen', 'Full Body Scan'] },
  { name: 'Diabetes Care', tests: 8, price: 749, popular: false, includes: ['Blood Sugar Fasting', 'Blood Sugar PP', 'HbA1c', 'Urine Micro', 'Kidney Function', 'Cholesterol', 'Eye Checkup', 'Foot Examination'] },
];

const GOVT_SCHEMES = [
  { name: 'Ayushman Bharat PM-JAY', desc: 'Health coverage up to ₹5 lakh per family/year', badge: 'Government', color: 'bg-green-600' },
  { name: 'PMSBY - Accidental Insurance', desc: '₹2 lakh accidental death/disability cover at ₹20/year', badge: 'Insurance', color: 'bg-blue-600' },
  { name: 'PMJJBY - Life Insurance', desc: '₹2 lakh life insurance cover at ₹436/year', badge: 'Insurance', color: 'bg-teal-600' },
  { name: 'Janani Suraksha Yojana', desc: 'Maternal health scheme for BPL pregnant women', badge: 'Maternal', color: 'bg-pink-600' },
];

const typeIcons = { video: Video, audio: Phone, chat: MessageSquare };
const statusCfg = {
  upcoming: { color: 'bg-blue-100 text-blue-700', label: 'Upcoming', icon: Clock },
  completed: { color: 'bg-green-100 text-green-700', label: 'Completed', icon: CheckCircle },
  cancelled: { color: 'bg-red-100 text-red-600', label: 'Cancelled', icon: AlertCircle },
};

const Healthcare: React.FC = () => {
  const { user } = useAuth();
  const [showConsult, setShowConsult] = useState(false);
  const [tab, setTab] = useState<'appointments' | 'packages' | 'schemes' | 'records'>('appointments');
  const [expandedApt, setExpandedApt] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Healthcare Services</h2>
        <p className="text-gray-500 text-sm mt-0.5">Access medical consultations, health packages, and government schemes</p>
      </div>

      {/* Hero Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button onClick={() => setShowConsult(true)}
          className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-xl p-5 text-left hover:opacity-95 transition-all shadow group">
          <div className="flex items-start justify-between">
            <div>
              <Video className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-base">Book Consultation</h3>
              <p className="text-blue-200 text-xs mt-1">Connect with qualified doctors online</p>
              <p className="text-sm font-bold text-blue-100 mt-2">From ₹300 <ChevronRight className="w-4 h-4 inline" /></p>
            </div>
          </div>
        </button>

        <button onClick={() => setTab('packages')}
          className="bg-gradient-to-br from-teal-500 to-green-700 text-white rounded-xl p-5 text-left hover:opacity-95 transition-all shadow group">
          <div className="flex items-start justify-between">
            <div>
              <Activity className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-base">Health Packages</h3>
              <p className="text-teal-100 text-xs mt-1">Comprehensive checkup plans</p>
              <p className="text-sm font-bold text-teal-100 mt-2">From ₹749 <ChevronRight className="w-4 h-4 inline" /></p>
            </div>
          </div>
        </button>

        <button onClick={() => setTab('schemes')}
          className="bg-gradient-to-br from-pink-500 to-rose-700 text-white rounded-xl p-5 text-left hover:opacity-95 transition-all shadow group">
          <div className="flex items-start justify-between">
            <div>
              <Heart className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-base">Govt Schemes</h3>
              <p className="text-pink-100 text-xs mt-1">PM-JAY, PMSBY, PMJJBY & more</p>
              <p className="text-sm font-bold text-pink-100 mt-2">Free / Low-cost <ChevronRight className="w-4 h-4 inline" /></p>
            </div>
          </div>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit overflow-x-auto">
        {([
          { id: 'appointments', label: 'Appointments' },
          { id: 'packages', label: 'Health Packages' },
          { id: 'schemes', label: 'Gov. Schemes' },
          { id: 'records', label: 'Health Tips' },
        ] as const).map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${tab === t.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Appointments Tab */}
      {tab === 'appointments' && (
        <div className="space-y-3">
          {APPOINTMENTS.map(apt => {
            const TypeIcon = typeIcons[apt.type];
            const scfg = statusCfg[apt.status];
            const SIcon = scfg.icon;
            return (
              <div key={apt.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-sm transition-shadow">
                <div className="p-4 cursor-pointer" onClick={() => setExpandedApt(expandedApt === apt.id ? null : apt.id)}>
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <TypeIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900 text-sm">{apt.doctorName}</h3>
                        <span className="text-xs text-gray-500">{apt.specialization}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 ${scfg.color}`}>
                          <SIcon className="w-3 h-3" />{scfg.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(apt.date).toLocaleDateString('en-IN')}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{apt.time}</span>
                        <span className="capitalize">{apt.type} call</span>
                        <span className="font-medium text-gray-700">₹{apt.fees}</span>
                      </div>
                    </div>
                    {apt.status === 'completed' && (
                      <button className="flex-shrink-0 text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1" onClick={e => { e.stopPropagation(); setShowConsult(true); }}>
                        <RefreshCw className="w-3.5 h-3.5" />Rebook
                      </button>
                    )}
                  </div>
                </div>
                {expandedApt === apt.id && (apt.notes || apt.prescription) && (
                  <div className="px-4 pb-4 space-y-2 border-t border-gray-100 pt-3">
                    {apt.notes && (
                      <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                        <p className="text-xs font-semibold text-blue-700 mb-0.5">Doctor's Notes</p>
                        <p className="text-sm text-blue-800">{apt.notes}</p>
                      </div>
                    )}
                    {apt.prescription && (
                      <div className="bg-green-50 border border-green-100 rounded-lg p-3">
                        <p className="text-xs font-semibold text-green-700 mb-0.5 flex items-center gap-1"><Pill className="w-3.5 h-3.5" />Prescription</p>
                        <p className="text-sm text-green-800">{apt.prescription}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          <button onClick={() => setShowConsult(true)}
            className="w-full py-4 border-2 border-dashed border-blue-300 text-blue-600 rounded-xl hover:border-blue-400 hover:bg-blue-50/50 transition-colors text-sm font-semibold flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" />Book New Consultation
          </button>
        </div>
      )}

      {/* Health Packages Tab */}
      {tab === 'packages' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {HEALTH_PACKAGES.map(pkg => (
            <div key={pkg.name} className={`bg-white rounded-xl border-2 overflow-hidden hover:shadow-md transition-shadow ${pkg.popular ? 'border-blue-400' : 'border-gray-200'}`}>
              {pkg.popular && <div className="bg-blue-600 text-white text-xs font-bold text-center py-1.5">⭐ Most Popular</div>}
              <div className="p-5">
                <h3 className="font-bold text-gray-900 text-base mb-0.5">{pkg.name}</h3>
                <p className="text-gray-500 text-xs mb-3">{pkg.tests} Tests Included</p>
                <p className="text-3xl font-bold text-gray-900 mb-4">₹{pkg.price.toLocaleString('en-IN')}</p>
                <ul className="space-y-1.5 mb-5">
                  {pkg.includes.map(item => (
                    <li key={item} className="flex items-center gap-2 text-xs text-gray-600">
                      <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />{item}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-2.5 rounded-xl text-sm font-bold transition-colors ${pkg.popular ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}>
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Govt Schemes Tab */}
      {tab === 'schemes' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {GOVT_SCHEMES.map(scheme => (
            <div key={scheme.name} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 ${scheme.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900 text-sm">{scheme.name}</h3>
                    <span className={`text-xs ${scheme.color} text-white px-2 py-0.5 rounded-full font-semibold`}>{scheme.badge}</span>
                  </div>
                  <p className="text-gray-600 text-xs mb-3">{scheme.desc}</p>
                  <button className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
                    Apply / Check Eligibility <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Health Tips Tab */}
      {tab === 'records' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: Activity, tip: 'Walk 30 minutes daily — reduces heart disease risk by 35%', color: 'text-red-500 bg-red-50', label: 'Fitness' },
            { icon: Pill, tip: 'Take prescribed medications at the same time daily for best results', color: 'text-blue-500 bg-blue-50', label: 'Medication' },
            { icon: Heart, tip: 'Annual health checkup helps detect chronic diseases early and saves lives', color: 'text-pink-500 bg-pink-50', label: 'Prevention' },
            { icon: RefreshCw, tip: 'Drink at least 8 glasses of water daily to stay hydrated and energetic', color: 'text-teal-500 bg-teal-50', label: 'Hydration' },
            { icon: Stethoscope, tip: "Don't ignore symptoms — early diagnosis significantly improves treatment outcomes", color: 'text-purple-500 bg-purple-50', label: 'Awareness' },
            { icon: User, tip: 'Mental health is equally important — talk to a doctor if you feel persistently sad', color: 'text-amber-500 bg-amber-50', label: 'Mental Health' },
            { icon: FileText, tip: 'Keep all medical records organized — they help doctors provide better treatment', color: 'text-green-500 bg-green-50', label: 'Records' },
            { icon: Star, tip: 'Vaccinate your children on time — check the national immunization schedule', color: 'text-orange-500 bg-orange-50', label: 'Vaccination' },
          ].map((tip, i) => {
            const Icon = tip.icon;
            return (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-3 hover:shadow-sm transition-shadow">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${tip.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{tip.label}</span>
                  <p className="text-sm text-gray-700 mt-0.5">{tip.tip}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showConsult && <DoctorConsultationModal onClose={() => setShowConsult(false)} />}
    </div>
  );
};

export default Healthcare;
