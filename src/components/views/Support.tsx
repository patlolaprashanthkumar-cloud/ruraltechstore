import React, { useState } from 'react';
import { MessageSquare, Plus, X, Send, Search, Clock, CheckCircle, AlertCircle, Zap, Phone, Mail, ChevronRight, ArrowLeft, Paperclip, Tag } from 'lucide-react';

type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

interface Message { id: string; sender: 'user' | 'agent'; text: string; time: string; }

interface Ticket {
  id: string; subject: string; category: string; status: TicketStatus;
  priority: TicketPriority; createdAt: string; updatedAt: string;
  messages: Message[]; assignedTo?: string;
}

const TICKETS: Ticket[] = [
  {
    id: 'TKT-0041', subject: 'Commission not credited for June batch', category: 'Payments', status: 'in_progress', priority: 'high', createdAt: '2024-06-28', updatedAt: '2024-06-29', assignedTo: 'Priya Support',
    messages: [
      { id: '1', sender: 'user', text: 'My commission for the June batch of passport applications (12 completed) was not credited on the 27th as expected. Please look into this urgently.', time: '2024-06-28 10:30' },
      { id: '2', sender: 'agent', text: 'Hello! I have raised this to our finance team. The commission batch for June is being processed. Please allow 2 business days for the credit to reflect in your wallet.', time: '2024-06-28 14:15' },
      { id: '3', sender: 'user', text: 'It is now the 29th and still no credit. Can you escalate this?', time: '2024-06-29 09:00' },
      { id: '4', sender: 'agent', text: 'I have escalated this to our senior finance team. You will receive the credit by EOD today. Apologies for the inconvenience.', time: '2024-06-29 11:00' },
    ]
  },
  {
    id: 'TKT-0038', subject: 'Unable to upload documents for Aadhaar update', category: 'Technical', status: 'resolved', priority: 'medium', createdAt: '2024-06-25', updatedAt: '2024-06-26', assignedTo: 'Rahul Tech',
    messages: [
      { id: '1', sender: 'user', text: 'When I try to upload the address proof for Aadhaar update, it shows "File too large" error even for files under 1MB.', time: '2024-06-25 15:00' },
      { id: '2', sender: 'agent', text: 'We are aware of this issue. Our tech team has pushed a fix. Please try again and let us know if the problem persists.', time: '2024-06-25 18:30' },
      { id: '3', sender: 'user', text: 'Working now! Thank you for the quick resolution.', time: '2024-06-26 10:00' },
    ]
  },
  {
    id: 'TKT-0035', subject: 'Training module quiz answers showing wrong', category: 'Training', status: 'open', priority: 'low', createdAt: '2024-06-22', updatedAt: '2024-06-22',
    messages: [
      { id: '1', sender: 'user', text: 'In the Digital Literacy quiz, Question 3 marks my answer as wrong even though it matches the answer shown in the lesson material. Please review.', time: '2024-06-22 12:00' },
    ]
  },
  {
    id: 'TKT-0031', subject: 'New retailer onboarding - KYC stuck in processing', category: 'Onboarding', status: 'open', priority: 'urgent', createdAt: '2024-06-20', updatedAt: '2024-06-21',
    messages: [
      { id: '1', sender: 'user', text: 'I added a new retailer 3 days ago and their KYC has been in "processing" state since then. They need access urgently to serve customers. Please expedite.', time: '2024-06-20 09:00' },
      { id: '2', sender: 'agent', text: 'I have flagged this to the KYC team. Our SLA for KYC is 48 hours but we will try to fast-track this.', time: '2024-06-21 10:00' },
    ]
  },
];

const STATUS_CFG: Record<TicketStatus, { color: string; bg: string; icon: React.FC<any>; label: string }> = {
  open: { color: 'text-amber-700', bg: 'bg-amber-100 border-amber-200', icon: Clock, label: 'Open' },
  in_progress: { color: 'text-blue-700', bg: 'bg-blue-100 border-blue-200', icon: Zap, label: 'In Progress' },
  resolved: { color: 'text-green-700', bg: 'bg-green-100 border-green-200', icon: CheckCircle, label: 'Resolved' },
  closed: { color: 'text-gray-600', bg: 'bg-gray-100 border-gray-200', icon: CheckCircle, label: 'Closed' },
};

const PRIORITY_CFG: Record<TicketPriority, { color: string; dot: string }> = {
  low: { color: 'text-gray-500', dot: 'bg-gray-400' },
  medium: { color: 'text-blue-600', dot: 'bg-blue-500' },
  high: { color: 'text-orange-600', dot: 'bg-orange-500' },
  urgent: { color: 'text-red-600', dot: 'bg-red-500' },
};

const CATEGORIES = ['Technical Issue', 'Payment/Commission', 'KYC/Onboarding', 'Training', 'Service Query', 'Other'];

const Support: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>(TICKETS);
  const [active, setActive] = useState<Ticket | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');
  const [message, setMessage] = useState('');
  const [newTicket, setNewTicket] = useState({ subject: '', category: '', priority: 'medium' as TicketPriority, description: '' });

  const filtered = tickets.filter(t =>
    (statusFilter === 'all' || t.status === statusFilter) &&
    (t.subject.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase()))
  );

  const sendMessage = () => {
    if (!message.trim() || !active) return;
    const msg: Message = { id: String(Date.now()), sender: 'user', text: message.trim(), time: new Date().toLocaleString('en-IN') };
    const updated = tickets.map(t => t.id === active.id ? { ...t, messages: [...t.messages, msg], updatedAt: new Date().toISOString().split('T')[0] } : t);
    setTickets(updated);
    setActive({ ...active, messages: [...active.messages, msg] });
    setMessage('');
    setTimeout(() => {
      const reply: Message = { id: String(Date.now() + 1), sender: 'agent', text: 'Thank you for the update. Our team will review and respond shortly.', time: new Date().toLocaleString('en-IN') };
      setTickets(prev => prev.map(t => t.id === active.id ? { ...t, messages: [...t.messages, msg, reply] } : t));
      setActive(prev => prev ? { ...prev, messages: [...prev.messages, reply] } : prev);
    }, 1500);
  };

  const submitTicket = () => {
    if (!newTicket.subject || !newTicket.description) return;
    const ticket: Ticket = {
      id: `TKT-00${45 + tickets.length}`, subject: newTicket.subject, category: newTicket.category || 'Other',
      status: 'open', priority: newTicket.priority, createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      messages: [{ id: '1', sender: 'user', text: newTicket.description, time: new Date().toLocaleString('en-IN') }]
    };
    setTickets(prev => [ticket, ...prev]);
    setShowNew(false);
    setNewTicket({ subject: '', category: '', priority: 'medium', description: '' });
    setActive(ticket);
  };

  const openCount = tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length;

  if (active) {
    const cfg = STATUS_CFG[active.status];
    const StatusIcon = cfg.icon;
    return (
      <div className="space-y-4 h-full flex flex-col">
        <button onClick={() => setActive(null)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors font-medium self-start">
          <ArrowLeft className="w-4 h-4" /> Back to Tickets
        </button>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col" style={{ height: '75vh' }}>
          {/* Header */}
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-gray-400">{active.id}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${cfg.bg} ${cfg.color} flex items-center gap-1`}>
                    <StatusIcon className="w-3 h-3" />{cfg.label}
                  </span>
                  <span className={`flex items-center gap-1 text-xs font-semibold ${PRIORITY_CFG[active.priority].color}`}>
                    <span className={`w-2 h-2 rounded-full ${PRIORITY_CFG[active.priority].dot}`} />{active.priority}
                  </span>
                </div>
                <h3 className="font-bold text-gray-800">{active.subject}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{active.category} · Opened {active.createdAt}{active.assignedTo ? ` · Assigned to ${active.assignedTo}` : ''}</p>
              </div>
            </div>
          </div>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {active.messages.map(msg => (
              <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {msg.sender === 'user' ? 'Y' : 'S'}
                </div>
                <div className={`max-w-sm rounded-2xl px-4 py-2.5 ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-gray-100 text-gray-800 rounded-tl-sm'}`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>{msg.time}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Input */}
          {active.status !== 'resolved' && active.status !== 'closed' && (
            <div className="px-4 py-3 border-t border-gray-100 flex gap-2">
              <input value={message} onChange={e => setMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder="Type your message..." className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400" />
              <button onClick={sendMessage} disabled={!message.trim()} className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 text-white rounded-xl transition-colors">
                <Send className="w-4 h-4" />
              </button>
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
          <h2 className="text-2xl font-bold text-gray-900">Support Center</h2>
          <p className="text-gray-500 text-sm mt-0.5">Get help, raise tickets, and track your issues</p>
        </div>
        <button onClick={() => setShowNew(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors">
          <Plus className="w-4 h-4" /> New Ticket
        </button>
      </div>

      {/* Quick Contact */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Phone, label: 'Call Support', sub: '1800-XXX-XXXX (Toll Free)', color: 'green', action: 'Call Now' },
          { icon: Mail, label: 'Email Support', sub: 'support@ruralservices.gov.in', color: 'blue', action: 'Send Email' },
          { icon: MessageSquare, label: 'WhatsApp', sub: '+91-XXXXX-XXXXX', color: 'teal', action: 'Chat Now' },
        ].map(c => {
          const Icon = c.icon;
          return (
            <div key={c.label} className={`bg-${c.color}-50 border border-${c.color}-200 rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:bg-${c.color}-100 transition-colors`}>
              <div className={`w-10 h-10 bg-${c.color}-100 rounded-xl flex items-center justify-center`}>
                <Icon className={`w-5 h-5 text-${c.color}-600`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold text-${c.color}-900`}>{c.label}</p>
                <p className={`text-xs text-${c.color}-600 truncate`}>{c.sub}</p>
              </div>
              <ChevronRight className={`w-4 h-4 text-${c.color}-400`} />
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Tickets', value: tickets.length, color: 'blue' },
          { label: 'Open', value: openCount, color: 'amber' },
          { label: 'Resolved', value: tickets.filter(t => t.status === 'resolved').length, color: 'green' },
          { label: 'Avg Response', value: '4h', color: 'teal' },
        ].map(s => (
          <div key={s.label} className={`bg-${s.color}-50 border border-${s.color}-200 rounded-xl p-4 text-center`}>
            <p className={`text-2xl font-bold text-${s.color}-900`}>{s.value}</p>
            <p className={`text-xs text-${s.color}-600 font-medium mt-0.5`}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Ticket List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tickets..." className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(['all', 'open', 'in_progress', 'resolved'] as const).map(s => (
              <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors capitalize ${statusFilter === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {s.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {filtered.map(ticket => {
            const cfg = STATUS_CFG[ticket.status];
            const pCfg = PRIORITY_CFG[ticket.priority];
            const Icon = cfg.icon;
            return (
              <button key={ticket.id} onClick={() => setActive(ticket)} className="w-full flex items-start gap-4 px-5 py-4 hover:bg-gray-50 transition-colors text-left">
                <div className={`w-9 h-9 rounded-xl ${cfg.bg.split(' ')[0]} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <Icon className={`w-4 h-4 ${cfg.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="text-xs font-mono text-gray-400">{ticket.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                    <span className={`flex items-center gap-1 text-xs font-medium ${pCfg.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${pCfg.dot}`} />{ticket.priority}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-800 truncate">{ticket.subject}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{ticket.category} · Last updated {ticket.updatedAt} · {ticket.messages.length} messages</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0 mt-1" />
              </button>
            );
          })}
        </div>
        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <MessageSquare className="w-14 h-14 mx-auto mb-3 text-gray-200" />
            <p className="text-gray-500">No tickets found</p>
          </div>
        )}
      </div>

      {/* New Ticket Modal */}
      {showNew && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Raise a Support Ticket</h3>
              <button onClick={() => setShowNew(false)} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4 text-gray-500" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Subject *</label>
                <input value={newTicket.subject} onChange={e => setNewTicket(p => ({ ...p, subject: e.target.value }))} placeholder="Briefly describe your issue" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Category</label>
                  <select value={newTicket.category} onChange={e => setNewTicket(p => ({ ...p, category: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white">
                    <option value="">Select category</option>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Priority</label>
                  <select value={newTicket.priority} onChange={e => setNewTicket(p => ({ ...p, priority: e.target.value as TicketPriority }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Description *</label>
                <textarea value={newTicket.description} onChange={e => setNewTicket(p => ({ ...p, description: e.target.value }))} rows={4} placeholder="Describe your issue in detail..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 resize-none" />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowNew(false)} className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={submitTicket} disabled={!newTicket.subject || !newTicket.description} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> Submit Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Support;
