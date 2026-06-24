import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, CheckCircle } from 'lucide-react';
import { db, Event } from '../lib/mockDb';
import { format, isPast, isFuture } from 'date-fns';
import toast from 'react-hot-toast';

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [filter, setFilter] = useState('upcoming');
  const [form, setForm] = useState({ name: '', email: '', phone: '', attendees: '1' });

  useEffect(() => {
    setEvents(db.events.getAll());
  }, []);

  const filteredEvents = events.filter(e => {
    if (filter === 'upcoming') return isFuture(new Date(e.date));
    if (filter === 'past') return isPast(new Date(e.date));
    return true;
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;
    setRegistering(true);
    try {
      await new Promise(r => setTimeout(r, 1500));
      db.eventRegistrations.create({
        event_id: selectedEvent.id,
        name: form.name,
        email: form.email,
        phone: form.phone,
        attendees: parseInt(form.attendees),
      });
      setRegistered(true);
      toast.success('Successfully registered for the event!');
    } catch {
      toast.error('Registration failed. Please try again.');
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-800 to-purple-600 py-28 pt-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Calendar className="w-14 h-14 text-white mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-white font-serif mb-4">Events & Gatherings</h1>
          <p className="text-purple-100 text-lg max-w-2xl mx-auto">Join us at our events to connect, learn, and make a collective impact in our communities.</p>
        </div>
      </section>

      {/* Filter */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-center gap-3">
          {['upcoming', 'past', 'all'].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-all capitalize border-2 ${filter === f ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
              {f === 'upcoming' ? '🔜 Upcoming' : f === 'past' ? '📅 Past Events' : '🗓️ All Events'}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl font-bold text-gray-700">No events found</h3>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => {
                const eventDate = new Date(event.date);
                const isUpcoming = isFuture(eventDate);
                return (
                  <div key={event.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                    <div className="relative h-52 overflow-hidden">
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-4 right-4 bg-white rounded-xl px-3 py-2 text-center shadow-md">
                        <div className="text-xl font-bold text-gray-900">{format(eventDate, 'dd')}</div>
                        <div className="text-xs font-semibold text-purple-600 uppercase">{format(eventDate, 'MMM')}</div>
                      </div>
                      {!isUpcoming && (
                        <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
                          <span className="bg-white text-gray-700 px-4 py-2 rounded-full text-sm font-bold">Event Ended</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">{event.category}</span>
                        {isUpcoming && <span className="text-xs text-green-600 font-medium">{event.seats_available} seats left</span>}
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg mb-3 group-hover:text-purple-600 transition-colors">{event.title}</h3>
                      <p className="text-gray-500 text-sm mb-4 line-clamp-2">{event.description}</p>
                      <div className="space-y-2 text-sm text-gray-500 mb-5">
                        <div className="flex items-center space-x-2"><Clock className="w-4 h-4 text-purple-500" /><span>{format(eventDate, 'EEEE, MMMM dd, yyyy')}</span></div>
                        <div className="flex items-center space-x-2"><Clock className="w-4 h-4 text-purple-500" /><span>{format(eventDate, 'h:mm a')}</span></div>
                        <div className="flex items-center space-x-2"><MapPin className="w-4 h-4 text-red-500" /><span>{event.location}</span></div>
                      </div>
                      {isUpcoming ? (
                        <button onClick={() => { setSelectedEvent(event); setRegistered(false); setForm({ name: '', email: '', phone: '', attendees: '1' }); }} className="w-full py-3 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-purple-800 transition-all">
                          Register Now
                        </button>
                      ) : (
                        <button disabled className="w-full py-3 bg-gray-100 text-gray-400 rounded-xl font-semibold cursor-not-allowed">
                          Event Ended
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Registration Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {registered ? (
              <div className="p-10 text-center">
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 mb-3">You're Registered!</h2>
                <p className="text-gray-600 mb-2">Successfully registered for:</p>
                <p className="font-bold text-purple-600 mb-6">{selectedEvent.title}</p>
                <p className="text-gray-500 text-sm mb-8">A confirmation email has been sent to {form.email}. We look forward to seeing you there!</p>
                <button onClick={() => setSelectedEvent(null)} className="w-full py-3 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-xl font-semibold">
                  Close
                </button>
              </div>
            ) : (
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Register for Event</h2>
                  <button onClick={() => setSelectedEvent(null)} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 mb-6">
                  <h3 className="font-bold text-purple-900 mb-1">{selectedEvent.title}</h3>
                  <p className="text-purple-700 text-sm">{format(new Date(selectedEvent.date), 'EEEE, MMMM dd, yyyy • h:mm a')}</p>
                  <p className="text-purple-600 text-sm">📍 {selectedEvent.location}</p>
                </div>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                    <input required type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                    <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                    <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Attendees</label>
                    <select value={form.attendees} onChange={e => setForm({ ...form, attendees: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none">
                      {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} {n === 1 ? 'person' : 'people'}</option>)}
                    </select>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setSelectedEvent(null)} className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all">
                      Cancel
                    </button>
                    <button type="submit" disabled={registering} className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-purple-800 transition-all disabled:opacity-70 flex items-center justify-center space-x-2">
                      {registering ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div><span>Processing...</span></> : <span>Confirm Registration</span>}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
