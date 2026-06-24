import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, HandHeart, MessageSquare, Mail, TrendingUp, Calendar, DollarSign, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { db, Donor, Volunteer, ContactMessage } from '../../lib/mockDb';
import { format } from 'date-fns';

const AdminDashboard: React.FC = () => {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [newsletterCount, setNewsletterCount] = useState(0);

  useEffect(() => {
    setDonors(db.donors.getAll());
    setVolunteers(db.volunteers.getAll());
    setMessages(db.messages.getAll());
    setNewsletterCount(db.newsletter.getAll().length);
  }, []);

  const totalDonations = db.donors.getTotalAmount();
  const unreadMessages = messages.filter(m => m.status === 'unread').length;
  const pendingVolunteers = volunteers.filter(v => v.status === 'pending').length;

  // Chart Data
  const donationsByProgram = donors.reduce<Record<string, number>>((acc, d) => {
    const key = d.program || 'General';
    acc[key] = (acc[key] || 0) + d.amount;
    return acc;
  }, {});

  const programChartData = Object.entries(donationsByProgram).map(([name, value]) => ({ name: name.split(' ')[0], value }));

  const monthlyDonations = donors.reduce<Record<string, number>>((acc, d) => {
    const month = format(new Date(d.created_at), 'MMM');
    acc[month] = (acc[month] || 0) + d.amount;
    return acc;
  }, {});

  const monthlyChartData = Object.entries(monthlyDonations).map(([month, amount]) => ({ month, amount }));

  const volunteersByProgram = volunteers.reduce<Record<string, number>>((acc, v) => {
    acc[v.program] = (acc[v.program] || 0) + 1;
    return acc;
  }, {});

  const volunteerPieData = Object.entries(volunteersByProgram).map(([name, value]) => ({ name, value }));
  const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  const statCards = [
    { title: 'Total Donations', value: `$${totalDonations.toLocaleString()}`, icon: <DollarSign className="w-6 h-6" />, color: 'bg-green-500', change: '+12%', path: '/admin/donations' },
    { title: 'Total Donors', value: donors.length.toString(), icon: <HandHeart className="w-6 h-6" />, color: 'bg-blue-500', change: '+8%', path: '/admin/donations' },
    { title: 'Volunteers', value: volunteers.length.toString(), icon: <Users className="w-6 h-6" />, color: 'bg-purple-500', change: `${pendingVolunteers} pending`, path: '/admin/volunteers' },
    { title: 'Newsletter Subs', value: newsletterCount.toString(), icon: <Mail className="w-6 h-6" />, color: 'bg-orange-500', change: '+5 this week', path: '/admin/newsletter' },
    { title: 'Messages', value: messages.length.toString(), icon: <MessageSquare className="w-6 h-6" />, color: 'bg-red-500', change: `${unreadMessages} unread`, path: '/admin/messages' },
    { title: 'Events', value: db.events.getAll().length.toString(), icon: <Calendar className="w-6 h-6" />, color: 'bg-teal-500', change: 'Active', path: '/admin/events' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500 text-sm">Welcome back! Here's what's happening with HopeRise Foundation.</p>
        </div>
        <div className="text-sm text-gray-500">
          {format(new Date(), 'EEEE, MMMM dd, yyyy')}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card) => (
          <Link key={card.title} to={card.path} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all hover:border-gray-200 group">
            <div className={`w-10 h-10 ${card.color} rounded-xl flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform`}>
              {card.icon}
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{card.value}</div>
            <div className="text-gray-500 text-xs mb-1">{card.title}</div>
            <div className="text-green-600 text-xs font-medium">{card.change}</div>
          </Link>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Donations by Month */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-gray-900">Donations Over Time</h2>
              <p className="text-gray-500 text-xs">Monthly donation amounts</p>
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `$${v}`} />
              <Tooltip formatter={(v) => [`$${Number(v).toLocaleString()}`, 'Amount']} />
              <Bar dataKey="amount" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Volunteer Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-gray-900">Volunteer Distribution</h2>
              <p className="text-gray-500 text-xs">By program</p>
            </div>
            <Activity className="w-5 h-5 text-blue-500" />
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={volunteerPieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value">
                {volunteerPieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-1">
            {volunteerPieData.slice(0, 3).map((item, i) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                  <span className="text-gray-600 truncate">{item.name}</span>
                </div>
                <span className="font-medium text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Donations by Program Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="font-bold text-gray-900 mb-6">Donations by Program</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={programChartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={v => `$${v}`} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} />
            <Tooltip formatter={(v) => [`$${Number(v).toLocaleString()}`, 'Donated']} />
            <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Activity Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Donations */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Recent Donations</h2>
            <Link to="/admin/donations" className="text-green-600 text-sm font-medium hover:text-green-700">View All</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {donors.slice(0, 5).map((donor) => (
              <div key={donor.id} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-sm">
                    {donor.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{donor.name}</p>
                    <p className="text-gray-400 text-xs">{donor.program || 'General'} • {format(new Date(donor.created_at), 'MMM dd')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">${donor.amount.toLocaleString()}</p>
                  <p className="text-xs text-gray-400 capitalize">{donor.donation_type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Volunteers */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Recent Volunteer Applications</h2>
            <Link to="/admin/volunteers" className="text-green-600 text-sm font-medium hover:text-green-700">View All</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {volunteers.slice(0, 5).map((vol) => (
              <div key={vol.id} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm">
                    {vol.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{vol.name}</p>
                    <p className="text-gray-400 text-xs">{vol.program} • {vol.location}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${vol.status === 'active' ? 'bg-green-100 text-green-700' : vol.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                  {vol.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Unread Messages */}
      {messages.filter(m => m.status === 'unread').length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-red-800">Unread Messages ({unreadMessages})</h3>
                <p className="text-red-600 text-xs">Requires your attention</p>
              </div>
            </div>
            <Link to="/admin/messages" className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors">
              View Messages
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
