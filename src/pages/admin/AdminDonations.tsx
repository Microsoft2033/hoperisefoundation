import React, { useEffect, useState } from 'react';
import { Search, Trash2, Eye, Download } from 'lucide-react';
import { db, Donor } from '../../lib/mockDb';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const AdminDonations: React.FC = () => {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [filtered, setFiltered] = useState<Donor[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);

  useEffect(() => {
    const data = db.donors.getAll();
    setDonors(data);
    setFiltered(data);
  }, []);

  useEffect(() => {
    let result = donors;
    if (search) result = result.filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.email.toLowerCase().includes(search.toLowerCase()));
    if (statusFilter !== 'all') result = result.filter(d => d.status === statusFilter);
    if (typeFilter !== 'all') result = result.filter(d => d.donation_type === typeFilter);
    setFiltered(result);
  }, [donors, search, statusFilter, typeFilter]);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this donation record?')) {
      db.donors.delete(id);
      const updated = db.donors.getAll();
      setDonors(updated);
      toast.success('Donation record deleted');
    }
  };

  const totalAmount = filtered.reduce((sum, d) => sum + d.amount, 0);

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Amount', 'Type', 'Program', 'Payment Method', 'Status', 'Date'];
    const rows = filtered.map(d => [d.name, d.email, d.amount, d.donation_type, d.program || 'General', d.payment_method, d.status, format(new Date(d.created_at), 'yyyy-MM-dd')]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'donations.csv'; a.click();
    toast.success('CSV exported successfully!');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Donation Management</h1>
          <p className="text-gray-500 text-sm">{donors.length} total donors • ${db.donors.getTotalAmount().toLocaleString()} raised</p>
        </div>
        <button onClick={exportCSV} className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors text-sm">
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Raised', value: `$${db.donors.getTotalAmount().toLocaleString()}`, color: 'text-green-600' },
          { label: 'Showing', value: `$${totalAmount.toLocaleString()}`, color: 'text-blue-600' },
          { label: 'Recurring', value: donors.filter(d => d.donation_type === 'recurring').length.toString(), color: 'text-purple-600' },
          { label: 'One-Time', value: donors.filter(d => d.donation_type === 'one-time').length.toString(), color: 'text-orange-600' },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
            <div className="text-gray-500 text-xs mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-sm" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-sm">
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-sm">
          <option value="all">All Types</option>
          <option value="one-time">One-Time</option>
          <option value="recurring">Recurring</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Donor', 'Amount', 'Type', 'Program', 'Payment', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((donor) => (
                <tr key={donor.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-xs">{donor.name.charAt(0)}</div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{donor.name}</p>
                        <p className="text-gray-400 text-xs">{donor.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className="font-bold text-green-600">${donor.amount.toLocaleString()}</span></td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${donor.donation_type === 'recurring' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{donor.donation_type}</span></td>
                  <td className="px-4 py-3 text-gray-600 text-sm">{donor.program || 'General'}</td>
                  <td className="px-4 py-3 text-gray-600 text-sm capitalize">{donor.payment_method.replace('_', ' ')}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${donor.status === 'completed' ? 'bg-green-100 text-green-700' : donor.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{donor.status}</span></td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{format(new Date(donor.created_at), 'MMM dd, yyyy')}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <button onClick={() => setSelectedDonor(donor)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(donor.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">💰</div>
              <p className="text-gray-500">No donations found</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedDonor && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Donation Details</h2>
              <button onClick={() => setSelectedDonor(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Donor Name', value: selectedDonor.name },
                { label: 'Email', value: selectedDonor.email },
                { label: 'Amount', value: `$${selectedDonor.amount.toLocaleString()} USD` },
                { label: 'Type', value: selectedDonor.donation_type },
                { label: 'Program', value: selectedDonor.program || 'General Fund' },
                { label: 'Payment Method', value: selectedDonor.payment_method.replace('_', ' ') },
                { label: 'Status', value: selectedDonor.status },
                { label: 'Date', value: format(new Date(selectedDonor.created_at), 'MMMM dd, yyyy HH:mm') },
                { label: 'Message', value: selectedDonor.message || 'No message' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="text-gray-500 text-sm">{label}</span>
                  <span className="font-medium text-gray-900 text-sm text-right max-w-[60%]">{value}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setSelectedDonor(null)} className="mt-6 w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDonations;
