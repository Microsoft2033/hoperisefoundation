


import React, { useEffect, useState, useCallback } from 'react';
import {
  Search, Trash2, Eye, CheckCircle,
  XCircle, Download, Loader2, RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';

// ============================================================
// TYPES
// ============================================================

interface Volunteer {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  skills: string[];
  availability: string;
  motivation: string;
  program: string;
  status: 'pending' | 'approved' | 'active' | 'inactive' | 'rejected';
  location: string;
}

// ============================================================
// CONSTANTS
// ============================================================

const statusStyles: Record<string, string> = {
  pending:  'bg-yellow-100 text-yellow-700',
  approved: 'bg-blue-100 text-blue-700',
  active:   'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-600',
  rejected: 'bg-red-100 text-red-700',
};

const statusSummary = [
  { label: 'Active',   key: 'active',   color: 'text-green-600 bg-green-50'  },
  { label: 'Pending',  key: 'pending',  color: 'text-yellow-600 bg-yellow-50' },
  { label: 'Approved', key: 'approved', color: 'text-blue-600 bg-blue-50'    },
  { label: 'Inactive', key: 'inactive', color: 'text-gray-600 bg-gray-50'    },
  { label: 'Rejected', key: 'rejected', color: 'text-red-600 bg-red-50'      },
];

// ============================================================
// COMPONENT
// ============================================================

const AdminVolunteers: React.FC = () => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [filtered, setFiltered] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<Volunteer | null>(null);

  // ============================================================
  // FETCH VOLUNTEERS
  // ============================================================
  const fetchVolunteers = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('volunteers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVolunteers(data || []);
    } catch (err: any) {
      console.error('Error fetching volunteers:', err);
      toast.error('Failed to load volunteers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVolunteers();
  }, [fetchVolunteers]);

  // ============================================================
  // CLIENT-SIDE FILTERING
  // ============================================================
  useEffect(() => {
    let result = [...volunteers];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        v =>
          v.name.toLowerCase().includes(q) ||
          v.email.toLowerCase().includes(q) ||
          v.program.toLowerCase().includes(q) ||
          v.location.toLowerCase().includes(q) ||
          v.skills.some(s => s.toLowerCase().includes(q))
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter(v => v.status === statusFilter);
    }

    setFiltered(result);
  }, [volunteers, search, statusFilter]);

  // ============================================================
  // UPDATE STATUS
  // ============================================================
  const updateStatus = async (
    id: string,
    status: Volunteer['status']
  ) => {
    try {
      setUpdatingId(id);

      const { error } = await supabase
        .from('volunteers')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      // Update local state without refetching
      setVolunteers(prev =>
        prev.map(v => v.id === id ? { ...v, status } : v)
      );

      // Sync selected modal if open
      if (selected?.id === id) {
        setSelected(prev => prev ? { ...prev, status } : null);
      }

      toast.success(`Volunteer ${status === 'active' ? 'approved' : status}`);
    } catch (err: any) {
      console.error('Error updating volunteer status:', err);
      toast.error(err.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  // ============================================================
  // DELETE
  // ============================================================
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this volunteer record?')) return;

    try {
      setDeletingId(id);

      const { error } = await supabase
        .from('volunteers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setVolunteers(prev => prev.filter(v => v.id !== id));
      if (selected?.id === id) setSelected(null);
      toast.success('Volunteer record deleted');
    } catch (err: any) {
      console.error('Error deleting volunteer:', err);
      toast.error(err.message || 'Failed to delete volunteer');
    } finally {
      setDeletingId(null);
    }
  };

  // ============================================================
  // EXPORT CSV
  // ============================================================
  const exportCSV = () => {
    if (filtered.length === 0) {
      toast.error('No data to export');
      return;
    }

    const headers = [
      'Name', 'Email', 'Phone', 'Age', 'Location',
      'Program', 'Availability', 'Skills', 'Status', 'Applied Date',
    ];

    const rows = filtered.map(v => [
      `"${v.name}"`,
      `"${v.email}"`,
      `"${v.phone}"`,
      v.age,
      `"${v.location}"`,
      `"${v.program}"`,
      v.availability,
      `"${(v.skills || []).join('; ')}"`,
      v.status,
      format(new Date(v.created_at), 'yyyy-MM-dd'),
    ]);

    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `volunteers_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filtered.length} volunteers!`);
  };

  // ============================================================
  // LOADING STATE
  // ============================================================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin mx-auto" />
          <p className="text-gray-500 text-sm">Loading volunteers...</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Volunteer Management</h1>
          <p className="text-gray-500 text-sm">
            {volunteers.length} total •{' '}
            <span className="text-yellow-600 font-medium">
              {volunteers.filter(v => v.status === 'pending').length} pending review
            </span>
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchVolunteers}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {statusSummary.map(s => (
          <button
            key={s.key}
            onClick={() => setStatusFilter(
              statusFilter === s.key ? 'all' : s.key
            )}
            className={`rounded-xl p-4 text-left transition-all border-2 ${s.color} ${
              statusFilter === s.key
                ? 'border-current shadow-sm'
                : 'border-transparent'
            }`}
          >
            <div className="text-2xl font-bold">
              {volunteers.filter(v => v.status === s.key).length}
            </div>
            <div className="text-sm font-medium">{s.label}</div>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, program, location or skill..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-sm"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Showing Count */}
      {(search || statusFilter !== 'all') && (
        <p className="text-sm text-gray-500">
          Showing{' '}
          <span className="font-semibold text-gray-800">{filtered.length}</span> of{' '}
          <span className="font-semibold text-gray-800">{volunteers.length}</span> volunteers
        </p>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {[
                  'Volunteer', 'Program', 'Location',
                  'Availability', 'Skills', 'Status', 'Applied', 'Actions'
                ].map(h => (
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
              {filtered.map(vol => {
                const isUpdating = updatingId === vol.id;
                const isDeleting = deletingId === vol.id;

                return (
                  <tr
                    key={vol.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      isDeleting ? 'opacity-50 pointer-events-none' : ''
                    }`}
                  >
                    {/* Volunteer Info */}
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xs flex-shrink-0">
                          {vol.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{vol.name}</p>
                          <p className="text-gray-400 text-xs">{vol.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Program */}
                    <td className="px-4 py-3 text-gray-600 text-sm">{vol.program}</td>

                    {/* Location */}
                    <td className="px-4 py-3 text-gray-600 text-sm">{vol.location}</td>

                    {/* Availability */}
                    <td className="px-4 py-3 text-gray-600 text-sm capitalize">
                      {vol.availability}
                    </td>

                    {/* Skills */}
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {(vol.skills || []).slice(0, 2).map(s => (
                          <span
                            key={s}
                            className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded"
                          >
                            {s}
                          </span>
                        ))}
                        {(vol.skills || []).length > 2 && (
                          <span className="text-xs text-gray-400">
                            +{vol.skills.length - 2}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${
                        statusStyles[vol.status] || 'bg-gray-100 text-gray-600'
                      }`}>
                        {vol.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {format(new Date(vol.created_at), 'MMM dd, yyyy')}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-1">
                        {/* View */}
                        <button
                          onClick={() => setSelected(vol)}
                          className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Approve */}
                        {vol.status !== 'active' && vol.status !== 'rejected' && (
                          <button
                            onClick={() => updateStatus(vol.id, 'active')}
                            disabled={isUpdating}
                            className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Approve"
                          >
                            {isUpdating
                              ? <Loader2 className="w-4 h-4 animate-spin" />
                              : <CheckCircle className="w-4 h-4" />
                            }
                          </button>
                        )}

                        {/* Reject */}
                        {vol.status === 'pending' && (
                          <button
                            onClick={() => updateStatus(vol.id, 'rejected')}
                            disabled={isUpdating}
                            className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}

                        {/* Deactivate */}
                        {vol.status === 'active' && (
                          <button
                            onClick={() => updateStatus(vol.id, 'inactive')}
                            disabled={isUpdating}
                            className="p-1.5 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Deactivate"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(vol.id)}
                          disabled={isDeleting}
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
              <div className="text-4xl mb-3">👥</div>
              <p className="text-gray-600 font-medium">No volunteers found</p>
              <p className="text-gray-400 text-sm mt-1">
                {search || statusFilter !== 'all'
                  ? 'Try adjusting your search or filter'
                  : 'No volunteer applications yet'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Volunteer Details</h2>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
                  statusStyles[selected.status]
                }`}>
                  {selected.status}
                </span>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>

            {/* Details Grid */}
            <div className="space-y-0 mb-6">
              {[
                { label: 'Full Name',    value: selected.name                         },
                { label: 'Email',        value: selected.email                        },
                { label: 'Phone',        value: selected.phone                        },
                { label: 'Age',          value: `${selected.age} years old`           },
                { label: 'Location',     value: selected.location                     },
                { label: 'Program',      value: selected.program                      },
                { label: 'Availability', value: selected.availability                 },
                { label: 'Skills',       value: (selected.skills || []).join(', ')    },
                { label: 'Motivation',   value: selected.motivation                   },
                { label: 'Applied',      value: format(new Date(selected.created_at), 'MMMM dd, yyyy') },
              ].map(({ label, value }) => (
                <div key={label} className="py-2.5 border-b border-gray-100 last:border-0">
                  <span className="text-gray-400 text-xs uppercase tracking-wider">
                    {label}
                  </span>
                  <p className="font-medium text-gray-900 text-sm mt-0.5 leading-relaxed">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap gap-3">
              {/* Approve */}
              {selected.status !== 'active' && selected.status !== 'rejected' && (
                <button
                  onClick={() => updateStatus(selected.id, 'active')}
                  disabled={updatingId === selected.id}
                  className="flex-1 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {updatingId === selected.id
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <CheckCircle className="w-4 h-4" />
                  }
                  Approve
                </button>
              )}

              {/* Reject */}
              {selected.status === 'pending' && (
                <button
                  onClick={() => updateStatus(selected.id, 'rejected')}
                  disabled={updatingId === selected.id}
                  className="flex-1 py-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
              )}

              {/* Deactivate */}
              {selected.status === 'active' && (
                <button
                  onClick={() => updateStatus(selected.id, 'inactive')}
                  disabled={updatingId === selected.id}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Deactivate
                </button>
              )}

              {/* Delete */}
              <button
                onClick={() => handleDelete(selected.id)}
                disabled={deletingId === selected.id}
                className="py-3 px-4 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-colors disabled:opacity-70"
              >
                {deletingId === selected.id
                  ? <Loader2 className="w-5 h-5 animate-spin" />
                  : <Trash2 className="w-5 h-5" />
                }
              </button>

              {/* Close */}
              <button
                onClick={() => setSelected(null)}
                className="py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVolunteers;