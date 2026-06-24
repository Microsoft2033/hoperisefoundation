import React, { useEffect, useState } from 'react';
import { Search, Trash2, Download } from 'lucide-react';
import { db, NewsletterSubscriber } from '../../lib/mockDb';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const AdminNewsletter: React.FC = () => {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [filtered, setFiltered] = useState<NewsletterSubscriber[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const data = db.newsletter.getAll();
    setSubscribers(data);
    setFiltered(data);
  }, []);

  useEffect(() => {
    let result = subscribers;
    if (search) result = result.filter(s => s.email.toLowerCase().includes(search.toLowerCase()));
    setFiltered(result);
  }, [subscribers, search]);

  const handleDelete = (id: string) => {
    if (window.confirm('Unsubscribe this email?')) {
      db.newsletter.delete(id);
      const updated = db.newsletter.getAll();
      setSubscribers(updated);
      toast.success('Subscriber removed');
    }
  };

  const exportCSV = () => {
    const headers = ['Email', 'Status', 'Subscribed Date'];
    const rows = filtered.map(s => [s.email, s.status, format(new Date(s.created_at), 'yyyy-MM-dd')]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'newsletter_subscribers.csv'; a.click();
    toast.success('CSV exported!');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Newsletter Subscribers</h1>
          <p className="text-gray-500 text-sm">{subscribers.length} total subscribers</p>
        </div>
        <div className="flex gap-3">
          <button onClick={exportCSV} className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 text-sm">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 rounded-xl p-4">
          <div className="text-2xl font-bold text-green-600">{subscribers.filter(s => s.status === 'active').length}</div>
          <div className="text-green-700 text-sm">Active Subscribers</div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="text-2xl font-bold text-gray-600">{subscribers.length}</div>
          <div className="text-gray-700 text-sm">Total Subscribers</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search subscribers..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-sm" />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">#</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Subscribed Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((sub, idx) => (
              <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-gray-400 text-sm">{idx + 1}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-700 text-xs font-bold">@</div>
                    <span className="font-medium text-gray-900 text-sm">{sub.email}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${sub.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{sub.status}</span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-sm">{format(new Date(sub.created_at), 'MMM dd, yyyy')}</td>
                <td className="px-4 py-3">
                  <button onClick={() => handleDelete(sub.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="text-center py-12"><div className="text-4xl mb-3">📧</div><p className="text-gray-500">No subscribers found</p></div>}
      </div>
    </div>
  );
};

export default AdminNewsletter;
