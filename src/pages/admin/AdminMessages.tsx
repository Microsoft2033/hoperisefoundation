import React, { useEffect, useState } from 'react';
import { Search, Trash2 } from 'lucide-react';
import { db, ContactMessage } from '../../lib/mockDb';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const AdminMessages: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filtered, setFiltered] = useState<ContactMessage[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  useEffect(() => {
    const data = db.messages.getAll();
    setMessages(data);
    setFiltered(data);
  }, []);

  useEffect(() => {
    let result = messages;
    if (search) result = result.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase()) || m.subject.toLowerCase().includes(search.toLowerCase()));
    if (statusFilter !== 'all') result = result.filter(m => m.status === statusFilter);
    setFiltered(result);
  }, [messages, search, statusFilter]);

  const markAsRead = (id: string) => {
    db.messages.update(id, { status: 'read' });
    setMessages(db.messages.getAll());
    toast.success('Marked as read');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this message?')) {
      db.messages.delete(id);
      setMessages(db.messages.getAll());
      setSelected(null);
      toast.success('Message deleted');
    }
  };

  const handleView = (msg: ContactMessage) => {
    setSelected(msg);
    if (msg.status === 'unread') markAsRead(msg.id);
  };

  const unreadCount = messages.filter(m => m.status === 'unread').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
          <p className="text-gray-500 text-sm">{messages.length} total • <span className="text-red-500 font-medium">{unreadCount} unread</span></p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search messages..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none text-sm" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none text-sm">
          <option value="all">All Messages</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
        </select>
      </div>

      <div className="space-y-3">
        {filtered.map((msg) => (
          <div
            key={msg.id}
            className={`bg-white rounded-2xl p-5 shadow-sm border-l-4 cursor-pointer hover:shadow-md transition-all ${msg.status === 'unread' ? 'border-indigo-500' : 'border-gray-200'}`}
            onClick={() => handleView(msg)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${msg.status === 'unread' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>
                  {msg.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`font-semibold ${msg.status === 'unread' ? 'text-gray-900' : 'text-gray-600'}`}>{msg.name}</span>
                    {msg.status === 'unread' && <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>}
                    <span className="text-gray-400 text-xs">•</span>
                    <span className="text-gray-400 text-xs">{msg.email}</span>
                  </div>
                  <p className={`text-sm ${msg.status === 'unread' ? 'font-medium text-gray-800' : 'text-gray-600'}`}>{msg.subject}</p>
                  <p className="text-gray-500 text-xs mt-1 line-clamp-1">{msg.message}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-400 text-xs">{format(new Date(msg.created_at), 'MMM dd')}</span>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(msg.id); }} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="text-center py-12 bg-white rounded-2xl"><div className="text-4xl mb-3">💬</div><p className="text-gray-500">No messages found</p></div>}
      </div>

      {/* Message Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Message Details</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-gray-500 text-xs">From</p><p className="font-medium text-gray-900">{selected.name}</p></div>
                <div><p className="text-gray-500 text-xs">Email</p><p className="font-medium text-gray-900">{selected.email}</p></div>
                <div><p className="text-gray-500 text-xs">Subject</p><p className="font-medium text-gray-900">{selected.subject}</p></div>
                <div><p className="text-gray-500 text-xs">Date</p><p className="font-medium text-gray-900">{format(new Date(selected.created_at), 'MMM dd, yyyy')}</p></div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-500 text-xs mb-2">Message</p>
                <p className="text-gray-800 leading-relaxed">{selected.message}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`} className="flex-1 py-3 bg-indigo-500 text-white rounded-xl font-semibold text-center hover:bg-indigo-600 transition-colors">
                📧 Reply via Email
              </a>
              <button onClick={() => { handleDelete(selected.id); setSelected(null); }} className="px-4 py-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
              <button onClick={() => setSelected(null)} className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
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
