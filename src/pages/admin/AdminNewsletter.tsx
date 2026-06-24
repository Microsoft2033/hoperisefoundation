// import React, { useEffect, useState } from 'react';
// import { Search, Trash2, Download } from 'lucide-react';
// import { db, NewsletterSubscriber } from '../../lib/mockDb';
// import { format } from 'date-fns';
// import toast from 'react-hot-toast';

// const AdminNewsletter: React.FC = () => {
//   const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
//   const [filtered, setFiltered] = useState<NewsletterSubscriber[]>([]);
//   const [search, setSearch] = useState('');

//   useEffect(() => {
//     const data = db.newsletter.getAll();
//     setSubscribers(data);
//     setFiltered(data);
//   }, []);

//   useEffect(() => {
//     let result = subscribers;
//     if (search) result = result.filter(s => s.email.toLowerCase().includes(search.toLowerCase()));
//     setFiltered(result);
//   }, [subscribers, search]);

//   const handleDelete = (id: string) => {
//     if (window.confirm('Unsubscribe this email?')) {
//       db.newsletter.delete(id);
//       const updated = db.newsletter.getAll();
//       setSubscribers(updated);
//       toast.success('Subscriber removed');
//     }
//   };

//   const exportCSV = () => {
//     const headers = ['Email', 'Status', 'Subscribed Date'];
//     const rows = filtered.map(s => [s.email, s.status, format(new Date(s.created_at), 'yyyy-MM-dd')]);
//     const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
//     const blob = new Blob([csv], { type: 'text/csv' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a'); a.href = url; a.download = 'newsletter_subscribers.csv'; a.click();
//     toast.success('CSV exported!');
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Newsletter Subscribers</h1>
//           <p className="text-gray-500 text-sm">{subscribers.length} total subscribers</p>
//         </div>
//         <div className="flex gap-3">
//           <button onClick={exportCSV} className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 text-sm">
//             <Download className="w-4 h-4" />
//             <span>Export</span>
//           </button>
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-4">
//         <div className="bg-green-50 rounded-xl p-4">
//           <div className="text-2xl font-bold text-green-600">{subscribers.filter(s => s.status === 'active').length}</div>
//           <div className="text-green-700 text-sm">Active Subscribers</div>
//         </div>
//         <div className="bg-gray-50 rounded-xl p-4">
//           <div className="text-2xl font-bold text-gray-600">{subscribers.length}</div>
//           <div className="text-gray-700 text-sm">Total Subscribers</div>
//         </div>
//       </div>

//       <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//           <input type="text" placeholder="Search subscribers..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-sm" />
//         </div>
//       </div>

//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//         <table className="w-full">
//           <thead className="bg-gray-50 border-b border-gray-100">
//             <tr>
//               <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">#</th>
//               <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
//               <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
//               <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Subscribed Date</th>
//               <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-50">
//             {filtered.map((sub, idx) => (
//               <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
//                 <td className="px-4 py-3 text-gray-400 text-sm">{idx + 1}</td>
//                 <td className="px-4 py-3">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-700 text-xs font-bold">@</div>
//                     <span className="font-medium text-gray-900 text-sm">{sub.email}</span>
//                   </div>
//                 </td>
//                 <td className="px-4 py-3">
//                   <span className={`px-2 py-1 rounded-full text-xs font-semibold ${sub.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{sub.status}</span>
//                 </td>
//                 <td className="px-4 py-3 text-gray-500 text-sm">{format(new Date(sub.created_at), 'MMM dd, yyyy')}</td>
//                 <td className="px-4 py-3">
//                   <button onClick={() => handleDelete(sub.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
//                     <Trash2 className="w-4 h-4" />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         {filtered.length === 0 && <div className="text-center py-12"><div className="text-4xl mb-3">📧</div><p className="text-gray-500">No subscribers found</p></div>}
//       </div>
//     </div>
//   );
// };

// export default AdminNewsletter;

import React, { useEffect, useState, useCallback } from 'react';
import { Search, Trash2, Download, Loader2, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';

// ============================================================
// TYPES
// ============================================================

interface NewsletterSubscriber {
  id: string;
  created_at: string;
  email: string;
  status: 'subscribed' | 'unsubscribed' | 'bounced';
}

// ============================================================
// CONSTANTS
// ============================================================

const statusStyles: Record<string, string> = {
  subscribed:   'bg-green-100 text-green-700',
  unsubscribed: 'bg-gray-100 text-gray-600',
  bounced:      'bg-red-100 text-red-700',
};

// ============================================================
// COMPONENT
// ============================================================

const AdminNewsletter: React.FC = () => {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [filtered, setFiltered] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // ============================================================
  // FETCH SUBSCRIBERS
  // ============================================================
  const fetchSubscribers = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubscribers(data || []);
    } catch (err: any) {
      console.error('Error fetching subscribers:', err);
      toast.error('Failed to load subscribers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  // ============================================================
  // CLIENT-SIDE FILTERING
  // ============================================================
  useEffect(() => {
    let result = [...subscribers];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(s => s.email.toLowerCase().includes(q));
    }

    if (statusFilter !== 'all') {
      result = result.filter(s => s.status === statusFilter);
    }

    setFiltered(result);
  }, [subscribers, search, statusFilter]);

  // ============================================================
  // UPDATE STATUS
  // ============================================================
  const updateStatus = async (
    id: string,
    status: NewsletterSubscriber['status']
  ) => {
    try {
      setUpdatingId(id);

      const { error } = await supabase
        .from('newsletter_subscribers')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setSubscribers(prev =>
        prev.map(s => s.id === id ? { ...s, status } : s)
      );

      toast.success(`Subscriber marked as ${status}`);
    } catch (err: any) {
      console.error('Error updating subscriber:', err);
      toast.error(err.message || 'Failed to update subscriber');
    } finally {
      setUpdatingId(null);
    }
  };

  // ============================================================
  // DELETE SUBSCRIBER
  // ============================================================
  const handleDelete = async (id: string) => {
    if (!window.confirm('Permanently remove this subscriber?')) return;

    try {
      setDeletingId(id);

      const { error } = await supabase
        .from('newsletter_subscribers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSubscribers(prev => prev.filter(s => s.id !== id));
      toast.success('Subscriber removed successfully');
    } catch (err: any) {
      console.error('Error deleting subscriber:', err);
      toast.error(err.message || 'Failed to remove subscriber');
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

    const headers = ['#', 'Email', 'Status', 'Subscribed Date'];
    const rows = filtered.map((s, idx) => [
      idx + 1,
      `"${s.email}"`,
      s.status,
      format(new Date(s.created_at), 'yyyy-MM-dd'),
    ]);

    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter_subscribers_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filtered.length} subscribers!`);
  };

  // ============================================================
  // COMPUTED STATS
  // ============================================================
  const subscribedCount   = subscribers.filter(s => s.status === 'subscribed').length;
  const unsubscribedCount = subscribers.filter(s => s.status === 'unsubscribed').length;
  const bouncedCount      = subscribers.filter(s => s.status === 'bounced').length;

  // ============================================================
  // LOADING STATE
  // ============================================================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <Loader2 className="w-10 h-10 text-orange-500 animate-spin mx-auto" />
          <p className="text-gray-500 text-sm">Loading subscribers...</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Newsletter Subscribers</h1>
          <p className="text-gray-500 text-sm">
            {subscribers.length} total •{' '}
            <span className="text-green-600 font-medium">{subscribedCount} active</span>
          </p>
        </div>
        <div className="flex gap-3">
          {/* Refresh Button */}
          <button
            onClick={fetchSubscribers}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          {/* Export Button */}
          <button
            onClick={exportCSV}
            className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total',        value: subscribers.length,  color: 'text-gray-700',   bg: 'bg-gray-50'   },
          { label: 'Subscribed',   value: subscribedCount,     color: 'text-green-600',  bg: 'bg-green-50'  },
          { label: 'Unsubscribed', value: unsubscribedCount,   color: 'text-gray-500',   bg: 'bg-gray-50'   },
          { label: 'Bounced',      value: bouncedCount,        color: 'text-red-600',    bg: 'bg-red-50'    },
        ].map(card => (
          <div key={card.label} className={`${card.bg} rounded-xl p-4`}>
            <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
            <div className="text-gray-600 text-sm mt-1">{card.label} Subscribers</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search subscribers by email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-sm"
        >
          <option value="all">All Status</option>
          <option value="subscribed">Subscribed</option>
          <option value="unsubscribed">Unsubscribed</option>
          <option value="bounced">Bounced</option>
        </select>
      </div>

      {/* Showing count */}
      {(search || statusFilter !== 'all') && (
        <p className="text-sm text-gray-500">
          Showing <span className="font-semibold text-gray-800">{filtered.length}</span> of{' '}
          <span className="font-semibold text-gray-800">{subscribers.length}</span> subscribers
        </p>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['#', 'Email', 'Status', 'Subscribed Date', 'Actions'].map(h => (
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
              {filtered.map((sub, idx) => {
                const isDeleting = deletingId === sub.id;
                const isUpdating = updatingId === sub.id;

                return (
                  <tr
                    key={sub.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      isDeleting ? 'opacity-50 pointer-events-none' : ''
                    }`}
                  >
                    {/* Index */}
                    <td className="px-4 py-3 text-gray-400 text-sm">
                      {idx + 1}
                    </td>

                    {/* Email */}
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-700 text-xs font-bold flex-shrink-0">
                          @
                        </div>
                        <span className="font-medium text-gray-900 text-sm">
                          {sub.email}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <select
                        value={sub.status}
                        onChange={e =>
                          updateStatus(sub.id, e.target.value as NewsletterSubscriber['status'])
                        }
                        disabled={isUpdating}
                        className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:opacity-50 ${
                          statusStyles[sub.status]
                        }`}
                      >
                        <option value="subscribed">subscribed</option>
                        <option value="unsubscribed">unsubscribed</option>
                        <option value="bounced">bounced</option>
                      </select>
                      {isUpdating && (
                        <Loader2 className="inline w-3 h-3 ml-2 animate-spin text-orange-500" />
                      )}
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 text-gray-500 text-sm">
                      {format(new Date(sub.created_at), 'MMM dd, yyyy')}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(sub.id)}
                        disabled={isDeleting}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Remove subscriber"
                      >
                        {isDeleting
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : <Trash2 className="w-4 h-4" />
                        }
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Empty State */}
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">📧</div>
              <p className="text-gray-600 font-medium">No subscribers found</p>
              <p className="text-gray-400 text-sm mt-1">
                {search || statusFilter !== 'all'
                  ? 'Try adjusting your search or filter'
                  : 'No newsletter subscribers yet'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNewsletter;