import React, { useState } from 'react';
import { Award, Download, Eye, CheckCircle, Hash, Shield, Share2, X, Calendar, Star } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface Certificate {
  id: string; certNumber: string; courseName: string; category: string;
  issuedDate: string; expiryDate: string; score: number;
  status: 'active' | 'expired' | 'revoked'; issuer: string;
  skills: string[];
}

const CERTS: Certificate[] = [
  { id: '1', certNumber: 'CERT-DL-2024-001234', courseName: 'Digital Literacy Fundamentals', category: 'Technology', issuedDate: '2024-03-15', expiryDate: '2026-03-15', score: 92, status: 'active', issuer: 'Rural Services Academy', skills: ['Computer Basics', 'Internet Usage', 'UPI Payments', 'Digital Safety'] },
  { id: '2', certNumber: 'CERT-PS-2024-002345', courseName: 'Passport & Documentation Services', category: 'Documentation', issuedDate: '2024-04-20', expiryDate: '2026-04-20', score: 88, status: 'active', issuer: 'Rural Services Academy', skills: ['Passport Application', 'PAN Services', 'Aadhaar Update', 'Document Verification'] },
  { id: '3', certNumber: 'CERT-FL-2023-003456', courseName: 'Financial Literacy & Banking', category: 'Finance', issuedDate: '2023-08-10', expiryDate: '2025-08-10', score: 78, status: 'active', issuer: 'Rural Services Academy', skills: ['Banking Basics', 'Insurance', 'Loans', 'GST Awareness'] },
];

const STATUS_CFG = {
  active: { color: 'text-green-700 bg-green-100 border-green-200', dot: 'bg-green-500' },
  expired: { color: 'text-gray-600 bg-gray-100 border-gray-200', dot: 'bg-gray-400' },
  revoked: { color: 'text-red-700 bg-red-100 border-red-200', dot: 'bg-red-500' },
};

const GRADE = (score: number) => score >= 90 ? 'A+' : score >= 80 ? 'A' : score >= 70 ? 'B+' : score >= 60 ? 'B' : 'C';
const GRADE_COLOR = (score: number) => score >= 90 ? 'text-green-600' : score >= 80 ? 'text-blue-600' : score >= 70 ? 'text-teal-600' : 'text-amber-600';

const Certificates: React.FC = () => {
  const { user } = useAuth();
  const [selected, setSelected] = useState<Certificate | null>(null);
  const [copied, setCopied] = useState(false);

  const handleDownload = (cert: Certificate) => {
    const content = `
╔══════════════════════════════════════════════════════════╗
║             CERTIFICATE OF COMPLETION                    ║
║                Rural Services Academy                    ║
╚══════════════════════════════════════════════════════════╝

This is to certify that

    ${user?.name?.toUpperCase() || 'PARTICIPANT'}

has successfully completed the training program

    "${cert.courseName}"

Certificate No : ${cert.certNumber}
Issue Date     : ${new Date(cert.issuedDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
Valid Until    : ${new Date(cert.expiryDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
Score Achieved : ${cert.score}% (Grade: ${GRADE(cert.score)})
Category       : ${cert.category}

Skills Validated:
${cert.skills.map(s => `  • ${s}`).join('\n')}

Issued by: ${cert.issuer}
Digital Signature: RS-${cert.certNumber.slice(-8)}

This certificate is digitally issued and can be verified at:
https://ruralservices.gov.in/verify/${cert.certNumber}
`.trim();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${cert.certNumber}.txt`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  const handleShare = (cert: Certificate) => {
    const text = `I just earned the "${cert.courseName}" certificate from Rural Services Academy! Certificate: ${cert.certNumber}`;
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const avgScore = CERTS.length ? Math.round(CERTS.reduce((s, c) => s + c.score, 0) / CERTS.length) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">My Certificates</h2>
        <p className="text-gray-500 text-sm mt-0.5">View, download and share your earned certifications</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Earned', value: CERTS.length, icon: Award, color: 'amber' },
          { label: 'Active', value: CERTS.filter(c => c.status === 'active').length, icon: CheckCircle, color: 'green' },
          { label: 'Avg Score', value: `${avgScore}%`, icon: Star, color: 'blue' },
          { label: 'Best Grade', value: GRADE(Math.max(...CERTS.map(c => c.score))), icon: Shield, color: 'teal' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`bg-${s.color}-50 border border-${s.color}-200 rounded-xl p-4 flex items-center gap-3`}>
              <Icon className={`w-8 h-8 text-${s.color}-500`} />
              <div>
                <p className={`text-2xl font-bold text-${s.color}-900`}>{s.value}</p>
                <p className={`text-xs text-${s.color}-600 font-medium`}>{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {CERTS.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CERTS.map(cert => (
            <div key={cert.id} className={`bg-white rounded-xl border overflow-hidden hover:shadow-md transition-shadow ${cert.status === 'active' ? 'border-amber-200' : 'border-gray-200'}`}>
              {/* Card header */}
              <div className="relative overflow-hidden bg-gradient-to-135 from-amber-500 via-orange-500 to-red-500 p-5">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 rounded-full" />
                <div className="relative">
                  <Award className="w-10 h-10 text-white mb-2" />
                  <h3 className="font-bold text-white text-sm leading-tight">{cert.courseName}</h3>
                  <p className="text-orange-100 text-xs mt-1">{cert.category}</p>
                </div>
                <div className="absolute top-3 right-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${STATUS_CFG[cert.status].color}`}>{cert.status}</span>
                </div>
              </div>
              {/* Card body */}
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Hash className="w-3.5 h-3.5 text-gray-400" />
                  <span className="font-mono text-gray-600 truncate">{cert.certNumber}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-gray-400 flex items-center gap-1"><Calendar className="w-3 h-3" />Issued</p>
                    <p className="font-semibold text-gray-700 mt-0.5">{new Date(cert.issuedDate).toLocaleDateString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Valid Until</p>
                    <p className="font-semibold text-gray-700 mt-0.5">{new Date(cert.expiryDate).toLocaleDateString('en-IN')}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <p className="text-xs text-gray-400">Score</p>
                    <div className="flex items-baseline gap-1.5">
                      <span className={`text-xl font-bold ${GRADE_COLOR(cert.score)}`}>{cert.score}%</span>
                      <span className={`text-sm font-bold ${GRADE_COLOR(cert.score)}`}>({GRADE(cert.score)})</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleShare(cert)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Share">
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => setSelected(cert)} className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Preview">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDownload(cert)} className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Download">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {/* Skills */}
                <div className="flex flex-wrap gap-1 pt-1 border-t border-gray-100">
                  {cert.skills.slice(0, 3).map(s => <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{s}</span>)}
                  {cert.skills.length > 3 && <span className="text-xs text-gray-400">+{cert.skills.length - 3}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <Award className="w-14 h-14 mx-auto mb-3 text-gray-200" />
          <h3 className="text-lg font-bold text-gray-700 mb-1">No certificates yet</h3>
          <p className="text-gray-500 text-sm">Complete training courses to earn certificates</p>
        </div>
      )}

      {/* Copy notification */}
      {copied && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg z-50">
          Copied to clipboard!
        </div>
      )}

      {/* Certificate Preview Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
            <div className="relative bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 p-8 text-center">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 10px)' }} />
              <button onClick={() => setSelected(null)} className="absolute top-3 right-3 bg-black/20 text-white rounded-full p-1 hover:bg-black/40 transition-colors">
                <X className="w-4 h-4" />
              </button>
              <Award className="w-16 h-16 mx-auto mb-2 text-white drop-shadow-lg" />
              <h2 className="text-xl font-bold text-white">Certificate of Completion</h2>
              <p className="text-amber-100 text-sm">Rural Services Academy</p>
            </div>
            <div className="p-6 text-center border-b-4 border-amber-400">
              <p className="text-sm text-gray-500 mb-1">This is to certify that</p>
              <p className="text-2xl font-bold text-gray-900 mb-1">{user?.name}</p>
              <p className="text-sm text-gray-500 mb-3">has successfully completed</p>
              <h3 className="text-lg font-bold text-gray-800 mb-4 px-4">"{selected.courseName}"</h3>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-400">Score</p>
                  <p className={`text-lg font-bold ${GRADE_COLOR(selected.score)}`}>{selected.score}%</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-400">Grade</p>
                  <p className={`text-lg font-bold ${GRADE_COLOR(selected.score)}`}>{GRADE(selected.score)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-400">Status</p>
                  <p className="text-sm font-bold text-green-600 capitalize">{selected.status}</p>
                </div>
              </div>
              <p className="text-xs font-mono text-gray-400 mb-0.5">{selected.certNumber}</p>
              <p className="text-xs text-gray-500">Issued: {new Date(selected.issuedDate).toLocaleDateString('en-IN')} · Valid till: {new Date(selected.expiryDate).toLocaleDateString('en-IN')}</p>
            </div>
            <div className="p-4 flex gap-3">
              <button onClick={() => handleShare(selected)} className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <Share2 className="w-4 h-4" /> Share
              </button>
              <button onClick={() => handleDownload(selected)} className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                <Download className="w-4 h-4" /> Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Certificates;
