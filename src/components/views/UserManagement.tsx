import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, CreditCard as Edit2, Trash2, CheckCircle, XCircle, Shield, Phone, Mail, MapPin, ChevronDown, ChevronUp, Download, Eye, TrendingUp, Users, UserCheck, UserX } from 'lucide-react';
import { User, UserRole, INDIAN_STATES } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

type ProfileRow = {
  id: string;
  email: string;
  name: string;
  role: string;
  is_active: boolean;
  created_at: string;
  wallet_balance: number | string;
  commission: number | string;
  parent_id: string | null;
  state: string | null;
  district: string | null;
  phone: string | null;
  address: string | null;
  kyc_status: string | null;
  certifications: string[] | null;
};

const mapRowToUser = (row: ProfileRow): User => ({
  id: row.id,
  email: row.email,
  name: row.name,
  role: row.role as UserRole,
  isActive: row.is_active,
  createdAt: row.created_at,
  walletBalance: Number(row.wallet_balance) || 0,
  commission: Number(row.commission) || 0,
  parentId: row.parent_id || undefined,
  state: row.state || undefined,
  district: row.district || undefined,
  phone: row.phone || undefined,
  address: row.address || undefined,
  kycStatus: row.kyc_status || 'pending',
  certifications: row.certifications || [],
});

const ROLE_BADGE: Record<UserRole, string> = {
  admin: 'bg-red-100 text-red-800 border border-red-200',
  sub_admin: 'bg-orange-100 text-orange-800 border border-orange-200',
  super_distributor: 'bg-blue-100 text-blue-800 border border-blue-200',
  distributor: 'bg-teal-100 text-teal-800 border border-teal-200',
  retailer: 'bg-green-100 text-green-800 border border-green-200',
};

const KYC_BADGE: Record<string, string> = {
  approved: 'bg-green-100 text-green-700 border border-green-200',
  pending: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  rejected: 'bg-red-100 text-red-700 border border-red-200',
};

const DEFAULT_COMMISSIONS: Record<UserRole, number> = {
  admin: 0, sub_admin: 0, super_distributor: 8, distributor: 5, retailer: 2.5,
};

interface AddEditModalProps {
  user: Partial<User> | null;
  onClose: () => void;
  onSave: (u: User) => void;
}

const AddEditModal: React.FC<AddEditModalProps> = ({ user, onClose, onSave }) => {
  const isEdit = !!user?.id;
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    role: (user?.role || 'retailer') as UserRole,
    state: user?.state || '',
    district: user?.district || '',
    walletBalance: user?.walletBalance ?? 0,
    isActive: user?.isActive ?? true,
    kycStatus: (user?.kycStatus || 'pending') as 'pending' | 'approved' | 'rejected',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(form.phone)) e.phone = '10-digit number required';
    if (!form.state) e.state = 'State is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({
      id: user?.id || String(Date.now()),
      ...form,
      commission: DEFAULT_COMMISSIONS[form.role],
      createdAt: user?.createdAt || new Date().toISOString().split('T')[0],
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 px-6 py-4 text-white">
          <h3 className="text-lg font-bold">{isEdit ? 'Edit User' : 'Add New User'}</h3>
          <p className="text-blue-100 text-sm mt-0.5">{isEdit ? 'Update user information' : 'Create a new portal user'}</p>
        </div>
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Full Name *</label>
              <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-400' : 'border-gray-300'}`}
                placeholder="Enter full name" />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Email *</label>
              <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-400' : 'border-gray-300'}`}
                placeholder="user@example.com" />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Phone *</label>
              <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-400' : 'border-gray-300'}`}
                placeholder="10-digit number" />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Role *</label>
              <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value as UserRole }))}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                <option value="sub_admin">Sub Admin</option>
                <option value="super_distributor">Super Distributor</option>
                <option value="distributor">Distributor</option>
                <option value="retailer">Retailer</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">KYC Status</label>
              <select value={form.kycStatus} onChange={e => setForm(p => ({ ...p, kycStatus: e.target.value as 'pending' | 'approved' | 'rejected' }))}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">State *</label>
              <select value={form.state} onChange={e => setForm(p => ({ ...p, state: e.target.value }))}
                className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 ${errors.state ? 'border-red-400' : 'border-gray-300'}`}>
                <option value="">Select State</option>
                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">District</label>
              <input value={form.district} onChange={e => setForm(p => ({ ...p, district: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                placeholder="Enter district" />
            </div>
            {isEdit && (
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Wallet Balance (₹)</label>
                <input type="number" value={form.walletBalance} onChange={e => setForm(p => ({ ...p, walletBalance: Number(e.target.value) }))}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
              </div>
            )}
            <div className="flex items-center gap-2 pt-1">
              <button onClick={() => setForm(p => ({ ...p, isActive: !p.isActive }))}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${form.isActive ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <span className="inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform"
                  style={{ transform: form.isActive ? 'translateX(18px)' : 'translateX(2px)' }} />
              </button>
              <span className="text-sm text-gray-700">{form.isActive ? 'Active' : 'Inactive'}</span>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-100 transition-colors">Cancel</button>
          <button onClick={handleSave} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors">
            {isEdit ? 'Save Changes' : 'Create User'}
          </button>
        </div>
      </div>
    </div>
  );
};

const UserManagement: React.FC = () => {
  const { user: authUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [, setLoadingUsers] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterKyc, setFilterKyc] = useState('all');
  const [sortField, setSortField] = useState<'name' | 'createdAt' | 'walletBalance'>('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editUser, setEditUser] = useState<User | null | 'new'>('new');
  const [showModal, setShowModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const isAdmin = authUser?.role === 'admin' || authUser?.role === 'sub_admin';

  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) {
      setUsers(data.map(mapRowToUser));
    }
    setLoadingUsers(false);
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const filtered = users
    .filter(u => {
      const q = search.toLowerCase();
      const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.phone || '').includes(q) || (u.district || '').toLowerCase().includes(q);
      const matchRole = filterRole === 'all' || u.role === filterRole;
      const matchStatus = filterStatus === 'all' || (filterStatus === 'active' ? u.isActive : !u.isActive);
      const matchKyc = filterKyc === 'all' || u.kycStatus === filterKyc;
      return matchSearch && matchRole && matchStatus && matchKyc;
    })
    .sort((a, b) => {
      let av: number | string = a[sortField] ?? '';
      let bv: number | string = b[sortField] ?? '';
      if (typeof av === 'string') av = av.toLowerCase();
      if (typeof bv === 'string') bv = bv.toLowerCase();
      return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => { const s = new Set(prev); if (s.has(id)) s.delete(id); else s.add(id); return s; });
  };

  const toggleAll = () => {
    setSelectedIds(prev => prev.size === filtered.length ? new Set() : new Set(filtered.map(u => u.id)));
  };

  const handleSave = async (u: User) => {
    const payload: Record<string, unknown> = {
      email: u.email,
      name: u.name,
      role: u.role,
      is_active: u.isActive,
      wallet_balance: u.walletBalance ?? 0,
      commission: u.commission ?? 0,
      state: u.state || null,
      district: u.district || null,
      phone: u.phone || null,
      kyc_status: u.kycStatus || 'pending',
    };

    if (u.parentId) payload.parent_id = u.parentId;

    const { data, error } = await supabase
      .from('profiles')
      .upsert({ id: u.id, ...payload }, { onConflict: 'id' })
      .select()
      .maybeSingle();

    if (!error && data) {
      setUsers(prev => {
        const exists = prev.find(x => x.id === data.id);
        return exists ? prev.map(x => x.id === data.id ? mapRowToUser(data) : x) : [mapRowToUser(data), ...prev];
      });
    }
    setShowModal(false);
    fetchUsers();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user?')) return;
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (!error) setUsers(prev => prev.filter(u => u.id !== id));
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedIds.size} selected users?`)) return;
    const { error } = await supabase.from('profiles').delete().in('id', Array.from(selectedIds));
    if (!error) {
      setUsers(prev => prev.filter(u => !selectedIds.has(u.id)));
      setSelectedIds(new Set());
    }
  };

  const toggleActive = async (id: string) => {
    const target = users.find(u => u.id === id);
    if (!target) return;
    const newVal = !target.isActive;
    setUsers(prev => prev.map(u => u.id === id ? { ...u, isActive: newVal } : u));
    await supabase.from('profiles').update({ is_active: newVal }).eq('id', id);
  };
  const updateKyc = async (id: string, status: 'approved' | 'rejected') => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, kycStatus: status } : u));
    await supabase.from('profiles').update({ kyc_status: status }).eq('id', id);
  };

  const exportCSV = () => {
    const csv = ['Name,Email,Phone,Role,State,District,Wallet,KYC,Status,Joined',
      ...filtered.map(u => `"${u.name}",${u.email},${u.phone || ''},${u.role},${u.state || ''},${u.district || ''},${u.walletBalance ?? 0},${u.kycStatus || 'pending'},${u.isActive ? 'Active' : 'Inactive'},${u.createdAt}`)
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'users.csv';
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  const stats = [
    { label: 'Total Users', value: users.length, icon: Users, color: 'blue' },
    { label: 'Active', value: users.filter(u => u.isActive).length, icon: UserCheck, color: 'green' },
    { label: 'Inactive', value: users.filter(u => !u.isActive).length, icon: UserX, color: 'red' },
    { label: 'Pending KYC', value: users.filter(u => u.kycStatus === 'pending').length, icon: Shield, color: 'yellow' },
  ];

  const SortIcon = ({ field }: { field: typeof sortField }) => (
    <span className="ml-1 inline-flex flex-col">
      {sortField === field ? (sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />) : <ChevronDown className="w-3 h-3 opacity-30" />}
    </span>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-500 text-sm mt-0.5">Manage all portal users and their permissions</p>
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            <button onClick={exportCSV} className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" /> Export
            </button>
            <button onClick={() => { setEditUser(null); setShowModal(true); }} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors">
              <Plus className="w-4 h-4" /> Add User
            </button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`bg-${s.color}-50 border border-${s.color}-200 rounded-xl p-4 flex items-center gap-3`}>
              <div className={`w-10 h-10 bg-${s.color}-100 rounded-xl flex items-center justify-center`}>
                <Icon className={`w-5 h-5 text-${s.color}-600`} />
              </div>
              <div>
                <p className={`text-2xl font-bold text-${s.color}-900`}>{s.value}</p>
                <p className={`text-xs text-${s.color}-600 font-medium`}>{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-48 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search name, email, phone, district..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
          </div>
          <select value={filterRole} onChange={e => setFilterRole(e.target.value)} className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white">
            <option value="all">All Roles</option>
            <option value="sub_admin">Sub Admin</option>
            <option value="super_distributor">Super Distributor</option>
            <option value="distributor">Distributor</option>
            <option value="retailer">Retailer</option>
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <select value={filterKyc} onChange={e => setFilterKyc(e.target.value)} className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white">
            <option value="all">All KYC</option>
            <option value="approved">KYC Approved</option>
            <option value="pending">KYC Pending</option>
            <option value="rejected">KYC Rejected</option>
          </select>
        </div>
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
            <span className="text-sm text-blue-800 font-medium">{selectedIds.size} selected</span>
            <button onClick={handleBulkDelete} className="text-xs text-red-600 hover:text-red-700 font-semibold ml-auto">Delete Selected</button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left w-10">
                  <input type="checkbox" checked={selectedIds.size === filtered.length && filtered.length > 0} onChange={toggleAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                </th>
                <th className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => toggleSort('name')}>
                  <span className="flex items-center text-xs font-semibold text-gray-600 uppercase tracking-wider">User <SortIcon field="name" /></span>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">Location</th>
                <th className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100 transition-colors hidden lg:table-cell" onClick={() => toggleSort('walletBalance')}>
                  <span className="flex items-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Wallet <SortIcon field="walletBalance" /></span>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">KYC</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(u => (
                <React.Fragment key={u.id}>
                  <tr className={`hover:bg-gray-50/60 transition-colors ${selectedIds.has(u.id) ? 'bg-blue-50/40' : ''}`}>
                    <td className="px-4 py-3.5">
                      <input type="checkbox" checked={selectedIds.has(u.id)} onChange={() => toggleSelect(u.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{u.name}</p>
                          <p className="text-xs text-gray-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${ROLE_BADGE[u.role]}`}>
                        {u.role.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        {u.district || '—'}, {u.state || '—'}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      {u.walletBalance !== undefined ? (
                        <span className="text-sm font-bold text-gray-800">₹{u.walletBalance.toLocaleString('en-IN')}</span>
                      ) : <span className="text-gray-400 text-xs">—</span>}
                    </td>
                    <td className="px-4 py-3.5">
                      {isAdmin ? (
                        <select value={u.kycStatus || 'pending'} onChange={e => updateKyc(u.id, e.target.value as 'approved' | 'rejected')}
                          className={`text-xs px-2 py-1 rounded-full font-semibold border appearance-none cursor-pointer ${KYC_BADGE[u.kycStatus || 'pending']}`}>
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      ) : (
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${KYC_BADGE[u.kycStatus || 'pending']}`}>{u.kycStatus || 'pending'}</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <button onClick={() => toggleActive(u.id)}
                        className={`flex items-center gap-1.5 text-xs font-semibold ${u.isActive ? 'text-green-600' : 'text-red-500'}`}>
                        {u.isActive ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        {u.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setExpandedId(expandedId === u.id ? null : u.id)}
                          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Details">
                          <Eye className="w-4 h-4" />
                        </button>
                        {isAdmin && (
                          <>
                            <button onClick={() => { setEditUser(u); setShowModal(true); }}
                              className="p-1.5 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(u.id)}
                              className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                  {expandedId === u.id && (
                    <tr className="bg-blue-50/30">
                      <td colSpan={8} className="px-6 py-4">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                          <div className="bg-white rounded-lg p-3 border border-gray-100">
                            <p className="text-xs text-gray-500 flex items-center gap-1"><Phone className="w-3 h-3" /> Phone</p>
                            <p className="font-semibold text-gray-800 mt-0.5">{u.phone || '—'}</p>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-gray-100">
                            <p className="text-xs text-gray-500 flex items-center gap-1"><Mail className="w-3 h-3" /> Email</p>
                            <p className="font-semibold text-gray-800 mt-0.5 truncate">{u.email}</p>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-gray-100">
                            <p className="text-xs text-gray-500 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Commission</p>
                            <p className="font-semibold text-gray-800 mt-0.5">{u.commission !== undefined ? `${u.commission}%` : '—'}</p>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-gray-100">
                            <p className="text-xs text-gray-500">Member Since</p>
                            <p className="font-semibold text-gray-800 mt-0.5">{new Date(u.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <Users className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">No users match your filters</p>
          </div>
        )}
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-sm text-gray-500">
          <span>Showing <strong className="text-gray-700">{filtered.length}</strong> of <strong className="text-gray-700">{users.length}</strong> users</span>
          <span className="hidden sm:block">Click a row's <Eye className="w-3.5 h-3.5 inline" /> to expand details</span>
        </div>
      </div>

      {showModal && (
        <AddEditModal user={editUser === 'new' ? null : editUser} onClose={() => setShowModal(false)} onSave={handleSave} />
      )}
    </div>
  );
};

export default UserManagement;
