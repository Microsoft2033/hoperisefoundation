// import React, { useEffect, useState } from 'react';
// import { Search, Trash2 } from 'lucide-react';
// import { db, ContactMessage } from '../../lib/mockDb';
// import { format } from 'date-fns';
// import toast from 'react-hot-toast';

// const AdminMessages: React.FC = () => {
//   const [messages, setMessages] = useState<ContactMessage[]>([]);
//   const [filtered, setFiltered] = useState<ContactMessage[]>([]);
//   const [search, setSearch] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [selected, setSelected] = useState<ContactMessage | null>(null);

//   useEffect(() => {
//     const data = db.messages.getAll();
//     setMessages(data);
//     setFiltered(data);
//   }, []);

//   useEffect(() => {
//     let result = messages;
//     if (search) result = result.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase()) || m.subject.toLowerCase().includes(search.toLowerCase()));
//     if (statusFilter !== 'all') result = result.filter(m => m.status === statusFilter);
//     setFiltered(result);
//   }, [messages, search, statusFilter]);

//   const markAsRead = (id: string) => {
//     db.messages.update(id, { status: 'read' });
//     setMessages(db.messages.getAll());
//     toast.success('Marked as read');
//   };

//   const handleDelete = (id: string) => {
//     if (window.confirm('Delete this message?')) {
//       db.messages.delete(id);
//       setMessages(db.messages.getAll());
//       setSelected(null);
//       toast.success('Message deleted');
//     }
//   };

//   const handleView = (msg: ContactMessage) => {
//     setSelected(msg);
//     if (msg.status === 'unread') markAsRead(msg.id);
//   };

//   const unreadCount = messages.filter(m => m.status === 'unread').length;

//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
//           <p className="text-gray-500 text-sm">{messages.length} total • <span className="text-red-500 font-medium">{unreadCount} unread</span></p>
//         </div>
//       </div>

//       <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//           <input type="text" placeholder="Search messages..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none text-sm" />
//         </div>
//         <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none text-sm">
//           <option value="all">All Messages</option>
//           <option value="unread">Unread</option>
//           <option value="read">Read</option>
//         </select>
//       </div>

//       <div className="space-y-3">
//         {filtered.map((msg) => (
//           <div
//             key={msg.id}
//             className={`bg-white rounded-2xl p-5 shadow-sm border-l-4 cursor-pointer hover:shadow-md transition-all ${msg.status === 'unread' ? 'border-indigo-500' : 'border-gray-200'}`}
//             onClick={() => handleView(msg)}
//           >
//             <div className="flex items-start justify-between">
//               <div className="flex items-start space-x-4">
//                 <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${msg.status === 'unread' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>
//                   {msg.name.charAt(0)}
//                 </div>
//                 <div>
//                   <div className="flex items-center space-x-2 mb-1">
//                     <span className={`font-semibold ${msg.status === 'unread' ? 'text-gray-900' : 'text-gray-600'}`}>{msg.name}</span>
//                     {msg.status === 'unread' && <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>}
//                     <span className="text-gray-400 text-xs">•</span>
//                     <span className="text-gray-400 text-xs">{msg.email}</span>
//                   </div>
//                   <p className={`text-sm ${msg.status === 'unread' ? 'font-medium text-gray-800' : 'text-gray-600'}`}>{msg.subject}</p>
//                   <p className="text-gray-500 text-xs mt-1 line-clamp-1">{msg.message}</p>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <span className="text-gray-400 text-xs">{format(new Date(msg.created_at), 'MMM dd')}</span>
//                 <button onClick={(e) => { e.stopPropagation(); handleDelete(msg.id); }} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
//               </div>
//             </div>
//           </div>
//         ))}
//         {filtered.length === 0 && <div className="text-center py-12 bg-white rounded-2xl"><div className="text-4xl mb-3">💬</div><p className="text-gray-500">No messages found</p></div>}
//       </div>

//       {/* Message Detail Modal */}
//       {selected && (
//         <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-xl font-bold text-gray-900">Message Details</h2>
//               <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
//             </div>
//             <div className="space-y-4 mb-6">
//               <div className="grid grid-cols-2 gap-4">
//                 <div><p className="text-gray-500 text-xs">From</p><p className="font-medium text-gray-900">{selected.name}</p></div>
//                 <div><p className="text-gray-500 text-xs">Email</p><p className="font-medium text-gray-900">{selected.email}</p></div>
//                 <div><p className="text-gray-500 text-xs">Subject</p><p className="font-medium text-gray-900">{selected.subject}</p></div>
//                 <div><p className="text-gray-500 text-xs">Date</p><p className="font-medium text-gray-900">{format(new Date(selected.created_at), 'MMM dd, yyyy')}</p></div>
//               </div>
//               <div className="bg-gray-50 rounded-xl p-4">
//                 <p className="text-gray-500 text-xs mb-2">Message</p>
//                 <p className="text-gray-800 leading-relaxed">{selected.message}</p>
//               </div>
//             </div>
//             <div className="flex gap-3">
//               <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`} className="flex-1 py-3 bg-indigo-500 text-white rounded-xl font-semibold text-center hover:bg-indigo-600 transition-colors">
//                 📧 Reply via Email
//               </a>
//               <button onClick={() => { handleDelete(selected.id); setSelected(null); }} className="px-4 py-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-colors">
//                 <Trash2 className="w-5 h-5" />
//               </button>
//               <button onClick={() => setSelected(null)} className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminMessages;

import React, { useEffect, useState, useCallback } from 'react';
import { Search, Trash2, Loader2, Mail, MailOpen, Archive } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';

// ============================================================
// TYPES
// ============================================================

interface ContactMessage {
  id: string;
  created_at: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
}

// ============================================================
// CONSTANTS
// ============================================================

const statusStyles: Record<string, string> = {
  unread:   'border-indigo-500',
  read:     'border-gray-200',
  replied:  'border-green-400',
  archived: 'border-gray-100',
};

const statusBadgeStyles: Record<string, string> = {
  unread:   'bg-indigo-100 text-indigo-700',
  read:     'bg-gray-100 text-gray-600',
  replied:  'bg-green-100 text-green-700',
  archived: 'bg-yellow-100 text-yellow-700',
};

const statusIcons: Record<string, React.ReactNode> = {
  unread:   <Mail className="w-3 h-3" />,
  read:     <MailOpen className="w-3 h-3" />,
  replied:  <Mail className="w-3 h-3" />,
  archived: <Archive className="w-3 h-3" />,
};

// ============================================================
// COMPONENT
// ============================================================

const AdminMessages: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filtered, setFiltered] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  // ============================================================
  // FETCH MESSAGES
  // ============================================================
  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (err: any) {
      console.error('Error fetching messages:', err);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // ============================================================
  // CLIENT-SIDE FILTERING
  // ============================================================
  useEffect(() => {
    let result = [...messages];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        m =>
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.subject.toLowerCase().includes(q) ||
          m.message.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter(m => m.status === statusFilter);
    }

    setFiltered(result);
  }, [messages, search, statusFilter]);

  // ============================================================
  // UPDATE STATUS
  // ============================================================
  const updateStatus = async (
    id: string,
    status: ContactMessage['status']
  ) => {
    try {
      setUpdatingId(id);

      const { error } = await supabase
        .from('contact_messages')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      // Update local state without refetching
      setMessages(prev =>
        prev.map(m => m.id === id ? { ...m, status } : m)
      );

      // Update selected modal if open
      if (selected?.id === id) {
        setSelected(prev => prev ? { ...prev, status } : null);
      }

      toast.success(`Message marked as ${status}`);
    } catch (err: any) {
      console.error('Error updating message status:', err);
      toast.error(err.message || 'Failed to update message status');
    } finally {
      setUpdatingId(null);
    }
  };

  // ============================================================
  // VIEW MESSAGE (auto-mark as read)
  // ============================================================
  const handleView = async (msg: ContactMessage) => {
    setSelected(msg);
    if (msg.status === 'unread') {
      await updateStatus(msg.id, 'read');
    }
  };

  // ============================================================
  // DELETE MESSAGE
  // ============================================================
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      setDeletingId(id);

      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMessages(prev => prev.filter(m => m.id !== id));
      if (selected?.id === id) setSelected(null);
      toast.success('Message deleted');
    } catch (err: any) {
      console.error('Error deleting message:', err);
      toast.error(err.message || 'Failed to delete message');
    } finally {
      setDeletingId(null);
    }
  };

  // ============================================================
  // COMPUTED STATS
  // ============================================================
  const unreadCount  = messages.filter(m => m.status === 'unread').length;
  const repliedCount = messages.filter(m => m.status === 'replied').length;
  const archivedCount = messages.filter(m => m.status === 'archived').length;

  // ============================================================
  // LOADING STATE
  // ============================================================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mx-auto" />
          <p className="text-gray-500 text-sm">Loading messages...</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
          <p className="text-gray-500 text-sm">
            {messages.length} total •{' '}
            <span className="text-red-500 font-medium">{unreadCount} unread</span>
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Messages', value: messages.length,  color: 'text-gray-700'   },
          { label: 'Unread',         value: unreadCount,      color: 'text-indigo-600' },
          { label: 'Replied',        value: repliedCount,     color: 'text-green-600'  },
          { label: 'Archived',       value: archivedCount,    color: 'text-yellow-600' },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
            <div className="text-gray-500 text-xs mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, subject or message..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none text-sm"
        >
          <option value="all">All Messages</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Messages List */}
      <div className="space-y-3">
        {filtered.map(msg => {
          const isDeleting = deletingId === msg.id;
          const isUpdating = updatingId === msg.id;

          return (
            <div
              key={msg.id}
              onClick={() => handleView(msg)}
              className={`bg-white rounded-2xl p-5 shadow-sm border-l-4 cursor-pointer hover:shadow-md transition-all ${
                statusStyles[msg.status] || 'border-gray-200'
              } ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1 min-w-0">
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${
                    msg.status === 'unread'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {msg.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2 mb-1">
                      <span className={`font-semibold ${
                        msg.status === 'unread' ? 'text-gray-900' : 'text-gray-600'
                      }`}>
                        {msg.name}
                      </span>
                      {/* Status Badge */}
                      <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                        statusBadgeStyles[msg.status]
                      }`}>
                        {statusIcons[msg.status]}
                        {msg.status}
                      </span>
                      <span className="text-gray-400 text-xs hidden sm:block">
                        {msg.email}
                      </span>
                    </div>
                    <p className={`text-sm ${
                      msg.status === 'unread'
                        ? 'font-medium text-gray-800'
                        : 'text-gray-600'
                    }`}>
                      {msg.subject}
                    </p>
                    <p className="text-gray-500 text-xs mt-1 line-clamp-1">
                      {msg.message}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                  <span className="text-gray-400 text-xs hidden sm:block">
                    {format(new Date(msg.created_at), 'MMM dd')}
                  </span>

                  {/* Archive Button */}
                  {msg.status !== 'archived' && (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        updateStatus(msg.id, 'archived');
                      }}
                      disabled={isUpdating}
                      className="p-1.5 text-yellow-500 hover:bg-yellow-50 rounded-lg transition-colors"
                      title="Archive message"
                    >
                      {isUpdating
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <Archive className="w-4 h-4" />
                      }
                    </button>
                  )}

                  {/* Delete Button */}
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      handleDelete(msg.id);
                    }}
                    disabled={isDeleting}
                    className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete message"
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

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <div className="text-4xl mb-3">💬</div>
            <p className="text-gray-600 font-medium">No messages found</p>
            <p className="text-gray-400 text-sm mt-1">
              {search || statusFilter !== 'all'
                ? 'Try adjusting your search or filter'
                : 'No contact messages yet'}
            </p>
          </div>
        )}
      </div>

      {/* Message Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Message Details</h2>
                <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium mt-1 ${
                  statusBadgeStyles[selected.status]
                }`}>
                  {statusIcons[selected.status]}
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

            {/* Message Info */}
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-xs mb-1">From</p>
                  <p className="font-medium text-gray-900">{selected.name}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">Email</p>
                  <p className="font-medium text-gray-900 text-sm break-all">{selected.email}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">Subject</p>
                  <p className="font-medium text-gray-900">{selected.subject}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">Date</p>
                  <p className="font-medium text-gray-900">
                    {format(new Date(selected.created_at), 'MMM dd, yyyy • HH:mm')}
                  </p>
                </div>
              </div>

              {/* Message Body */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-500 text-xs mb-2">Message</p>
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {selected.message}
                </p>
              </div>
            </div>

            {/* Status Actions */}
            <div className="flex flex-wrap gap-2 mb-4">
              {(['read', 'replied', 'archived'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => updateStatus(selected.id, status)}
                  disabled={selected.status === status || updatingId === selected.id}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-40 flex items-center gap-1 ${
                    statusBadgeStyles[status]
                  }`}
                >
                  {updatingId === selected.id
                    ? <Loader2 className="w-3 h-3 animate-spin" />
                    : statusIcons[status]
                  }
                  Mark as {status}
                </button>
              ))}
            </div>

            {/* Footer Actions */}
            <div className="flex gap-3">
              <a
                href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                onClick={() => updateStatus(selected.id, 'replied')}
                className="flex-1 py-3 bg-indigo-500 text-white rounded-xl font-semibold text-center hover:bg-indigo-600 transition-colors text-sm"
              >
                📧 Reply via Email
              </a>
              <button
                onClick={() => handleDelete(selected.id)}
                disabled={deletingId === selected.id}
                className="px-4 py-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-colors disabled:opacity-50"
              >
                {deletingId === selected.id
                  ? <Loader2 className="w-5 h-5 animate-spin" />
                  : <Trash2 className="w-5 h-5" />
                }
              </button>
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
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

export default AdminMessages;