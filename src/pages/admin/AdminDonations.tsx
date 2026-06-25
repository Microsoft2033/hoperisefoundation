import React, { useEffect, useState, useCallback } from 'react';
import {
  Search, Trash2, Eye, Download, Loader2,
  CheckCircle, XCircle, RotateCcw
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';

// ============================================================
// TYPES
// ============================================================

type DonationStatus = 'pending' | 'completed' | 'failed' | 'refunded';

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
  status: DonationStatus;
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
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);

  // ============================================================
  // FETCH DONORS
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
  // UPDATE STATUS (Approve / Reject / Refund / Reset)
  // ============================================================
  const updateStatus = async (
    id: string,
    newStatus: DonationStatus,
    actionLabel: string
  ) => {
    const donor = donors.find(d => d.id === id);
    if (!donor) return;

    // Confirmation message based on action
    const confirmMessages: Record<DonationStatus, string> = {
      completed: `Approve this $${donor.amount.toLocaleString()} donation from ${donor.name}?`,
      failed:    `Reject this donation from ${donor.name}? This will mark it as failed.`,
      refunded:  `Mark this donation as refunded? This indicates the money was returned to the donor.`,
      pending:   `Reset this donation back to pending?`,
    };

    if (!window.confirm(confirmMessages[newStatus])) return;

    try {
      setUpdatingId(id);

      const { error } = await supabase
        .from('donors')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      // Update local state without refetching
      setDonors(prev =>
        prev.map(d => d.id === id ? { ...d, status: newStatus } : d)
      );

      // Sync modal if open
      if (selectedDonor?.id === id) {
        setSelectedDonor(prev => prev ? { ...prev, status: newStatus } : null);
      }

      toast.success(`Donation ${actionLabel}!`);
    } catch (err: any) {
      console.error('Error updating donation status:', err);
      toast.error(err.message || `Failed to ${actionLabel.toLowerCase()} donation`);
    } finally {
      setUpdatingId(null);
    }
  };

  // ============================================================
  // DELETE
  // ============================================================
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this donation record? This cannot be undone.')) return;

    try {
      setDeletingId(id);

      const { error } = await supabase
        .from('donors')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setDonors(prev => prev.filter(d => d.id !== id));
      toast.success('Donation record deleted');

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
  const completedDonations = donors.filter(d => d.status === 'completed');
  const totalAmount = completedDonations.reduce((sum, d) => sum + (d.amount || 0), 0);
  const filteredAmount = filtered
    .filter(d => d.status === 'completed')
    .reduce((sum, d) => sum + (d.amount || 0), 0);
  const pendingCount = donors.filter(d => d.status === 'pending').length;
  const failedCount  = donors.filter(d => d.status === 'failed').length;

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
  // STYLE HELPERS
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
            {donors.length} total • ${totalAmount.toLocaleString()} raised •{' '}
            <span className="text-yellow-600 font-medium">{pendingCount} pending review</span>
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

      {/* Summary Cards — clickable filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Raised', value: `$${totalAmount.toLocaleString()}`, color: 'text-green-600', filterValue: 'all' },
          { label: 'Pending',      value: pendingCount.toString(),             color: 'text-yellow-600', filterValue: 'pending' },
          { label: 'Completed',    value: completedDonations.length.toString(), color: 'text-blue-600',   filterValue: 'completed' },
          { label: 'Failed',       value: failedCount.toString(),              color: 'text-red-600',    filterValue: 'failed' },
        ].map(card => (
          <button
            key={card.label}
            onClick={() => setStatusFilter(card.filterValue === statusFilter ? 'all' : card.filterValue)}
            className={`bg-white rounded-xl p-4 shadow-sm border-2 text-left transition-all ${
              statusFilter === card.filterValue && card.filterValue !== 'all'
                ? 'border-current shadow-md'
                : 'border-gray-100 hover:border-gray-200'
            }`}
          >
            <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
            <div className="text-gray-500 text-xs mt-1">{card.label}</div>
          </button>
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
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
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

      {/* Showing count when filtering */}
      {(search || statusFilter !== 'all' || typeFilter !== 'all') && (
        <p className="text-sm text-gray-500">
          Showing{' '}
          <span className="font-semibold text-gray-700">{filtered.length}</span> of{' '}
          <span className="font-semibold text-gray-700">{donors.length}</span> donations
          {' • '}
          <span className="font-semibold text-blue-600">
            ${filteredAmount.toLocaleString()}
          </span>{' '}
          completed amount
        </p>
      )}

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
              {filtered.map(donor => {
                const isUpdating = updatingId === donor.id;
                const isDeleting = deletingId === donor.id;
                const isProcessing = isUpdating || isDeleting;

                return (
                  <tr
                    key={donor.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      isProcessing ? 'opacity-60' : ''
                    }`}
                  >
                    {/* Donor Info */}
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-xs flex-shrink-0">
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
                      <div className="flex items-center space-x-1">
                        {/* View */}
                        <button
                          onClick={() => setSelectedDonor(donor)}
                          className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Approve — show only if pending or failed */}
                        {(donor.status === 'pending' || donor.status === 'failed') && (
                          <button
                            onClick={() => updateStatus(donor.id, 'completed', 'approved')}
                            disabled={isProcessing}
                            className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Approve donation"
                          >
                            {isUpdating
                              ? <Loader2 className="w-4 h-4 animate-spin" />
                              : <CheckCircle className="w-4 h-4" />
                            }
                          </button>
                        )}

                        {/* Reject — show only if pending */}
                        {donor.status === 'pending' && (
                          <button
                            onClick={() => updateStatus(donor.id, 'failed', 'rejected')}
                            disabled={isProcessing}
                            className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Reject donation"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}

                        {/* Refund — show only if completed */}
                        {donor.status === 'completed' && (
                          <button
                            onClick={() => updateStatus(donor.id, 'refunded', 'refunded')}
                            disabled={isProcessing}
                            className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                            title="Mark as refunded"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        )}

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(donor.id)}
                          disabled={isProcessing}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          {isDeleting
                            ? <Loader2 className="w-4 h-4 animate-spin" />
                            : <Trash2 className="w-4 h-4" />
                          }
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
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
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Donation Details</h2>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                  getStatusStyle(selectedDonor.status)
                }`}>
                  {selectedDonor.status}
                </span>
              </div>
              <button
                onClick={() => setSelectedDonor(null)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>

            {/* Details */}
            <div className="space-y-0 mb-6">
              {[
                { label: 'Donor Name',      value: selectedDonor.name },
                { label: 'Email',           value: selectedDonor.email },
                { label: 'Amount',          value: `$${selectedDonor.amount.toLocaleString()} ${selectedDonor.currency.toUpperCase()}` },
                { label: 'Donation Type',   value: selectedDonor.donation_type },
                { label: 'Program',         value: selectedDonor.program || 'General Fund' },
                { label: 'Payment Method',  value: selectedDonor.payment_method.replace(/_/g, ' ') },
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

            {/* Status Action Buttons */}
            <div className="flex flex-wrap gap-2 mb-4">
              {/* Approve */}
              {(selectedDonor.status === 'pending' || selectedDonor.status === 'failed') && (
                <button
                  onClick={() => updateStatus(selectedDonor.id, 'completed', 'approved')}
                  disabled={updatingId === selectedDonor.id}
                  className="flex-1 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {updatingId === selectedDonor.id
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <CheckCircle className="w-4 h-4" />
                  }
                  Approve
                </button>
              )}

              {/* Reject */}
              {selectedDonor.status === 'pending' && (
                <button
                  onClick={() => updateStatus(selectedDonor.id, 'failed', 'rejected')}
                  disabled={updatingId === selectedDonor.id}
                  className="flex-1 py-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
              )}

              {/* Refund */}
              {selectedDonor.status === 'completed' && (
                <button
                  onClick={() => updateStatus(selectedDonor.id, 'refunded', 'refunded')}
                  disabled={updatingId === selectedDonor.id}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Mark as Refunded
                </button>
              )}

              {/* Reset to Pending */}
              {(selectedDonor.status === 'failed' || selectedDonor.status === 'refunded') && (
                <button
                  onClick={() => updateStatus(selectedDonor.id, 'pending', 'reset to pending')}
                  disabled={updatingId === selectedDonor.id}
                  className="flex-1 py-3 bg-yellow-50 text-yellow-700 rounded-xl font-semibold hover:bg-yellow-100 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset to Pending
                </button>
              )}
            </div>

            {/* Footer Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedDonor(null)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => handleDelete(selectedDonor.id)}
                disabled={deletingId === selectedDonor.id}
                className="px-4 py-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-colors disabled:opacity-50"
                title="Delete Record"
              >
                {deletingId === selectedDonor.id ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Trash2 className="w-5 h-5" />
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