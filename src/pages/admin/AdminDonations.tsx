

import React, { useEffect, useState, useCallback } from 'react';
import { Search, Trash2, Eye, Download, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';

// ============================================================
// TYPES
// ============================================================

interface Donor {
  id: string;
  created_at: string;
  name: string;
  email: string;
  amount: number;
  currency: string;
  payment_method: string;
  donation_type: string;
  message: string | null;
  status: string;
  program: string | null;
}

// ============================================================
// COMPONENT
// ============================================================

const AdminDonations: React.FC = () => {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [filtered, setFiltered] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);

  // ============================================================
  // FETCH DONORS FROM SUPABASE
  // ============================================================
  const fetchDonors = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('donors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setDonors(data || []);
      setFiltered(data || []);
    } catch (err: any) {
      console.error('Error fetching donors:', err);
      toast.error('Failed to load donation records');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDonors();
  }, [fetchDonors]);

  // ============================================================
  // CLIENT-SIDE FILTERING
  // ============================================================
  useEffect(() => {
    let result = [...donors];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        d =>
          d.name.toLowerCase().includes(q) ||
          d.email.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter(d => d.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      result = result.filter(d => d.donation_type === typeFilter);
    }

    setFiltered(result);
  }, [donors, search, statusFilter, typeFilter]);

  // ============================================================
  // DELETE
  // ============================================================
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this donation record?')) return;

    try {
      setDeletingId(id);

      const { error } = await supabase
        .from('donors')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setDonors(prev => prev.filter(d => d.id !== id));
      toast.success('Donation record deleted');

      // Close modal if the deleted donor was selected
      if (selectedDonor?.id === id) setSelectedDonor(null);
    } catch (err: any) {
      console.error('Error deleting donor:', err);
      toast.error(err.message || 'Failed to delete donation record');
    } finally {
      setDeletingId(null);
    }
  };

  // ============================================================
  // COMPUTED STATS
  // ============================================================
  const totalAmount = donors.reduce((sum, d) => sum + (d.amount || 0), 0);
  const filteredAmount = filtered.reduce((sum, d) => sum + (d.amount || 0), 0);
  const recurringCount = donors.filter(d => d.donation_type === 'monthly' || d.donation_type === 'annual' || d.donation_type === 'quarterly').length;
  const oneTimeCount = donors.filter(d => d.donation_type === 'one-time').length;

  // ============================================================
  // EXPORT CSV
  // ============================================================
  const exportCSV = () => {
    if (filtered.length === 0) {
      toast.error('No data to export');
      return;
    }

    const headers = [
      'Name', 'Email', 'Amount', 'Currency', 'Type',
      'Program', 'Payment Method', 'Status', 'Date'
    ];

    const rows = filtered.map(d => [
      `"${d.name}"`,
      `"${d.email}"`,
      d.amount,
      d.currency,
      d.donation_type,
      `"${d.program || 'General'}"`,
      d.payment_method,
      d.status,
      format(new Date(d.created_at), 'yyyy-MM-dd'),
    ]);

    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `donations_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filtered.length} records successfully!`);
  };

  // ============================================================
  // STATUS & TYPE BADGE STYLES
  // ============================================================
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'pending':   return 'bg-yellow-100 text-yellow-700';
      case 'failed':    return 'bg-red-100 text-red-700';
      case 'refunded':  return 'bg-gray-100 text-gray-600';
      default:          return 'bg-gray-100 text-gray-600';
    }
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'one-time':   return 'bg-blue-100 text-blue-700';
      case 'monthly':    return 'bg-purple-100 text-purple-700';
      case 'quarterly':  return 'bg-indigo-100 text-indigo-700';
      case 'annual':     return 'bg-teal-100 text-teal-700';
      default:           return 'bg-gray-100 text-gray-600';
    }
  };

  // ============================================================
  // LOADING STATE
  // ============================================================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <Loader2 className="w-10 h-10 text-green-500 animate-spin mx-auto" />
          <p className="text-gray-500 text-sm">Loading donation records...</p>
        </div>
      </div>
    );
  }

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Donation Management</h1>
          <p className="text-gray-500 text-sm">
            {donors.length} total donors • ${totalAmount.toLocaleString()} raised
          </p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors text-sm"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Raised',
            value: `$${totalAmount.toLocaleString()}`,
            color: 'text-green-600',
          },
          {
            label: 'Showing (Filtered)',
            value: `$${filteredAmount.toLocaleString()}`,
            color: 'text-blue-600',
          },
          {
            label: 'Recurring',
            value: recurringCount.toString(),
            color: 'text-purple-600',
          },
          {
            label: 'One-Time',
            value: oneTimeCount.toString(),
            color: 'text-orange-600',
          },
        ].map(card => (
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
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-sm"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-sm"
        >
          <option value="all">All Types</option>
          <option value="one-time">One-Time</option>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="annual">Annual</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Donor', 'Amount', 'Type', 'Program', 'Payment', 'Status', 'Date', 'Actions'].map(h => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(donor => (
                <tr key={donor.id} className="hover:bg-gray-50 transition-colors">
                  {/* Donor Info */}
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-xs">
                        {donor.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{donor.name}</p>
                        <p className="text-gray-400 text-xs">{donor.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="px-4 py-3">
                    <span className="font-bold text-green-600">
                      ${donor.amount.toLocaleString()}
                    </span>
                    <span className="text-gray-400 text-xs ml-1 uppercase">
                      {donor.currency}
                    </span>
                  </td>

                  {/* Type */}
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeStyle(donor.donation_type)}`}>
                      {donor.donation_type}
                    </span>
                  </td>

                  {/* Program */}
                  <td className="px-4 py-3 text-gray-600 text-sm">
                    {donor.program || 'General'}
                  </td>

                  {/* Payment Method */}
                  <td className="px-4 py-3 text-gray-600 text-sm capitalize">
                    {donor.payment_method.replace(/_/g, ' ')}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusStyle(donor.status)}`}>
                      {donor.status}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {format(new Date(donor.created_at), 'MMM dd, yyyy')}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedDonor(donor)}
                        className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(donor.id)}
                        disabled={deletingId === donor.id}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        {deletingId === donor.id
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : <Trash2 className="w-4 h-4" />
                        }
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty State */}
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">💰</div>
              <p className="text-gray-500 font-medium">No donations found</p>
              <p className="text-gray-400 text-sm mt-1">
                {search || statusFilter !== 'all' || typeFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'No donation records yet'}
              </p>
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
              <button
                onClick={() => setSelectedDonor(null)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-0">
              {[
                { label: 'Donor Name',      value: selectedDonor.name },
                { label: 'Email',           value: selectedDonor.email },
                { label: 'Amount',          value: `$${selectedDonor.amount.toLocaleString()} ${selectedDonor.currency.toUpperCase()}` },
                { label: 'Donation Type',   value: selectedDonor.donation_type },
                { label: 'Program',         value: selectedDonor.program || 'General Fund' },
                { label: 'Payment Method',  value: selectedDonor.payment_method.replace(/_/g, ' ') },
                { label: 'Status',          value: selectedDonor.status },
                { label: 'Date',            value: format(new Date(selectedDonor.created_at), 'MMMM dd, yyyy HH:mm') },
                { label: 'Message',         value: selectedDonor.message || 'No message provided' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-2.5 border-b border-gray-100 last:border-0">
                  <span className="text-gray-500 text-sm">{label}</span>
                  <span className="font-medium text-gray-900 text-sm text-right max-w-[60%] capitalize">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setSelectedDonor(null)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => handleDelete(selectedDonor.id)}
                disabled={deletingId === selectedDonor.id}
                className="flex-1 py-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {deletingId === selectedDonor.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Record</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDonations;