import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit, Calendar, MapPin, Users } from 'lucide-react';
import { db, Event } from '../../lib/mockDb';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const emptyForm = { title: '', description: '', date: '', location: '', image: '', category: 'Fundraising', seats_available: 100, is_active: true };

const AdminEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [registrations, setRegistrations] = useState<Record<string, number>>({});

  useEffect(() => {
    const data = db.events.getAll();
    setEvents(data);
    const regCounts: Record<string, number> = {};
    data.forEach(e => { regCounts[e.id] = db.eventRegistrations.getByEvent(e.id).length; });
    setRegistrations(regCounts);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      db.events.update(editingId, { ...form, seats_available: Number(form.seats_available) });
      toast.success('Event updated successfully!');
    } else {
      db.events.create({ ...form, seats_available: Number(form.seats_available) });
      toast.success('Event created successfully!');
    }
    setEvents(db.events.getAll());
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleEdit = (event: Event) => {
    setForm({ title: event.title, description: event.description, date: event.date.slice(0, 16), location: event.location, image: event.image, category: event.category, seats_available: event.seats_available, is_active: event.is_active });
    setEditingId(event.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this event?')) {
      db.events.delete(id);
      setEvents(db.events.getAll());
      toast.success('Event deleted');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events Management</h1>
          <p className="text-gray-500 text-sm">{events.length} total events</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }} className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 text-sm">
          <Plus className="w-4 h-4" />
          <span>New Event</span>
        </button>
      </div>

      {/* Event Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">{editingId ? 'Edit Event' : 'Create New Event'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Title *</label>
                <input required type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                <textarea required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date & Time *</label>
                  <input required type="datetime-local" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none">
                    {['Fundraising', 'Healthcare', 'Education', 'Environment', 'Community', 'Volunteer'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
                <input required type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none" placeholder="Venue, City, Country" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL</label>
                <input type="url" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Seats Available</label>
                <input type="number" min="1" value={form.seats_available} onChange={e => setForm({ ...form, seats_available: parseInt(e.target.value) })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none" />
              </div>
              <div className="flex items-center space-x-3">
                <input type="checkbox" id="is_active" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="w-5 h-5 rounded" />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Event is Active</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors">{editingId ? 'Update Event' : 'Create Event'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Events Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
            <div className="relative h-40 overflow-hidden">
              {event.image ? <img src={event.image} alt={event.title} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center"><Calendar className="w-12 h-12 text-white" /></div>}
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${event.is_active ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>{event.is_active ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
            <div className="p-5">
              <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">{event.category}</span>
              <h3 className="font-bold text-gray-900 mt-2 mb-2">{event.title}</h3>
              <p className="text-gray-500 text-sm line-clamp-2 mb-3">{event.description}</p>
              <div className="space-y-1.5 text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-2"><Calendar className="w-4 h-4" /><span>{format(new Date(event.date), 'MMM dd, yyyy • h:mm a')}</span></div>
                <div className="flex items-center space-x-2"><MapPin className="w-4 h-4" /><span className="truncate">{event.location}</span></div>
                <div className="flex items-center space-x-2"><Users className="w-4 h-4" /><span>{registrations[event.id] || 0} registered / {event.seats_available} seats</span></div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(event)} className="flex-1 py-2 bg-purple-50 text-purple-700 rounded-xl text-sm font-semibold hover:bg-purple-100 transition-colors flex items-center justify-center space-x-1">
                  <Edit className="w-4 h-4" /><span>Edit</span>
                </button>
                <button onClick={() => handleDelete(event.id)} className="py-2 px-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && <div className="text-center py-16 bg-white rounded-2xl"><div className="text-5xl mb-4">📅</div><h3 className="text-xl font-bold text-gray-700 mb-2">No events yet</h3><button onClick={() => setShowForm(true)} className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700">Create First Event</button></div>}
    </div>
  );
};

export default AdminEvents;
