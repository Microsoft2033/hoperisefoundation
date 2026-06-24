import React, { useEffect, useState } from 'react';
import { Search, Trash2, Eye, CheckCircle, XCircle, Download } from 'lucide-react';
import { db, Volunteer } from '../../lib/mockDb';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const AdminVolunteers: React.FC = () => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [filtered, setFiltered] = useState<Volunteer[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<Volunteer | null>(null);

  useEffect(() => {
    const data = db.volunteers.getAll();
    setVolunteers(data);
    setFiltered(data);
  }, []);

  useEffect(() => {
    let result = volunteers;
    if (search) result = result.filter(v => v.name.toLowerCase().includes(search.toLowerCase()) || v.email.toLowerCase().includes(search.toLowerCase()) || v.program.toLowerCase().includes(search.toLowerCase()));
    if (statusFilter !== 'all') result = result.filter(v => v.status === statusFilter);
    setFiltered(result);
  }, [volunteers, search, statusFilter]);

  const updateStatus = (id: string, status: string) => {
    db.volunteers.update(id, { status });
    const updated = db.volunteers.getAll();
    setVolunteers(updated);
    toast.success(`Volunteer status updated to ${status}`);
    if (selected?.id === id) setSelected({ ...selected, status });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this volunteer record?')) {
      db.volunteers.delete(id);
      setVolunteers(db.volunteers.getAll());
      toast.success('Volunteer record deleted');
      if (selected?.id === id) setSelected(null);
    }
  };

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Age', 'Location', 'Program', 'Availability', 'Skills', 'Status', 'Date'];
    const rows = filtered.map(v => [v.name, v.email, v.phone, v.age, v.location, v.program, v.availability, v.skills.join(';'), v.status, format(new Date(v.created_at), 'yyyy-MM-dd')]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'volunteers.csv'; a.click();
    toast.success('CSV exported!');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Volunteer Management</h1>
          <p className="text-gray-500 text-sm">{volunteers.length} total • {volunteers.filter(v => v.status === 'pending').length} pending review</p>
        </div>
        <button onClick={exportCSV} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors text-sm">
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active', count: volunteers.filter(v => v.status === 'active').length, color: 'text-green-600 bg-green-50' },
          { label: 'Pending', count: volunteers.filter(v => v.status === 'pending').length, color: 'text-yellow-600 bg-yellow-50' },
          { label: 'Inactive', count: volunteers.filter(v => v.status === 'inactive').length, color: 'text-gray-600 bg-gray-50' },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl p-4 ${s.color}`}>
            <div className="text-2xl font-bold">{s.count}</div>
            <div className="text-sm">{s.label} Volunteers</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search volunteers..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-sm" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-sm">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Volunteer', 'Program', 'Location', 'Availability', 'Skills', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((vol) => (
                <tr key={vol.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xs">{vol.name.charAt(0)}</div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{vol.name}</p>
                        <p className="text-gray-400 text-xs">{vol.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-sm">{vol.program}</td>
                  <td className="px-4 py-3 text-gray-600 text-sm">{vol.location}</td>
                  <td className="px-4 py-3 text-gray-600 text-sm">{vol.availability}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {vol.skills.slice(0, 2).map(s => <span key={s} className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">{s}</span>)}
                      {vol.skills.length > 2 && <span className="text-xs text-gray-400">+{vol.skills.length - 2}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${vol.status === 'active' ? 'bg-green-100 text-green-700' : vol.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                      {vol.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{format(new Date(vol.created_at), 'MMM dd, yyyy')}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-1">
                      <button onClick={() => setSelected(vol)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg" title="View"><Eye className="w-4 h-4" /></button>
                      {vol.status !== 'active' && <button onClick={() => updateStatus(vol.id, 'active')} className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg" title="Approve"><CheckCircle className="w-4 h-4" /></button>}
                      {vol.status === 'active' && <button onClick={() => updateStatus(vol.id, 'inactive')} className="p-1.5 text-gray-500 hover:bg-gray-50 rounded-lg" title="Deactivate"><XCircle className="w-4 h-4" /></button>}
                      <button onClick={() => handleDelete(vol.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="text-center py-12"><div className="text-4xl mb-3">👥</div><p className="text-gray-500">No volunteers found</p></div>}
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Volunteer Details</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Name', value: selected.name },
                { label: 'Email', value: selected.email },
                { label: 'Phone', value: selected.phone },
                { label: 'Age', value: selected.age.toString() },
                { label: 'Location', value: selected.location },
                { label: 'Program', value: selected.program },
                { label: 'Availability', value: selected.availability },
                { label: 'Skills', value: selected.skills.join(', ') },
                { label: 'Motivation', value: selected.motivation },
                { label: 'Applied', value: format(new Date(selected.created_at), 'MMMM dd, yyyy') },
              ].map(({ label, value }) => (
                <div key={label} className="py-2 border-b border-gray-100 last:border-0">
                  <span className="text-gray-500 text-xs uppercase tracking-wider">{label}</span>
                  <p className="font-medium text-gray-900 text-sm mt-1">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              {selected.status !== 'active' && (
                <button onClick={() => { updateStatus(selected.id, 'active'); setSelected(null); }} className="flex-1 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors">
                  ✓ Approve
                </button>
              )}
              <button onClick={() => setSelected(null)} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
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
