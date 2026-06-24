

import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Trash2, Edit, Loader2, Users, MapPin, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';

// ============================================================
// TYPES
// ============================================================

interface Program {
  id: string;
  created_at: string;
  title: string;
  description: string;
  category: string;
  image: string;
  location: string;
  beneficiaries: number;
  status: string;
  start_date: string;
  end_date: string | null;
}

type ProgramForm = Omit<Program, 'id' | 'created_at'>;

// ============================================================
// CONSTANTS
// ============================================================

const emptyForm: ProgramForm = {
  title: '',
  description: '',
  category: 'education',
  image: '',
  location: '',
  beneficiaries: 0,
  status: 'active',
  start_date: '',
  end_date: null,
};

const categoryLabels: Record<string, string> = {
  education:    'Education',
  health:       'Health',
  environment:  'Environment',
  community:    'Community',
  empowerment:  'Empowerment',
  relief:       'Relief',
  other:        'Other',
};

const categoryColors: Record<string, string> = {
  education:    'bg-blue-100 text-blue-700',
  health:       'bg-red-100 text-red-700',
  environment:  'bg-green-100 text-green-700',
  community:    'bg-orange-100 text-orange-700',
  empowerment:  'bg-purple-100 text-purple-700',
  relief:       'bg-cyan-100 text-cyan-700',
  other:        'bg-gray-100 text-gray-700',
};

const statusColors: Record<string, string> = {
  planned:   'bg-yellow-500 text-white',
  active:    'bg-green-500 text-white',
  paused:    'bg-orange-400 text-white',
  completed: 'bg-blue-500 text-white',
  cancelled: 'bg-red-500 text-white',
};

const categoryEmojis: Record<string, string> = {
  education:    '📚',
  health:       '🏥',
  environment:  '🌿',
  community:    '🤝',
  empowerment:  '💪',
  relief:       '🆘',
  other:        '📋',
};

// ============================================================
// COMPONENT
// ============================================================

const AdminPrograms: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProgramForm>(emptyForm);
  const [statusFilter, setStatusFilter] = useState('all');

  // ============================================================
  // FETCH PROGRAMS
  // ============================================================
  const fetchPrograms = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPrograms(data || []);
    } catch (err: any) {
      console.error('Error fetching programs:', err);
      toast.error('Failed to load programs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  // ============================================================
  // RESET FORM
  // ============================================================
  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  // ============================================================
  // CREATE / UPDATE
  // ============================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload: ProgramForm = {
        ...form,
        beneficiaries: Number(form.beneficiaries),
        end_date: form.end_date || null,
      };

      if (editingId) {
        const { error } = await supabase
          .from('programs')
          .update(payload)
          .eq('id', editingId);

        if (error) throw error;
        toast.success('Program updated successfully!');
      } else {
        const { error } = await supabase
          .from('programs')
          .insert([payload]);

        if (error) throw error;
        toast.success('Program created successfully!');
      }

      await fetchPrograms();
      resetForm();
    } catch (err: any) {
      console.error('Error saving program:', err);
      toast.error(err.message || 'Failed to save program');
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================================
  // EDIT: Populate Form
  // ============================================================
  const handleEdit = (program: Program) => {
    setForm({
      title:         program.title,
      description:   program.description,
      category:      program.category,
      image:         program.image,
      location:      program.location,
      beneficiaries: program.beneficiaries,
      status:        program.status,
      start_date:    program.start_date,
      end_date:      program.end_date,
    });
    setEditingId(program.id);
    setShowForm(true);
  };

  // ============================================================
  // DELETE
  // ============================================================
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this program?')) return;

    try {
      setDeletingId(id);

      const { error } = await supabase
        .from('programs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Program deleted successfully');
      setPrograms(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      console.error('Error deleting program:', err);
      toast.error(err.message || 'Failed to delete program');
    } finally {
      setDeletingId(null);
    }
  };

  // ============================================================
  // TOGGLE STATUS QUICK ACTION
  // ============================================================
  const toggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'paused' : 'active';

    try {
      const { error } = await supabase
        .from('programs')
        .update({ status: nextStatus })
        .eq('id', id);

      if (error) throw error;

      setPrograms(prev =>
        prev.map(p => p.id === id ? { ...p, status: nextStatus } : p)
      );
      toast.success(`Program ${nextStatus === 'active' ? 'activated' : 'paused'}`);
    } catch (err: any) {
      console.error('Error toggling status:', err);
      toast.error(err.message || 'Failed to update status');
    }
  };

  // ============================================================
  // FILTERED PROGRAMS
  // ============================================================
  const filteredPrograms = statusFilter === 'all'
    ? programs
    : programs.filter(p => p.status === statusFilter);

  // ============================================================
  // COMPUTED STATS
  // ============================================================
  const activeCount    = programs.filter(p => p.status === 'active').length;
  const completedCount = programs.filter(p => p.status === 'completed').length;
  const totalBeneficiaries = programs.reduce((sum, p) => sum + (p.beneficiaries || 0), 0);

  // ============================================================
  // LOADING STATE
  // ============================================================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin mx-auto" />
          <p className="text-gray-500 text-sm">Loading programs...</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Programs Management</h1>
          <p className="text-gray-500 text-sm">
            {programs.length} total •{' '}
            <span className="text-green-600 font-medium">{activeCount} active</span>
          </p>
        </div>
        <button
          onClick={() => { setShowForm(true); resetForm(); }}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Program</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Programs',      value: programs.length,                        color: 'text-blue-600'   },
          { label: 'Active',              value: activeCount,                            color: 'text-green-600'  },
          { label: 'Completed',           value: completedCount,                         color: 'text-indigo-600' },
          { label: 'Total Beneficiaries', value: totalBeneficiaries.toLocaleString(),    color: 'text-purple-600' },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
            <div className="text-gray-500 text-xs mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {['all', 'planned', 'active', 'paused', 'completed', 'cancelled'].map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
              statusFilter === status
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-400 hover:text-blue-600'
            }`}
          >
            {status === 'all' ? 'All Programs' : status}
            {status !== 'all' && (
              <span className="ml-1 text-xs opacity-70">
                ({programs.filter(p => p.status === status).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {editingId ? 'Edit Program' : 'Create New Program'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Program Title *
                </label>
                <input
                  required
                  type="text"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  placeholder="Enter program title"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none"
                  placeholder="Describe the program goals and impact..."
                />
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none"
                  >
                    {Object.keys(categoryLabels).map(c => (
                      <option key={c} value={c}>{categoryLabels[c]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none"
                  >
                    {['planned', 'active', 'paused', 'completed', 'cancelled'].map(s => (
                      <option key={s} value={s} className="capitalize">{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={form.location}
                  onChange={e => setForm({ ...form, location: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  placeholder="City, Country"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={form.image}
                  onChange={e => setForm({ ...form, image: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  placeholder="https://..."
                />
              </div>

              {/* Beneficiaries, Start Date, End Date */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Beneficiaries
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.beneficiaries}
                    onChange={e => setForm({ ...form, beneficiaries: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={form.start_date}
                    onChange={e => setForm({ ...form, start_date: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    End Date
                    <span className="text-gray-400 font-normal ml-1">(optional)</span>
                  </label>
                  <input
                    type="date"
                    value={form.end_date || ''}
                    onChange={e => setForm({ ...form, end_date: e.target.value || null })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-70 flex items-center justify-center space-x-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{editingId ? 'Updating...' : 'Creating...'}</span>
                    </>
                  ) : (
                    <span>{editingId ? 'Update Program' : 'Create Program'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Programs Grid */}
      {filteredPrograms.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map(program => {
            const isDeleting = deletingId === program.id;

            return (
              <div
                key={program.id}
                className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all ${
                  isDeleting ? 'opacity-50 pointer-events-none' : ''
                }`}
              >
                {/* Image */}
                <div className="relative h-36 overflow-hidden">
                  {program.image ? (
                    <img
                      src={program.image}
                      alt={program.title}
                      className="w-full h-full object-cover"
                      onError={e => {
                        (e.target as HTMLImageElement).src =
                          'https://via.placeholder.com/400x150?text=No+Image';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-4xl">
                      {categoryEmojis[program.category] || '📋'}
                    </div>
                  )}

                  {/* Status Badge - Clickable to toggle */}
                  <button
                    onClick={() => toggleStatus(program.id, program.status)}
                    className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold capitalize transition-opacity hover:opacity-80 ${
                      statusColors[program.status] || 'bg-gray-500 text-white'
                    }`}
                    title="Click to toggle active/paused"
                  >
                    {program.status}
                  </button>
                </div>

                {/* Card Content */}
                <div className="p-5">
                  {/* Category + Beneficiaries */}
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      categoryColors[program.category] || 'bg-gray-100 text-gray-700'
                    }`}>
                      {categoryLabels[program.category] || program.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Users className="w-3 h-3" />
                      {program.beneficiaries.toLocaleString()}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-bold text-gray-900 mb-1">{program.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                    {program.description}
                  </p>

                  {/* Meta Info */}
                  <div className="space-y-1 mb-4">
                    {program.location && (
                      <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{program.location}</span>
                      </div>
                    )}
                    {program.start_date && (
                      <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                        <Calendar className="w-3 h-3 flex-shrink-0" />
                        <span>
                          {format(new Date(program.start_date), 'MMM dd, yyyy')}
                          {program.end_date && (
                            <> → {format(new Date(program.end_date), 'MMM dd, yyyy')}</>
                          )}
                          {!program.end_date && ' → Ongoing'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(program)}
                      className="flex-1 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-semibold hover:bg-blue-100 transition-colors flex items-center justify-center space-x-1"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(program.id)}
                      disabled={isDeleting}
                      className="py-2 px-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      {isDeleting
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <Trash2 className="w-4 h-4" />
                      }
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <div className="text-5xl mb-4">📚</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No programs found</h3>
          <p className="text-gray-400 text-sm mb-6">
            {statusFilter !== 'all'
              ? `No programs with status "${statusFilter}"`
              : 'Create your first program to get started'}
          </p>
          {statusFilter !== 'all' ? (
            <button
              onClick={() => setStatusFilter('all')}
              className="px-4 py-2 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 text-sm font-medium mr-3"
            >
              Clear Filter
            </button>
          ) : null}
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Create First Program
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminPrograms;