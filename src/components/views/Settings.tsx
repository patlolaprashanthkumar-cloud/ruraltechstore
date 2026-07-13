import React, { useState } from 'react';
import { User, Bell, Lock, Smartphone, Globe, Shield, LogOut, ChevronRight, Check, Eye, EyeOff, Camera, Save, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

type Tab = 'profile' | 'notifications' | 'security' | 'preferences' | 'account';

const TABS: { id: Tab; label: string; icon: React.FC<any> }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'preferences', label: 'Preferences', icon: Globe },
  { id: 'account', label: 'Account', icon: Shield },
];

const LANGUAGES = ['English', 'Hindi', 'Marathi', 'Tamil', 'Telugu', 'Kannada', 'Bengali', 'Gujarati'];

const Settings: React.FC = () => {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState<Tab>('profile');
  const [saved, setSaved] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.name || '', email: user?.email || '',
    phone: '9876543210', location: 'Maharashtra', bio: 'Rural services facilitator helping local communities.',
    language: 'English',
  });

  const [notifs, setNotifs] = useState({
    appUpdates: true, commissions: true, newUsers: false, systemAlerts: true,
    weeklyReport: true, marketingEmails: false, smsAlerts: true, whatsappAlerts: false,
  });

  const [pwd, setPwd] = useState({ current: '', newPwd: '', confirm: '' });
  const [pwdError, setPwdError] = useState('');

  const [prefs, setPrefs] = useState({
    language: 'English', theme: 'light', dateFormat: 'DD/MM/YYYY',
    currency: 'INR', compactMode: false, showTutorials: true,
  });

  const save = (msg: string) => {
    setSaved(msg);
    setTimeout(() => setSaved(''), 3000);
  };

  const handlePwdChange = () => {
    if (!pwd.current) { setPwdError('Enter your current password'); return; }
    if (pwd.newPwd.length < 8) { setPwdError('New password must be at least 8 characters'); return; }
    if (pwd.newPwd !== pwd.confirm) { setPwdError('Passwords do not match'); return; }
    setPwdError('');
    setPwd({ current: '', newPwd: '', confirm: '' });
    save('Password changed successfully!');
  };

  const ToggleSwitch = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button onClick={onChange} className={`relative w-11 h-6 rounded-full transition-colors ${value ? 'bg-blue-600' : 'bg-gray-200'}`}>
      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${value ? 'left-6' : 'left-1'}`} />
    </button>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-500 text-sm mt-0.5">Manage your account, preferences and security</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-5">
        {/* Sidebar Nav */}
        <div className="sm:w-52 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {TABS.map(t => {
              const Icon = t.icon;
              return (
                <button key={t.id} onClick={() => setTab(t.id)} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors text-left ${tab === t.id ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50 border-r-2 border-transparent'}`}>
                  <Icon className={`w-4 h-4 ${tab === t.id ? 'text-blue-600' : 'text-gray-400'}`} />
                  {t.label}
                </button>
              );
            })}
            <div className="border-t border-gray-100">
              <button onClick={() => setShowLogoutConfirm(true)} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-left">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Profile Tab */}
          {tab === 'profile' && (
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white text-2xl font-bold">
                    {profile.name.charAt(0)}
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center shadow-md hover:bg-blue-700 transition-colors">
                    <Camera className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
                <div>
                  <p className="font-bold text-gray-900">{profile.name}</p>
                  <p className="text-sm text-gray-500 capitalize">{user?.role?.replace('_', ' ')}</p>
                  <p className="text-xs text-blue-600 font-medium mt-0.5">ID: {user?.id || 'USR-001'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name</label>
                  <input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address</label>
                  <input value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} type="email" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number</label>
                  <input value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Location / State</label>
                  <select value={profile.location} onChange={e => setProfile(p => ({ ...p, location: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white">
                    {['Maharashtra', 'Gujarat', 'Rajasthan', 'Uttar Pradesh', 'Bihar', 'Madhya Pradesh', 'Punjab', 'Haryana'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Bio</label>
                <textarea value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} rows={2} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 resize-none" />
              </div>
              <button onClick={() => save('Profile updated successfully!')} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors">
                <Save className="w-4 h-4" /> Save Profile
              </button>
            </div>
          )}

          {/* Notifications Tab */}
          {tab === 'notifications' && (
            <div className="p-6 space-y-5">
              <p className="text-sm text-gray-500">Choose what notifications you want to receive.</p>
              <div className="space-y-1">
                {[
                  { key: 'appUpdates', label: 'Application Updates', sub: 'When an application status changes' },
                  { key: 'commissions', label: 'Commission Credits', sub: 'When a commission is added to your wallet' },
                  { key: 'newUsers', label: 'New User Registrations', sub: 'When a new user is added under you' },
                  { key: 'systemAlerts', label: 'System Alerts', sub: 'Maintenance, downtime, and critical updates' },
                  { key: 'weeklyReport', label: 'Weekly Reports', sub: 'Summary of your weekly activity' },
                  { key: 'marketingEmails', label: 'Promotional Emails', sub: 'Offers, schemes, and announcements' },
                ].map(n => (
                  <div key={n.key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{n.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{n.sub}</p>
                    </div>
                    <ToggleSwitch value={notifs[n.key as keyof typeof notifs]} onChange={() => setNotifs(p => ({ ...p, [n.key]: !p[n.key as keyof typeof notifs] }))} />
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-4">
                <p className="text-sm font-semibold text-gray-700 mb-3">Channel Preferences</p>
                {[
                  { key: 'smsAlerts', label: 'SMS Alerts', sub: 'Receive alerts via SMS' },
                  { key: 'whatsappAlerts', label: 'WhatsApp Notifications', sub: 'Receive updates on WhatsApp' },
                ].map(n => (
                  <div key={n.key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{n.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{n.sub}</p>
                    </div>
                    <ToggleSwitch value={notifs[n.key as keyof typeof notifs]} onChange={() => setNotifs(p => ({ ...p, [n.key]: !p[n.key as keyof typeof notifs] }))} />
                  </div>
                ))}
              </div>
              <button onClick={() => save('Notification preferences saved!')} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors">
                <Save className="w-4 h-4" /> Save Preferences
              </button>
            </div>
          )}

          {/* Security Tab */}
          {tab === 'security' && (
            <div className="p-6 space-y-5">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-green-800">Account Secure</p>
                  <p className="text-xs text-green-600 mt-0.5">Last login: Today at 9:45 AM from Maharashtra</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-800 mb-3">Change Password</h4>
                <div className="space-y-3">
                  {[
                    { label: 'Current Password', key: 'current' as const, show: showPwd, toggle: () => setShowPwd(v => !v) },
                    { label: 'New Password', key: 'newPwd' as const, show: showNewPwd, toggle: () => setShowNewPwd(v => !v) },
                    { label: 'Confirm New Password', key: 'confirm' as const, show: showConfirmPwd, toggle: () => setShowConfirmPwd(v => !v) },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">{f.label}</label>
                      <div className="relative">
                        <input value={pwd[f.key]} onChange={e => setPwd(p => ({ ...p, [f.key]: e.target.value }))} type={f.show ? 'text' : 'password'} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400" />
                        <button type="button" onClick={f.toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {f.show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  ))}
                  {pwdError && <p className="text-xs text-red-600 font-medium">{pwdError}</p>}
                  <button onClick={handlePwdChange} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors">
                    <Lock className="w-4 h-4" /> Update Password
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <h4 className="text-sm font-bold text-gray-800 mb-3">Login Sessions</h4>
                {[
                  { device: 'Chrome on Windows', location: 'Maharashtra, India', time: 'Active now', current: true },
                  { device: 'Mobile App (Android)', location: 'Maharashtra, India', time: '2 days ago', current: false },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-3">
                      <Smartphone className={`w-5 h-5 ${s.current ? 'text-green-500' : 'text-gray-400'}`} />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{s.device}</p>
                        <p className="text-xs text-gray-400">{s.location} · {s.time}</p>
                      </div>
                    </div>
                    {s.current ? <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold border border-green-200">Current</span> : <button className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors">Revoke</button>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {tab === 'preferences' && (
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Interface Language</label>
                  <select value={prefs.language} onChange={e => setPrefs(p => ({ ...p, language: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white">
                    {LANGUAGES.map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Theme</label>
                  <div className="flex gap-2">
                    {['light', 'dark', 'auto'].map(t => (
                      <button key={t} onClick={() => setPrefs(p => ({ ...p, theme: t }))} className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-colors capitalize ${prefs.theme === t ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{t}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Date Format</label>
                  <select value={prefs.dateFormat} onChange={e => setPrefs(p => ({ ...p, dateFormat: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white">
                    {['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'].map(f => <option key={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Currency Display</label>
                  <select value={prefs.currency} onChange={e => setPrefs(p => ({ ...p, currency: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white">
                    {['INR (₹)', 'USD ($)', 'EUR (€)'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-1 border-t border-gray-100 pt-4">
                {[
                  { key: 'compactMode', label: 'Compact Mode', sub: 'Reduce spacing and padding throughout the app' },
                  { key: 'showTutorials', label: 'Show Tutorials', sub: 'Display onboarding tips and feature guides' },
                ].map(n => (
                  <div key={n.key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{n.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{n.sub}</p>
                    </div>
                    <button onClick={() => setPrefs(p => ({ ...p, [n.key]: !p[n.key as keyof typeof prefs] }))} className={`relative w-11 h-6 rounded-full transition-colors ${prefs[n.key as keyof typeof prefs] ? 'bg-blue-600' : 'bg-gray-200'}`}>
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${prefs[n.key as keyof typeof prefs] ? 'left-6' : 'left-1'}`} />
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={() => save('Preferences saved!')} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors">
                <Save className="w-4 h-4" /> Save Preferences
              </button>
            </div>
          )}

          {/* Account Tab */}
          {tab === 'account' && (
            <div className="p-6 space-y-5">
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                {[
                  { label: 'Account ID', value: user?.id || 'USR-001' },
                  { label: 'Role', value: user?.role?.replace('_', ' ') || 'retailer', capitalize: true },
                  { label: 'KYC Status', value: user?.kycStatus || 'verified', capitalize: true },
                  { label: 'Member Since', value: 'March 2024' },
                  { label: 'Last Login', value: 'Today, 9:45 AM' },
                ].map(f => (
                  <div key={f.label} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{f.label}</span>
                    <span className={`text-sm font-semibold text-gray-800 ${f.capitalize ? 'capitalize' : ''}`}>{f.value}</span>
                  </div>
                ))}
              </div>
              <div className="border border-red-200 rounded-xl overflow-hidden">
                <div className="bg-red-50 px-4 py-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <p className="text-sm font-bold text-red-700">Danger Zone</p>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Deactivate Account</p>
                      <p className="text-xs text-gray-400">Temporarily disable your account</p>
                    </div>
                    <button className="px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 rounded-xl text-xs font-semibold transition-colors">Deactivate</button>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Delete Account</p>
                      <p className="text-xs text-gray-400">Permanently remove all your data</p>
                    </div>
                    <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition-colors">Delete</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Success Toast */}
      {saved && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-lg z-50 flex items-center gap-2">
          <Check className="w-4 h-4 text-green-400" /> {saved}
        </div>
      )}

      {/* Logout Confirm */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogOut className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Sign Out?</h3>
            <p className="text-sm text-gray-500 mb-5">You will be signed out of your account and redirected to the login page.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={logout} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-colors">Sign Out</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
