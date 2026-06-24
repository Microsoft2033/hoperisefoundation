

import React, { useState, useEffect, useCallback } from 'react';
import {
  Calendar, MapPin, Clock,
  CheckCircle, Loader2, Users
} from 'lucide-react';
import { format, isPast, isFuture } from 'date-fns';
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

interface RegistrationForm {
  name: string;
  email: string;
  phone: string;
  attendees: string;
}

// ============================================================
// CONSTANTS
// ============================================================

const emptyForm: RegistrationForm = {
  name: '',
  email: '',
  phone: '',
  attendees: '1',
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

const categoryLabels: Record<string, string> = {
  fundraiser:  'Fundraiser',
  workshop:    'Workshop',
  seminar:     'Seminar',
  community:   'Community',
  volunteer:   'Volunteer',
  awareness:   'Awareness',
  other:       'Other',
};

const FILTER_OPTIONS = [
  { id: 'upcoming', label: '🔜 Upcoming'    },
  { id: 'past',     label: '📅 Past Events' },
  { id: 'all',      label: '🗓️ All Events'  },
];

// ============================================================
// SKELETON LOADER
// ============================================================

const EventCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
    <div className="h-52 bg-gray-200" />
    <div className="p-6 space-y-3">
      <div className="flex justify-between">
        <div className="h-5 bg-gray-200 rounded-full w-24" />
        <div className="h-5 bg-gray-200 rounded w-20" />
      </div>
      <div className="h-6 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-5/6" />
      <div className="space-y-2 mt-2">
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-2/5" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
      <div className="h-11 bg-gray-200 rounded-xl mt-2" />
    </div>
  </div>
);

// ============================================================
// SUCCESS MODAL CONTENT
// ============================================================

const RegistrationSuccess: React.FC<{
  event: Event;
  email: string;
  attendees: number;
  onClose: () => void;
}> = ({ event, email, attendees, onClose }) => (
  <div className="p-10 text-center">
    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
      <CheckCircle className="w-10 h-10 text-green-500" />
    </div>
    <h2 className="text-2xl font-bold text-gray-900 mb-3">You're Registered!</h2>
    <p className="text-gray-600 mb-1">Successfully registered for:</p>
    <p className="font-bold text-purple-600 mb-4">{event.title}</p>

    <div className="bg-purple-50 rounded-xl p-4 mb-6 text-left space-y-2">
      <div className="flex items-center gap-2 text-sm text-purple-700">
        <Calendar className="w-4 h-4" />
        <span>{format(new Date(event.date), 'EEEE, MMMM dd, yyyy • h:mm a')}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-purple-700">
        <MapPin className="w-4 h-4" />
        <span>{event.location}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-purple-700">
        <Users className="w-4 h-4" />
        <span>{attendees} {attendees === 1 ? 'attendee' : 'attendees'}</span>
      </div>
    </div>

    <p className="text-gray-500 text-sm mb-8">
      A confirmation email has been sent to{' '}
      <span className="font-medium text-indigo-600">{email}</span>.
      We look forward to seeing you there!
    </p>
    <button
      onClick={onClose}
      className="w-full py-3 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-purple-800 transition-all"
    >
      Close
    </button>
  </div>
);

// ============================================================
// MAIN COMPONENT
// ============================================================

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [registered, setRegistered] = useState(false);
  const [filter, setFilter] = useState('upcoming');
  const [form, setForm] = useState<RegistrationForm>(emptyForm);

  // ============================================================
  // FETCH ACTIVE EVENTS
  // ============================================================
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_active', true)
        .order('date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (err) {
      console.error('Error fetching events:', err);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // ============================================================
  // FILTERED EVENTS
  // ============================================================
  const filteredEvents = events.filter(e => {
    const eventDate = new Date(e.date);
    if (filter === 'upcoming') return isFuture(eventDate);
    if (filter === 'past')     return isPast(eventDate);
    return true;
  });

  // ============================================================
  // OPEN REGISTRATION MODAL
  // ============================================================
  const handleOpenModal = (event: Event) => {
    setSelectedEvent(event);
    setRegistered(false);
    setForm(emptyForm);
  };

  // ============================================================
  // CLOSE MODAL
  // ============================================================
  const handleCloseModal = () => {
    setSelectedEvent(null);
    setRegistered(false);
    setForm(emptyForm);
  };

  // ============================================================
  // REGISTER FOR EVENT
  // ============================================================
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    const attendeesCount = parseInt(form.attendees);

    // Check seat availability
    if (attendeesCount > selectedEvent.seats_available) {
      toast.error(
        `Only ${selectedEvent.seats_available} seat${
          selectedEvent.seats_available === 1 ? '' : 's'
        } remaining`
      );
      return;
    }

    setRegistering(true);

    try {
      // Insert registration
      const { error: regError } = await supabase
        .from('event_registrations')
        .insert([
          {
            event_id:  selectedEvent.id,
            name:      form.name.trim(),
            email:     form.email.trim().toLowerCase(),
            phone:     form.phone.trim(),
            attendees: attendeesCount,
          },
        ]);

      if (regError) throw regError;

      // Decrement seats_available
      const { error: updateError } = await supabase
        .from('events')
        .update({
          seats_available: selectedEvent.seats_available - attendeesCount,
        })
        .eq('id', selectedEvent.id);

      if (updateError) throw updateError;

      // Update local state to reflect new seat count
      setEvents(prev =>
        prev.map(ev =>
          ev.id === selectedEvent.id
            ? { ...ev, seats_available: ev.seats_available - attendeesCount }
            : ev
        )
      );

      setRegistered(true);
      toast.success('Successfully registered for the event! 🎉');
    } catch (err: any) {
      console.error('Error registering for event:', err);
      toast.error(
        err.message || 'Registration failed. Please try again.'
      );
    } finally {
      setRegistering(false);
    }
  };

  // ============================================================
  // STATS
  // ============================================================
  const upcomingCount = events.filter(e => isFuture(new Date(e.date))).length;
  const pastCount     = events.filter(e => isPast(new Date(e.date))).length;

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-800 to-purple-600 py-28 pt-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Calendar className="w-14 h-14 text-white mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-white font-serif mb-4">
            Events & Gatherings
          </h1>
          <p className="text-purple-100 text-lg max-w-2xl mx-auto">
            Join us at our events to connect, learn, and make a collective impact
            in our communities.
          </p>

          {/* Quick Stats */}
          {!loading && (
            <div className="mt-8 flex justify-center gap-6">
              <div className="bg-white/10 rounded-xl px-6 py-3 backdrop-blur">
                <div className="text-white font-bold text-xl">{upcomingCount}</div>
                <div className="text-purple-200 text-xs">Upcoming Events</div>
              </div>
              <div className="bg-white/10 rounded-xl px-6 py-3 backdrop-blur">
                <div className="text-white font-bold text-xl">{events.length}</div>
                <div className="text-purple-200 text-xs">Total Events</div>
              </div>
              <div className="bg-white/10 rounded-xl px-6 py-3 backdrop-blur">
                <div className="text-white font-bold text-xl">{pastCount}</div>
                <div className="text-purple-200 text-xs">Past Events</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-center gap-3">
          {FILTER_OPTIONS.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-all border-2 ${
                filter === f.id
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {f.label}
              {!loading && (
                <span className="ml-1 text-xs opacity-60">
                  ({f.id === 'upcoming' ? upcomingCount : f.id === 'past' ? pastCount : events.length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Loading */}
          {loading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <EventCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && filteredEvents.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">
                No {filter !== 'all' ? filter : ''} events found
              </h3>
              <p className="text-gray-400 text-sm">
                {filter === 'upcoming'
                  ? 'Check back soon for upcoming events!'
                  : filter === 'past'
                  ? 'No past events to display.'
                  : 'No events available at this time.'}
              </p>
              {filter !== 'all' && (
                <button
                  onClick={() => setFilter('all')}
                  className="mt-4 px-5 py-2 bg-purple-50 text-purple-600 rounded-xl font-semibold hover:bg-purple-100 transition-colors text-sm"
                >
                  View All Events
                </button>
              )}
            </div>
          )}

          {/* Events Cards */}
          {!loading && filteredEvents.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map(event => {
                const eventDate  = new Date(event.date);
                const isUpcoming = isFuture(eventDate);
                const isFull     = event.seats_available <= 0;
                const seatsLabel =
                  isFull
                    ? '🔴 Full'
                    : event.seats_available <= 10
                    ? `⚠️ ${event.seats_available} left`
                    : `✅ ${event.seats_available} seats`;

                return (
                  <div
                    key={event.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
                  >
                    {/* Image */}
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={e => {
                          (e.target as HTMLImageElement).src =
                            'https://via.placeholder.com/600x300?text=Event';
                        }}
                      />

                      {/* Date Badge */}
                      <div className="absolute top-4 right-4 bg-white rounded-xl px-3 py-2 text-center shadow-md">
                        <div className="text-xl font-bold text-gray-900">
                          {format(eventDate, 'dd')}
                        </div>
                        <div className="text-xs font-semibold text-purple-600 uppercase">
                          {format(eventDate, 'MMM')}
                        </div>
                      </div>

                      {/* Past Event Overlay */}
                      {!isUpcoming && (
                        <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
                          <span className="bg-white text-gray-700 px-4 py-2 rounded-full text-sm font-bold">
                            Event Ended
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          categoryColors[event.category] || 'bg-gray-50 text-gray-700'
                        }`}>
                          {categoryLabels[event.category] || event.category}
                        </span>
                        {isUpcoming && (
                          <span className={`text-xs font-medium ${
                            isFull
                              ? 'text-red-500'
                              : event.seats_available <= 10
                              ? 'text-orange-500'
                              : 'text-green-600'
                          }`}>
                            {seatsLabel}
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-gray-900 text-lg mb-3 group-hover:text-purple-600 transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                        {event.description}
                      </p>

                      <div className="space-y-2 text-sm text-gray-500 mb-5">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-purple-500 flex-shrink-0" />
                          <span>{format(eventDate, 'EEEE, MMMM dd, yyyy')}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-purple-500 flex-shrink-0" />
                          <span>{format(eventDate, 'h:mm a')}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      </div>

                      {/* Seats Progress Bar */}
                      {isUpcoming && (
                        <div className="mb-4">
                          <div className="w-full bg-gray-100 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full transition-all ${
                                isFull ? 'bg-red-400' : 'bg-purple-500'
                              }`}
                              style={{
                                width: `${Math.max(
                                  0,
                                  Math.min(100, (event.seats_available / 100) * 100)
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {/* CTA Button */}
                      {isUpcoming && !isFull ? (
                        <button
                          onClick={() => handleOpenModal(event)}
                          className="w-full py-3 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-purple-800 transition-all"
                        >
                          Register Now
                        </button>
                      ) : isUpcoming && isFull ? (
                        <button
                          disabled
                          className="w-full py-3 bg-red-50 text-red-400 rounded-xl font-semibold cursor-not-allowed"
                        >
                          Fully Booked
                        </button>
                      ) : (
                        <button
                          disabled
                          className="w-full py-3 bg-gray-100 text-gray-400 rounded-xl font-semibold cursor-not-allowed"
                        >
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
              <RegistrationSuccess
                event={selectedEvent}
                email={form.email}
                attendees={parseInt(form.attendees)}
                onClose={handleCloseModal}
              />
            ) : (
              <div className="p-8">
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Register for Event
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ✕
                  </button>
                </div>

                {/* Event Summary */}
                <div className="bg-purple-50 rounded-xl p-4 mb-6 border border-purple-100">
                  <h3 className="font-bold text-purple-900 mb-2">
                    {selectedEvent.title}
                  </h3>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-purple-700 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {format(new Date(selectedEvent.date), 'EEEE, MMMM dd, yyyy • h:mm a')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-700 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedEvent.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-700 text-sm">
                      <Users className="w-4 h-4" />
                      <span>
                        {selectedEvent.seats_available} seat
                        {selectedEvent.seats_available !== 1 ? 's' : ''} remaining
                      </span>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      required
                      type="text"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                      placeholder="John Doe"
                      disabled={registering}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                      placeholder="john@example.com"
                      disabled={registering}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number{' '}
                      <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                      placeholder="+1 (555) 000-0000"
                      disabled={registering}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Number of Attendees
                    </label>
                    <select
                      value={form.attendees}
                      onChange={e => setForm({ ...form, attendees: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                      disabled={registering}
                    >
                      {Array.from(
                        { length: Math.min(5, selectedEvent.seats_available) },
                        (_, i) => i + 1
                      ).map(n => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? 'person' : 'people'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      disabled={registering}
                      className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={registering}
                      className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-purple-800 transition-all disabled:opacity-70 flex items-center justify-center space-x-2"
                    >
                      {registering ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <span>Confirm Registration</span>
                      )}
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