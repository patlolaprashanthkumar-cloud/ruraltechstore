import React, { useState } from 'react';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, RefreshCw, Download, Plus, Send, X, ChevronRight, CreditCard, CheckCircle, AlertCircle, Clock } from 'lucide-react';

type TxType = 'credit' | 'debit' | 'transfer';

interface Transaction {
  id: string; type: TxType; amount: number; description: string;
  date: string; status: 'success' | 'pending' | 'failed'; ref: string;
  balance: number;
}

const TRANSACTIONS: Transaction[] = [
  { id: '1', type: 'credit', amount: 5000, description: 'Commission credited - Passport Applications', date: '2024-06-28', status: 'success', ref: 'TXN-20240628-0012', balance: 12450 },
  { id: '2', type: 'debit', amount: 1200, description: 'Service fee - Aadhaar Update (12 applications)', date: '2024-06-27', status: 'success', ref: 'TXN-20240627-0089', balance: 7450 },
  { id: '3', type: 'credit', amount: 3200, description: 'Referral bonus - Q2 incentive', date: '2024-06-25', status: 'success', ref: 'TXN-20240625-0034', balance: 8650 },
  { id: '4', type: 'transfer', amount: 2000, description: 'Fund transfer to Rajesh Kumar (Retailer)', date: '2024-06-24', status: 'success', ref: 'TXN-20240624-0056', balance: 5450 },
  { id: '5', type: 'credit', amount: 1800, description: 'Commission - UPI Registration services', date: '2024-06-22', status: 'success', ref: 'TXN-20240622-0078', balance: 7450 },
  { id: '6', type: 'debit', amount: 500, description: 'Platform subscription fee - June', date: '2024-06-21', status: 'success', ref: 'TXN-20240621-0091', balance: 5650 },
  { id: '7', type: 'credit', amount: 750, description: 'Commission - Birth certificate services', date: '2024-06-20', status: 'pending', ref: 'TXN-20240620-0102', balance: 6150 },
  { id: '8', type: 'debit', amount: 300, description: 'SMS notification charges - June', date: '2024-06-18', status: 'success', ref: 'TXN-20240618-0114', balance: 5400 },
  { id: '9', type: 'credit', amount: 4500, description: 'Commission credited - Driving Licence batch', date: '2024-06-15', status: 'success', ref: 'TXN-20240615-0023', balance: 5700 },
  { id: '10', type: 'transfer', amount: 1000, description: 'Recharge - Priya Sharma account top-up', date: '2024-06-12', status: 'failed', ref: 'TXN-20240612-0135', balance: 1200 },
];

const TX_CFG: Record<TxType, { icon: React.FC<any>; color: string; bg: string; label: string }> = {
  credit: { icon: ArrowDownLeft, color: 'text-green-600', bg: 'bg-green-100', label: 'Credit' },
  debit: { icon: ArrowUpRight, color: 'text-red-500', bg: 'bg-red-100', label: 'Debit' },
  transfer: { icon: RefreshCw, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Transfer' },
};

const STATUS_CFG = {
  success: { icon: CheckCircle, color: 'text-green-600', label: 'Success' },
  pending: { icon: Clock, color: 'text-amber-500', label: 'Pending' },
  failed: { icon: AlertCircle, color: 'text-red-500', label: 'Failed' },
};

const QUICK_AMOUNTS = [500, 1000, 2000, 5000];

const Wallet: React.FC = () => {
  const [filter, setFilter] = useState<'all' | TxType>('all');
  const [showTopup, setShowTopup] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [topupAmt, setTopupAmt] = useState('');
  const [transferAmt, setTransferAmt] = useState('');
  const [transferTo, setTransferTo] = useState('');
  const [success, setSuccess] = useState('');

  const balance = 12450;
  const totalCredit = TRANSACTIONS.filter(t => t.type === 'credit' && t.status === 'success').reduce((s, t) => s + t.amount, 0);
  const totalDebit = TRANSACTIONS.filter(t => t.type === 'debit' && t.status === 'success').reduce((s, t) => s + t.amount, 0);
  const pending = TRANSACTIONS.filter(t => t.status === 'pending').length;

  const filtered = TRANSACTIONS.filter(t => filter === 'all' || t.type === filter);

  const exportStatement = () => {
    const rows = [['Date', 'Ref', 'Type', 'Description', 'Amount', 'Status', 'Balance']];
    TRANSACTIONS.forEach(t => rows.push([t.date, t.ref, t.type, t.description, (t.type === 'credit' ? '+' : '-') + t.amount, t.status, String(t.balance)]));
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'wallet-statement.csv';
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  const doAction = (msg: string) => {
    setSuccess(msg);
    setShowTopup(false); setShowTransfer(false);
    setTopupAmt(''); setTransferAmt(''); setTransferTo('');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Wallet</h2>
          <p className="text-gray-500 text-sm mt-0.5">Manage your balance, transactions and fund transfers</p>
        </div>
        <button onClick={exportStatement} className="flex items-center gap-2 px-3 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
          <Download className="w-4 h-4" /> Statement
        </button>
      </div>

      {/* Balance Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-teal-600 rounded-2xl p-6 text-white">
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/5 rounded-full" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <WalletIcon className="w-5 h-5 text-blue-200" />
            <p className="text-blue-200 text-sm font-medium">Available Balance</p>
          </div>
          <p className="text-4xl font-bold mb-1">₹{balance.toLocaleString('en-IN')}</p>
          <p className="text-blue-200 text-xs">Updated just now</p>
          <div className="flex gap-3 mt-5">
            <button onClick={() => setShowTopup(true)} className="flex items-center gap-2 px-4 py-2 bg-white text-blue-700 rounded-xl text-sm font-semibold hover:bg-blue-50 transition-colors">
              <Plus className="w-4 h-4" /> Add Money
            </button>
            <button onClick={() => setShowTransfer(true)} className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-sm font-semibold transition-colors">
              <Send className="w-4 h-4" /> Transfer
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Credits', value: `₹${(totalCredit / 1000).toFixed(1)}K`, icon: ArrowDownLeft, color: 'green' },
          { label: 'Total Debits', value: `₹${(totalDebit / 1000).toFixed(1)}K`, icon: ArrowUpRight, color: 'red' },
          { label: 'Transactions', value: TRANSACTIONS.length, icon: RefreshCw, color: 'blue' },
          { label: 'Pending', value: pending, icon: Clock, color: 'amber' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`bg-${s.color}-50 border border-${s.color}-200 rounded-xl p-4 flex items-center gap-3`}>
              <Icon className={`w-7 h-7 text-${s.color}-500`} />
              <div>
                <p className={`text-xl font-bold text-${s.color}-900`}>{s.value}</p>
                <p className={`text-xs text-${s.color}-600 font-medium`}>{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Transaction List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3 flex-wrap">
          <h3 className="font-bold text-gray-800">Transaction History</h3>
          <div className="flex gap-2">
            {(['all', 'credit', 'debit', 'transfer'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors capitalize ${filter === f ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {filtered.map(tx => {
            const cfg = TX_CFG[tx.type];
            const sCfg = STATUS_CFG[tx.status];
            const Icon = cfg.icon;
            const SIcon = sCfg.icon;
            return (
              <div key={tx.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${cfg.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{tx.description}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-400 font-mono">{tx.ref}</span>
                    <span className="text-gray-300">·</span>
                    <span className="text-xs text-gray-400">{new Date(tx.date).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-sm font-bold ${tx.type === 'credit' ? 'text-green-600' : 'text-red-500'}`}>
                    {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                  </p>
                  <div className={`flex items-center gap-1 justify-end mt-0.5 ${sCfg.color}`}>
                    <SIcon className="w-3 h-3" />
                    <span className="text-xs font-medium">{sCfg.label}</span>
                  </div>
                </div>
                <div className="text-right text-xs text-gray-400 min-w-0 flex-shrink-0 hidden sm:block">
                  <p>Bal: ₹{tx.balance.toLocaleString('en-IN')}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Success Toast */}
      {success && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-lg z-50 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-400" /> {success}
        </div>
      )}

      {/* Top-up Modal */}
      {showTopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Add Money to Wallet</h3>
              <button onClick={() => setShowTopup(false)} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4 text-gray-500" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Amount (₹)</label>
                <input value={topupAmt} onChange={e => setTopupAmt(e.target.value)} type="number" placeholder="Enter amount" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400" />
              </div>
              <div className="flex flex-wrap gap-2">
                {QUICK_AMOUNTS.map(a => (
                  <button key={a} onClick={() => setTopupAmt(String(a))} className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-colors ${topupAmt === String(a) ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                    ₹{a.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
              <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs font-semibold text-gray-700">Payment via UPI / Net Banking</p>
                  <p className="text-xs text-gray-400">Instant credit to wallet</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowTopup(false)} className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={() => doAction(`₹${parseInt(topupAmt || '0').toLocaleString('en-IN')} added to wallet!`)} disabled={!topupAmt || parseInt(topupAmt) < 1} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                  Add Money <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {showTransfer && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Transfer Funds</h3>
              <button onClick={() => setShowTransfer(false)} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4 text-gray-500" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Recipient (Mobile/ID)</label>
                <input value={transferTo} onChange={e => setTransferTo(e.target.value)} placeholder="Enter mobile or user ID" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Amount (₹)</label>
                <input value={transferAmt} onChange={e => setTransferAmt(e.target.value)} type="number" placeholder="Enter amount" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400" />
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
                Available balance: ₹{balance.toLocaleString('en-IN')}. Transfer is instant and cannot be reversed.
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowTransfer(false)} className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={() => doAction('Transfer initiated successfully!')} disabled={!transferTo || !transferAmt || parseInt(transferAmt) < 1} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> Transfer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;
