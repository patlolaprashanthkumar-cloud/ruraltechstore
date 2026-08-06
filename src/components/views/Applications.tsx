import React, { useState } from 'react';
import {
  Search, Eye, CheckCircle, XCircle, Clock, AlertCircle,
  Download, FileText, Filter, ChevronRight, MessageSquare,
  RefreshCw, MapPin, Phone
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

type AppStatus = 'pending' | 'processing' | 'approved' | 'rejected' | 'completed';

interface AppMessage { sender: string; text: string; time: string; isAgent: boolean; }

interface Application {
  id: string;
  trackingId: string;
  serviceName: string;
  category: string;
  applicantName: string;
  phone: string;
  email: string;
  state: string;
  district: string;
  status: AppStatus;
  fees: number;
  commission: number;
  createdAt: string;
  updatedAt: string;
  remarks?: string;
  documents?: string[];
  messages: AppMessage[];
}

const INIT_APPS: Application[] = [
  { id: '1', trackingId: 'APP-2024-0001', serviceName: 'New Passport Application', category: 'passport', applicantName: 'Ramesh Kumar', phone: '9876543210', email: 'ramesh@example.com', state: 'Telangana', district: 'Hyderabad', status: 'approved', fees: 1700, commission: 200, createdAt: '2024-06-01', updatedAt: '2024-06-15', documents: ['Aadhaar', 'Birth Certificate', 'Photo'], messages: [{ sender: 'Support', text: 'Application received. Verification in progress.', time: '2024-06-01 10:00', isAgent: true }, { sender: 'Ramesh Kumar', text: 'When will it be processed?', time: '2024-06-05 14:00', isAgent: false }, { sender: 'Support', text: 'Approved. Passport dispatched via courier.', time: '2024-06-15 09:00', isAgent: true }] },
  { id: '2', trackingId: 'APP-2024-0002', serviceName: 'GST Registration', category: 'taxation', applicantName: 'Sunita Devi', phone: '9765432109', email: 'sunita@example.com', state: 'Maharashtra', district: 'Mumbai', status: 'processing', fees: 1000, commission: 500, createdAt: '2024-06-05', updatedAt: '2024-06-10', documents: ['PAN Card', 'Address Proof', 'Bank Details'], messages: [{ sender: 'Support', text: 'Documents received. Processing has started.', time: '2024-06-06 11:00', isAgent: true }] },
  { id: '3', trackingId: 'APP-2024-0003', serviceName: 'PM Kisan Samman Nidhi', category: 'agriculture', applicantName: 'Mahesh Yadav', phone: '9654321098', email: 'mahesh@example.com', state: 'Uttar Pradesh', district: 'Agra', status: 'pending', fees: 0, commission: 50, createdAt: '2024-06-08', updatedAt: '2024-06-08', documents: ['Land Records', 'Aadhaar', 'Bank Passbook'], messages: [] },
  { id: '4', trackingId: 'APP-2024-0004', serviceName: 'Tatkal Passport', category: 'passport', applicantName: 'Ananya Sharma', phone: '9543210987', email: 'ananya@example.com', state: 'Delhi', district: 'New Delhi', status: 'completed', fees: 4000, commission: 500, createdAt: '2024-05-20', updatedAt: '2024-06-01', remarks: 'Dispatched via Speed Post AWB123456', documents: ['Aadhaar', 'PAN', 'Photo'], messages: [{ sender: 'Support', text: 'Passport dispatched. AWB: 123456', time: '2024-06-01 10:00', isAgent: true }] },
  { id: '5', trackingId: 'APP-2024-0005', serviceName: 'MUDRA Loan', category: 'banking', applicantName: 'Rajesh Gupta', phone: '9432109876', email: 'rajesh@example.com', state: 'Rajasthan', district: 'Jaipur', status: 'rejected', fees: 500, commission: 1000, createdAt: '2024-05-25', updatedAt: '2024-06-05', remarks: 'Income proof missing. Please reapply with Form 16.', documents: ['Business Plan', 'Identity Proof'], messages: [{ sender: 'Support', text: 'Application rejected due to incomplete documentation.', time: '2024-06-05 15:00', isAgent: true }] },
  { id: '6', trackingId: 'APP-2024-0006', serviceName: 'PAN Card Application', category: 'taxation', applicantName: 'Neha Singh', phone: '9321098765', email: 'neha@example.com', state: 'Karnataka', district: 'Bangalore', status: 'approved', fees: 207, commission: 100, createdAt: '2024-06-10', updatedAt: '2024-06-18', documents: ['Aadhaar', 'Photo'], messages: [] },
  { id: '7', trackingId: 'APP-2024-0007', serviceName: 'National Scholarship Portal', category: 'education', applicantName: 'Ravi Patel', phone: '9210987654', email: 'ravi@example.com', state: 'Gujarat', district: 'Surat', status: 'pending', fees: 0, commission: 100, createdAt: '2024-06-12', updatedAt: '2024-06-12', documents: ['Marksheet', 'Income Certificate', 'Caste Certificate'], messages: [] },
  { id: '8', trackingId: 'APP-2024-0008', serviceName: 'Online Doctor Consultation', category: 'healthcare', applicantName: 'Pooja Reddy', phone: '9109876543', email: 'pooja@example.com', state: 'Andhra Pradesh', district: 'Visakhapatnam', status: 'completed', fees: 300, commission: 50, createdAt: '2024-06-14', updatedAt: '2024-06-14', messages: [{ sender: 'Support', text: 'Consultation completed successfully.', time: '2024-06-14 16:00', isAgent: true }] },
  { id: '9', trackingId: 'APP-2024-0009', serviceName: 'Jan Dhan Yojana', category: 'banking', applicantName: 'Suman Verma', phone: '9098765432', email: 'suman@example.com', state: 'Bihar', district: 'Patna', status: 'processing', fees: 0, commission: 100, createdAt: '2024-06-15', updatedAt: '2024-06-16', documents: ['Aadhaar', 'Photo'], messages: [{ sender: 'Support', text: 'Account opening initiated with SBI.', time: '2024-06-16 10:00', isAgent: true }] },
  { id: '10', trackingId: 'APP-2024-0010', serviceName: 'Income Tax e-Filing', category: 'taxation', applicantName: 'Vijay Malhotra', phone: '9987654321', email: 'vijay@example.com', state: 'Punjab', district: 'Chandigarh', status: 'completed', fees: 500, commission: 200, createdAt: '2024-06-17', updatedAt: '2024-06-18', documents: ['Form 16', 'Bank Statements'], messages: [] },
];

const STATUS_CFG: Record<AppStatus, { color: string; bg: string; icon: React.FC<any>; label: string }> = {
  pending:    { color: 'text-yellow-700', bg: 'bg-yellow-100 border-yellow-200', icon: Clock, label: 'Pending' },
  processing: { color: 'text-blue-700',   bg: 'bg-blue-100 border-blue-200',   icon: RefreshCw, label: 'Processing' },
  approved:   { color: 'text-green-700',  bg: 'bg-green-100 border-green-200', icon: CheckCircle, label: 'Approved' },
  rejected:   { color: 'text-red-700',    bg: 'bg-red-100 border-red-200',     icon: XCircle, label: 'Rejected' },
  completed:  { color: 'text-teal-700',   bg: 'bg-teal-100 border-teal-200',   icon: CheckCircle, label: 'Completed' },
};

const CAT_COLORS: Record<string, string> = {
  passport: 'bg-blue-50 text-blue-700', taxation: 'bg-purple-50 text-purple-700',
  agriculture: 'bg-green-50 text-green-700', banking: 'bg-amber-50 text-amber-700',
  education: 'bg-pink-50 text-pink-700', healthcare: 'bg-red-50 text-red-700',
};

const Applications: React.FC = () => {
  const { user } = useAuth();
  const [apps, setApps] = useState<Application[]>(INIT_APPS);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCat, setFilterCat] = useState('all');
  const [selected, setSelected] = useState<Application | null>(null);
  const [replyText, setReplyText] = useState('');
  const [remarksInput, setRemarksInput] = useState('');
  const [view, setView] = useState<'list' | 'detail'>('list');

  const isAdmin = user?.role === 'admin' || user?.role === 'sub_admin';

  const filtered = apps.filter(a => {
    const q = search.toLowerCase();
    const matchSearch = !q || a.applicantName.toLowerCase().includes(q) || a.trackingId.toLowerCase().includes(q) || a.serviceName.toLowerCase().includes(q) || a.phone.includes(q);
    const matchStatus = filterStatus === 'all' || a.status === filterStatus;
    const matchCat = filterCat === 'all' || a.category === filterCat;
    return matchSearch && matchStatus && matchCat;
  });

  const updateStatus = (id: string, status: AppStatus, remarks?: string) => {
    setApps(prev => prev.map(a => a.id === id ? { ...a, status, remarks: remarks || a.remarks, updatedAt: new Date().toISOString().split('T')[0] } : a));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status, remarks: remarks || prev.remarks } : null);
  };

  const sendReply = (app: Application) => {
    if (!replyText.trim()) return;
    const msg: AppMessage = { sender: user?.name || 'Agent', text: replyText, time: new Date().toLocaleString('en-IN'), isAgent: true };
    const updated = { ...app, messages: [...app.messages, msg] };
    setApps(prev => prev.map(a => a.id === app.id ? updated : a));
    setSelected(updated);
    setReplyText('');
  };

  const exportCSV = () => {
    const csv = ['Tracking ID,Service,Applicant,Phone,State,District,Status,Fees,Commission,Date',
      ...filtered.map(a => `${a.trackingId},"${a.serviceName}","${a.applicantName}",${a.phone},${a.state},${a.district},${a.status},${a.fees},${a.commission},${a.createdAt}`)
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'applications.csv';
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  const openDetail = (app: Application) => { setSelected(app); setView('detail'); setRemarksInput(app.remarks || ''); };

  const stats = [
    { label: 'Total', value: apps.length, color: 'gray' },
    { label: 'Pending', value: apps.filter(a => a.status === 'pending').length, color: 'yellow' },
    { label: 'Processing', value: apps.filter(a => a.status === 'processing').length, color: 'blue' },
    { label: 'Completed', value: apps.filter(a => a.status === 'approved' || a.status === 'completed').length, color: 'green' },
    { label: 'Rejected', value: apps.filter(a => a.status === 'rejected').length, color: 'red' },
    { label: 'Revenue', value: `₹${apps.reduce((s, a) => s + a.commission, 0).toLocaleString('en-IN')}`, color: 'teal' },
  ];

  if (view === 'detail' && selected) {
    const cfg = STATUS_CFG[selected.status];
    const StatusIcon = cfg.icon;
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={() => setView('list')} className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium">
            ← Back to Applications
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{selected.serviceName}</h3>
                  <p className="text-gray-500 text-sm mt-0.5 font-mono">{selected.trackingId}</p>
                </div>
                <span className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-semibold border ${cfg.bg} ${cfg.color}`}>
                  <StatusIcon className="w-3.5 h-3.5" />{cfg.label}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                {[
                  { label: 'Applicant', value: selected.applicantName },
                  { label: 'Phone', value: selected.phone },
                  { label: 'Email', value: selected.email },
                  { label: 'State', value: selected.state },
                  { label: 'District', value: selected.district },
                  { label: 'Category', value: selected.category },
                  { label: 'Fees Paid', value: `₹${selected.fees}` },
                  { label: 'Commission', value: `₹${selected.commission}` },
                  { label: 'Applied On', value: new Date(selected.createdAt).toLocaleDateString('en-IN') },
                  { label: 'Last Updated', value: new Date(selected.updatedAt).toLocaleDateString('en-IN') },
                ].map(item => (
                  <div key={item.label} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="font-semibold text-gray-800 mt-0.5 text-xs sm:text-sm truncate">{item.value}</p>
                  </div>
                ))}
              </div>
              {selected.documents && selected.documents.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Documents Submitted</p>
                  <div className="flex flex-wrap gap-2">
                    {selected.documents.map(doc => (
                      <span key={doc} className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full">
                        <FileText className="w-3 h-3" />{doc}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {selected.remarks && (
                <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <p className="text-xs font-semibold text-orange-700 mb-0.5">Remarks</p>
                  <p className="text-sm text-orange-800">{selected.remarks}</p>
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Communication ({selected.messages.length})</h4>
              <div className="space-y-3 max-h-64 overflow-y-auto mb-3">
                {selected.messages.length === 0 && <p className="text-gray-400 text-sm text-center py-4">No messages yet</p>}
                {selected.messages.map((msg, i) => (
                  <div key={i} className={`flex gap-2.5 ${msg.isAgent ? '' : 'flex-row-reverse'}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${msg.isAgent ? 'bg-blue-600' : 'bg-gray-500'}`}>
                      {msg.isAgent ? 'A' : selected.applicantName.charAt(0)}
                    </div>
                    <div className={`max-w-[75%] rounded-xl p-2.5 text-sm ${msg.isAgent ? 'bg-blue-50 border border-blue-100 text-gray-800' : 'bg-gray-100 text-gray-800'}`}>
                      <p className="text-xs font-semibold mb-0.5 text-gray-600">{msg.sender}</p>
                      <p>{msg.text}</p>
                      <p className="text-xs text-gray-400 mt-1">{msg.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              {isAdmin && (
                <div className="flex gap-2">
                  <input value={replyText} onChange={e => setReplyText(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendReply(selected)}
                    placeholder="Type a message..." className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                  <button onClick={() => sendReply(selected)} disabled={!replyText.trim()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition-colors">Send</button>
                </div>
              )}
            </div>
          </div>

          {/* Actions Panel */}
          {isAdmin && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h4 className="font-semibold text-gray-900 mb-3">Update Status</h4>
                <div className="space-y-2">
                  {(['processing', 'approved', 'completed', 'rejected'] as AppStatus[]).map(s => {
                    const c = STATUS_CFG[s];
                    const SIcon = c.icon;
                    return (
                      <button key={s} onClick={() => updateStatus(selected.id, s, s === 'rejected' ? remarksInput : undefined)}
                        className={`w-full flex items-center gap-2 py-2.5 px-3 rounded-lg border text-sm font-medium transition-all ${selected.status === s ? `${c.bg} ${c.color} border-current` : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'}`}>
                        <SIcon className="w-4 h-4" />
                        {s === 'processing' ? 'Mark Processing' : s === 'approved' ? 'Approve' : s === 'completed' ? 'Mark Complete' : 'Reject'}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-3">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Remarks (optional)</label>
                  <textarea rows={3} value={remarksInput} onChange={e => setRemarksInput(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Add remarks or notes..." />
                  <button onClick={() => { const updated = { ...selected, remarks: remarksInput }; setApps(prev => prev.map(a => a.id === selected.id ? updated : a)); setSelected(updated); }}
                    className="mt-2 w-full py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition-colors">Save Remarks</button>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h4 className="font-semibold text-gray-900 mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  <button className="w-full flex items-center gap-2 py-2 px-3 rounded-lg border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition-colors">
                    <Download className="w-4 h-4" /> Download Application
                  </button>
                  <button className="w-full flex items-center gap-2 py-2 px-3 rounded-lg border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition-colors">
                    <Phone className="w-4 h-4" /> Call Applicant
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{isAdmin ? 'All Applications' : 'My Applications'}</h2>
          <p className="text-gray-500 text-sm mt-0.5">Track service applications and manage their lifecycle</p>
        </div>
        {isAdmin && (
          <button onClick={exportCSV} className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition-colors">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map(s => (
          <div key={s.label} className={`bg-${s.color}-50 border border-${s.color}-200 rounded-xl p-3 text-center`}>
            <p className={`text-xl font-bold text-${s.color}-900`}>{s.value}</p>
            <p className={`text-xs text-${s.color}-600 font-medium mt-0.5`}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-48 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search tracking ID, name, service, phone..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white">
            <option value="all">All Statuses</option>
            {Object.entries(STATUS_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white">
            <option value="all">All Categories</option>
            {['passport', 'taxation', 'agriculture', 'banking', 'education', 'healthcare'].map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
          </select>
        </div>
      </div>

      {/* Application Cards */}
      <div className="space-y-3">
        {filtered.map(app => {
          const cfg = STATUS_CFG[app.status];
          const StatusIcon = cfg.icon;
          return (
            <div key={app.id} className="bg-white rounded-xl border border-gray-200 hover:shadow-sm transition-all">
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${CAT_COLORS[app.category] || 'bg-gray-100 text-gray-600'}`}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 text-sm">{app.serviceName}</h3>
                      <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold border ${cfg.bg} ${cfg.color}`}>
                        <StatusIcon className="w-3 h-3" />{cfg.label}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${CAT_COLORS[app.category] || 'bg-gray-100 text-gray-600'}`}>{app.category}</span>
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                      <MapPin className="w-3 h-3" />{app.applicantName} • {app.phone} • {app.district}, {app.state}
                    </p>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                      <span>ID: <strong className="text-gray-700 font-mono">{app.trackingId}</strong></span>
                      <span>Applied: <strong className="text-gray-700">{new Date(app.createdAt).toLocaleDateString('en-IN')}</strong></span>
                      {app.fees > 0 && <span>Fees: <strong className="text-gray-700">₹{app.fees}</strong></span>}
                      <span>Commission: <strong className="text-green-700">₹{app.commission}</strong></span>
                      {app.messages.length > 0 && <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{app.messages.length}</span>}
                    </div>
                    {app.remarks && <p className="text-xs text-orange-600 mt-1.5 bg-orange-50 rounded px-2 py-0.5">{app.remarks}</p>}
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {isAdmin && app.status === 'pending' && (
                      <>
                        <button onClick={() => updateStatus(app.id, 'processing')} className="px-2.5 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">Process</button>
                        <button onClick={() => updateStatus(app.id, 'rejected')} className="px-2.5 py-1.5 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-semibold transition-colors">Reject</button>
                      </>
                    )}
                    {isAdmin && app.status === 'processing' && (
                      <button onClick={() => updateStatus(app.id, 'approved')} className="px-2.5 py-1.5 text-xs bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors">Approve</button>
                    )}
                    <button onClick={() => openDetail(app)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="py-16 text-center bg-white rounded-xl border border-gray-200">
            <FileText className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">No applications match your filters</p>
          </div>
        )}
      </div>
      <p className="text-sm text-gray-500 text-right">Showing {filtered.length} of {apps.length} applications</p>
    </div>
  );
};

export default Applications;
