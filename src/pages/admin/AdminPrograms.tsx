import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import { db, Program } from '../../lib/mockDb';
import toast from 'react-hot-toast';

const emptyForm = { title: '', description: '', category: 'Education', image: '', location: '', beneficiaries: 0, status: 'active', start_date: '', end_date: null as string | null };

const AdminPrograms: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    setPrograms(db.programs.getAll());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      db.programs.update(editingId, { ...form, beneficiaries: Number(form.beneficiaries) });
      toast.success('Program updated!');
    } else {
      db.programs.create({ ...form, beneficiaries: Number(form.beneficiaries) });
      toast.success('Program created!');
    }
    setPrograms(db.programs.getAll());
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleEdit = (p: Program) => {
    setForm({ title: p.title, description: p.description, category: p.category, image: p.image, location: p.location, beneficiaries: p.beneficiaries, status: p.status, start_date: p.start_date, end_date: p.end_date });
    setEditingId(p.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this program?')) {
      db.programs.delete(id);
      setPrograms(db.programs.getAll());
      toast.success('Program deleted');
    }
  };

  const categoryColors: Record<string, string> = {
    Education: 'bg-blue-100 text-blue-700', Healthcare: 'bg-red-100 text-red-700',
    Environment: 'bg-green-100 text-green-700', 'Water & Sanitation': 'bg-cyan-100 text-cyan-700',
    'Economic Empowerment': 'bg-purple-100 text-purple-700', 'Digital Education': 'bg-orange-100 text-orange-700',
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Programs Management</h1>
          <p className="text-gray-500 text-sm">{programs.filter(p => p.status === 'active').length} active programs</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 text-sm">
          <Plus className="w-4 h-4" />
          <span>New Program</span>
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">{editingId ? 'Edit Program' : 'Create Program'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 text-xl">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Program Title *</label>
                <input required type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                <textarea required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={4} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none">
                    {['Education', 'Healthcare', 'Water & Sanitation', 'Economic Empowerment', 'Environment', 'Digital Education'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none">
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="planned">Planned</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                <input type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL</label>
                <input type="url" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Beneficiaries</label>
                  <input type="number" min="0" value={form.beneficiaries} onChange={e => setForm({ ...form, beneficiaries: parseInt(e.target.value) })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                  <input type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                  <input type="date" value={form.end_date || ''} onChange={e => setForm({ ...form, end_date: e.target.value || null })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700">{editingId ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Programs Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((program) => (
          <div key={program.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
            <div className="relative h-36 overflow-hidden">
              {program.image ? <img src={program.image} alt={program.title} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-3xl">📚</div>}
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${program.status === 'active' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>{program.status}</span>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${categoryColors[program.category] || 'bg-gray-100 text-gray-700'}`}>{program.category}</span>
                <span className="text-xs text-gray-500">{program.beneficiaries.toLocaleString()} beneficiaries</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{program.title}</h3>
              <p className="text-gray-500 text-sm line-clamp-2 mb-4">{program.description}</p>
              <p className="text-gray-400 text-xs mb-4">📍 {program.location}</p>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(program)} className="flex-1 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-semibold hover:bg-blue-100 flex items-center justify-center space-x-1">
                  <Edit className="w-4 h-4" /><span>Edit</span>
                </button>
                <button onClick={() => handleDelete(program.id)} className="py-2 px-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPrograms;
