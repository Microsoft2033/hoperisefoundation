// import React, { useEffect, useState } from 'react';
// import { Plus, Trash2, Edit, Calendar, MapPin, Users } from 'lucide-react';
// import { db, Event } from '../../lib/mockDb';
// import { format } from 'date-fns';
// import toast from 'react-hot-toast';

// const emptyForm = { title: '', description: '', date: '', location: '', image: '', category: 'Fundraising', seats_available: 100, is_active: true };

// const AdminEvents: React.FC = () => {
//   const [events, setEvents] = useState<Event[]>([]);
//   const [showForm, setShowForm] = useState(false);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [form, setForm] = useState(emptyForm);
//   const [registrations, setRegistrations] = useState<Record<string, number>>({});

//   useEffect(() => {
//     const data = db.events.getAll();
//     setEvents(data);
//     const regCounts: Record<string, number> = {};
//     data.forEach(e => { regCounts[e.id] = db.eventRegistrations.getByEvent(e.id).length; });
//     setRegistrations(regCounts);
//   }, []);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (editingId) {
//       db.events.update(editingId, { ...form, seats_available: Number(form.seats_available) });
//       toast.success('Event updated successfully!');
//     } else {
//       db.events.create({ ...form, seats_available: Number(form.seats_available) });
//       toast.success('Event created successfully!');
//     }
//     setEvents(db.events.getAll());
//     setShowForm(false);
//     setEditingId(null);
//     setForm(emptyForm);
//   };

//   const handleEdit = (event: Event) => {
//     setForm({ title: event.title, description: event.description, date: event.date.slice(0, 16), location: event.location, image: event.image, category: event.category, seats_available: event.seats_available, is_active: event.is_active });
//     setEditingId(event.id);
//     setShowForm(true);
//   };

//   const handleDelete = (id: string) => {
//     if (window.confirm('Delete this event?')) {
//       db.events.delete(id);
//       setEvents(db.events.getAll());
//       toast.success('Event deleted');
//     }
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Events Management</h1>
//           <p className="text-gray-500 text-sm">{events.length} total events</p>
//         </div>
//         <button onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }} className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 text-sm">
//           <Plus className="w-4 h-4" />
//           <span>New Event</span>
//         </button>
//       </div>

//       {/* Event Form Modal */}
//       {showForm && (
//         <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-xl font-bold text-gray-900">{editingId ? 'Edit Event' : 'Create New Event'}</h2>
//               <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
//             </div>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">Event Title *</label>
//                 <input required type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none" />
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
//                 <textarea required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none resize-none" />
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">Date & Time *</label>
//                   <input required type="datetime-local" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none" />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
//                   <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none">
//                     {['Fundraising', 'Healthcare', 'Education', 'Environment', 'Community', 'Volunteer'].map(c => <option key={c}>{c}</option>)}
//                   </select>
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
//                 <input required type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none" placeholder="Venue, City, Country" />
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL</label>
//                 <input type="url" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none" placeholder="https://..." />
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">Seats Available</label>
//                 <input type="number" min="1" value={form.seats_available} onChange={e => setForm({ ...form, seats_available: parseInt(e.target.value) })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none" />
//               </div>
//               <div className="flex items-center space-x-3">
//                 <input type="checkbox" id="is_active" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="w-5 h-5 rounded" />
//                 <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Event is Active</label>
//               </div>
//               <div className="flex gap-3 pt-2">
//                 <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold">Cancel</button>
//                 <button type="submit" className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors">{editingId ? 'Update Event' : 'Create Event'}</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Events Grid */}
//       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {events.map((event) => (
//           <div key={event.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
//             <div className="relative h-40 overflow-hidden">
//               {event.image ? <img src={event.image} alt={event.title} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center"><Calendar className="w-12 h-12 text-white" /></div>}
//               <div className="absolute top-3 right-3">
//                 <span className={`px-2 py-1 rounded-full text-xs font-semibold ${event.is_active ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>{event.is_active ? 'Active' : 'Inactive'}</span>
//               </div>
//             </div>
//             <div className="p-5">
//               <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">{event.category}</span>
//               <h3 className="font-bold text-gray-900 mt-2 mb-2">{event.title}</h3>
//               <p className="text-gray-500 text-sm line-clamp-2 mb-3">{event.description}</p>
//               <div className="space-y-1.5 text-sm text-gray-500 mb-4">
//                 <div className="flex items-center space-x-2"><Calendar className="w-4 h-4" /><span>{format(new Date(event.date), 'MMM dd, yyyy • h:mm a')}</span></div>
//                 <div className="flex items-center space-x-2"><MapPin className="w-4 h-4" /><span className="truncate">{event.location}</span></div>
//                 <div className="flex items-center space-x-2"><Users className="w-4 h-4" /><span>{registrations[event.id] || 0} registered / {event.seats_available} seats</span></div>
//               </div>
//               <div className="flex gap-2">
//                 <button onClick={() => handleEdit(event)} className="flex-1 py-2 bg-purple-50 text-purple-700 rounded-xl text-sm font-semibold hover:bg-purple-100 transition-colors flex items-center justify-center space-x-1">
//                   <Edit className="w-4 h-4" /><span>Edit</span>
//                 </button>
//                 <button onClick={() => handleDelete(event.id)} className="py-2 px-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors">
//                   <Trash2 className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {events.length === 0 && <div className="text-center py-16 bg-white rounded-2xl"><div className="text-5xl mb-4">📅</div><h3 className="text-xl font-bold text-gray-700 mb-2">No events yet</h3><button onClick={() => setShowForm(true)} className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700">Create First Event</button></div>}
//     </div>
//   );
// };

// export default AdminEvents;

import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Trash2, Edit, Calendar, MapPin, Users, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';

// ============================================================
// TYPES
// ============================================================

interface Event {
  id: string;
  created_at: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
  category: string;
  seats_available: number;
  is_active: boolean;
}

type EventForm = Omit<Event, 'id' | 'created_at'>;

// ============================================================
// CONSTANTS
// ============================================================

const emptyForm: EventForm = {
  title: '',
  description: '',
  date: '',
  location: '',
  image: '',
  category: 'fundraiser',
  seats_available: 100,
  is_active: true,
};

const categoryLabels: Record<string, string> = {
  fundraiser:  'Fundraiser',
  workshop:    'Workshop',
  seminar:     'Seminar',
  community:   'Community',
  volunteer:   'Volunteer',
  awareness:   'Awareness',
  other:       'Other',
};

const categoryColors: Record<string, string> = {
  fundraiser:  'bg-green-50 text-green-700',
  workshop:    'bg-blue-50 text-blue-700',
  seminar:     'bg-indigo-50 text-indigo-700',
  community:   'bg-orange-50 text-orange-700',
  volunteer:   'bg-purple-50 text-purple-700',
  awareness:   'bg-yellow-50 text-yellow-700',
  other:       'bg-gray-50 text-gray-700',
};

// ============================================================
// COMPONENT
// ============================================================

const AdminEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<EventForm>(emptyForm);

  // ============================================================
  // FETCH EVENTS + REGISTRATION COUNTS IN PARALLEL
  // ============================================================
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const [eventsRes, registrationsRes] = await Promise.all([
        supabase
          .from('events')
          .select('*')
          .order('date', { ascending: true }),

        supabase
          .from('event_registrations')
          .select('event_id'),
      ]);

      if (eventsRes.error) throw eventsRes.error;
      if (registrationsRes.error) throw registrationsRes.error;

      const eventsData = eventsRes.data || [];
      const regsData = registrationsRes.data || [];

      // Count registrations per event
      const regCounts: Record<string, number> = {};
      regsData.forEach(reg => {
        regCounts[reg.event_id] = (regCounts[reg.event_id] || 0) + 1;
      });

      setEvents(eventsData);
      setRegistrations(regCounts);
    } catch (err: any) {
      console.error('Error fetching events:', err);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
      const payload: EventForm = {
        ...form,
        seats_available: Number(form.seats_available),
        // Convert local datetime to ISO string for Supabase TIMESTAMPTZ
        date: new Date(form.date).toISOString(),
      };

      if (editingId) {
        const { error } = await supabase
          .from('events')
          .update(payload)
          .eq('id', editingId);

        if (error) throw error;
        toast.success('Event updated successfully!');
      } else {
        const { error } = await supabase
          .from('events')
          .insert([payload]);

        if (error) throw error;
        toast.success('Event created successfully!');
      }

      await fetchData();
      resetForm();
    } catch (err: any) {
      console.error('Error saving event:', err);
      toast.error(err.message || 'Failed to save event');
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================================
  // EDIT: Populate Form
  // ============================================================
  const handleEdit = (event: Event) => {
    setForm({
      title:           event.title,
      description:     event.description,
      // Convert ISO string back to datetime-local format
      date:            event.date.slice(0, 16),
      location:        event.location,
      image:           event.image,
      category:        event.category,
      seats_available: event.seats_available,
      is_active:       event.is_active,
    });
    setEditingId(event.id);
    setShowForm(true);
  };

  // ============================================================
  // DELETE
  // ============================================================
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this event? All registrations will also be deleted.')) return;

    try {
      setDeletingId(id);

      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Event deleted successfully');
      await fetchData();
    } catch (err: any) {
      console.error('Error deleting event:', err);
      toast.error(err.message || 'Failed to delete event');
    } finally {
      setDeletingId(null);
    }
  };

  // ============================================================
  // TOGGLE ACTIVE STATUS
  // ============================================================
  const toggleActive = async (id: string, current: boolean) => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ is_active: !current })
        .eq('id', id);

      if (error) throw error;

      toast.success(current ? 'Event deactivated' : 'Event activated!');
      setEvents(prev =>
        prev.map(e => e.id === id ? { ...e, is_active: !current } : e)
      );
    } catch (err: any) {
      console.error('Error toggling event status:', err);
      toast.error(err.message || 'Failed to update event status');
    }
  };

  // ============================================================
  // STATS
  // ============================================================
  const activeEvents = events.filter(e => e.is_active).length;
  const totalRegistrations = Object.values(registrations).reduce((a, b) => a + b, 0);

  // ============================================================
  // LOADING STATE
  // ============================================================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <Loader2 className="w-10 h-10 text-purple-500 animate-spin mx-auto" />
          <p className="text-gray-500 text-sm">Loading events...</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Events Management</h1>
          <p className="text-gray-500 text-sm">
            {events.length} total • {activeEvents} active • {totalRegistrations} registrations
          </p>
        </div>
        <button
          onClick={() => { setShowForm(true); resetForm(); }}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Event</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Events',       value: events.length,          color: 'text-purple-600' },
          { label: 'Active Events',      value: activeEvents,            color: 'text-green-600'  },
          { label: 'Inactive Events',    value: events.length - activeEvents, color: 'text-gray-500'   },
          { label: 'Total Registrations', value: totalRegistrations,    color: 'text-blue-600'   },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
            <div className="text-gray-500 text-xs mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {editingId ? 'Edit Event' : 'Create New Event'}
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
                  Event Title *
                </label>
                <input
                  required
                  type="text"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                  placeholder="Enter event title"
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
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none resize-none"
                  placeholder="Describe your event..."
                />
              </div>

              {/* Date & Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date & Time *
                  </label>
                  <input
                    required
                    type="datetime-local"
                    value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                  >
                    {Object.keys(categoryLabels).map(c => (
                      <option key={c} value={c}>{categoryLabels[c]}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  required
                  type="text"
                  value={form.location}
                  onChange={e => setForm({ ...form, location: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                  placeholder="Venue, City, Country"
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                  placeholder="https://..."
                />
              </div>

              {/* Seats Available */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Seats Available
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.seats_available}
                  onChange={e => setForm({ ...form, seats_available: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                />
              </div>

              {/* Is Active */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={form.is_active}
                  onChange={e => setForm({ ...form, is_active: e.target.checked })}
                  className="w-5 h-5 rounded"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                  Event is Active (visible to public)
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors disabled:opacity-70 flex items-center justify-center space-x-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{editingId ? 'Updating...' : 'Creating...'}</span>
                    </>
                  ) : (
                    <span>{editingId ? 'Update Event' : 'Create Event'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Events Grid */}
      {events.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => {
            const regCount = registrations[event.id] || 0;
            const seatsLeft = event.seats_available - regCount;
            const isFull = seatsLeft <= 0;
            const isDeleting = deletingId === event.id;

            return (
              <div
                key={event.id}
                className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}
              >
                {/* Image */}
                <div className="relative h-40 overflow-hidden">
                  {event.image ? (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                      <Calendar className="w-12 h-12 text-white" />
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <button
                      onClick={() => toggleActive(event.id, event.is_active)}
                      className={`px-2 py-1 rounded-full text-xs font-semibold transition-colors ${
                        event.is_active
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : 'bg-gray-500 text-white hover:bg-gray-600'
                      }`}
                    >
                      {event.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </div>

                  {/* Seats Badge */}
                  {isFull && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 bg-red-500 text-white rounded-full text-xs font-semibold">
                        Full
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-5">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${categoryColors[event.category] || 'bg-gray-50 text-gray-700'}`}>
                    {categoryLabels[event.category] || event.category}
                  </span>

                  <h3 className="font-bold text-gray-900 mt-2 mb-1">{event.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-3">{event.description}</p>

                  <div className="space-y-1.5 text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span>{format(new Date(event.date), 'MMM dd, yyyy • h:mm a')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 flex-shrink-0" />
                      <span>
                        {regCount} registered
                        <span className="mx-1">•</span>
                        <span className={isFull ? 'text-red-500 font-semibold' : 'text-green-600 font-semibold'}>
                          {isFull ? 'Full' : `${seatsLeft} left`}
                        </span>
                        <span className="text-gray-400"> / {event.seats_available} seats</span>
                      </span>
                    </div>
                  </div>

                  {/* Seats Progress Bar */}
                  <div className="mb-4">
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all ${isFull ? 'bg-red-500' : 'bg-purple-500'}`}
                        style={{ width: `${Math.min((regCount / event.seats_available) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(event)}
                      className="flex-1 py-2 bg-purple-50 text-purple-700 rounded-xl text-sm font-semibold hover:bg-purple-100 transition-colors flex items-center justify-center space-x-1"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
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
        <div className="text-center py-16 bg-white rounded-2xl">
          <div className="text-5xl mb-4">📅</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No events yet</h3>
          <p className="text-gray-400 text-sm mb-6">Create your first event to get started</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
          >
            Create First Event
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminEvents;