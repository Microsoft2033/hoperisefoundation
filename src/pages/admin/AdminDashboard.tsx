

import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, HandHeart, MessageSquare, Mail,
  TrendingUp, Calendar, DollarSign, Activity, Loader2
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

// ============================================================
// TYPES
// ============================================================

interface Donor {
  id: string;
  created_at: string;
  name: string;
  amount: number;
  program: string | null;
  donation_type: string;
  status: string;
}

interface Volunteer {
  id: string;
  created_at: string;
  name: string;
  program: string;
  location: string;
  status: string;
}

interface ContactMessage {
  id: string;
  created_at: string;
  name: string;
  email: string;
  subject: string;
  status: string;
}

interface DashboardStats {
  totalDonationAmount: number;
  totalDonors: number;
  totalVolunteers: number;
  pendingVolunteers: number;
  newsletterCount: number;
  totalMessages: number;
  unreadMessages: number;
  totalEvents: number;
}

// ============================================================
// CONSTANTS
// ============================================================

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const emptyStats: DashboardStats = {
  totalDonationAmount: 0,
  totalDonors: 0,
  totalVolunteers: 0,
  pendingVolunteers: 0,
  newsletterCount: 0,
  totalMessages: 0,
  unreadMessages: 0,
  totalEvents: 0,
};

// ============================================================
// COMPONENT
// ============================================================

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState<DashboardStats>(emptyStats);
  const [recentDonors, setRecentDonors] = useState<Donor[]>([]);
  const [recentVolunteers, setRecentVolunteers] = useState<Volunteer[]>([]);
  const [unreadMessages, setUnreadMessages] = useState<ContactMessage[]>([]);
  const [monthlyChartData, setMonthlyChartData] = useState<{ month: string; amount: number }[]>([]);
  const [programChartData, setProgramChartData] = useState<{ name: string; value: number }[]>([]);
  const [volunteerPieData, setVolunteerPieData] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  // ============================================================
  // FETCH ALL DASHBOARD DATA IN PARALLEL
  // ============================================================
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      // 🚀 Run all queries in parallel for maximum performance
      const [
        donorsRes,
        volunteersRes,
        messagesRes,
        newsletterRes,
        eventsRes,
      ] = await Promise.all([
        supabase
          .from('donors')
          .select('id, created_at, name, amount, program, donation_type, status')
          .order('created_at', { ascending: false }),

        supabase
          .from('volunteers')
          .select('id, created_at, name, program, location, status')
          .order('created_at', { ascending: false }),

        supabase
          .from('contact_messages')
          .select('id, created_at, name, email, subject, status')
          .order('created_at', { ascending: false }),

        supabase
          .from('newsletter_subscribers')
          .select('id', { count: 'exact', head: true }),

        supabase
          .from('events')
          .select('id', { count: 'exact', head: true }),
      ]);

      // Check for errors
      if (donorsRes.error) throw donorsRes.error;
      if (volunteersRes.error) throw volunteersRes.error;
      if (messagesRes.error) throw messagesRes.error;
      if (newsletterRes.error) throw newsletterRes.error;
      if (eventsRes.error) throw eventsRes.error;

      const donors = donorsRes.data || [];
      const volunteers = volunteersRes.data || [];
      const messages = messagesRes.data || [];
      const newsletterCount = newsletterRes.count || 0;
      const eventsCount = eventsRes.count || 0;

      // --------------------------------------------------------
      // Compute Stats
      // --------------------------------------------------------
      const totalDonationAmount = donors.reduce((sum, d) => sum + (d.amount || 0), 0);
      const pendingVolunteers = volunteers.filter(v => v.status === 'pending').length;
      const unreadCount = messages.filter(m => m.status === 'unread').length;

      setStats({
        totalDonationAmount,
        totalDonors: donors.length,
        totalVolunteers: volunteers.length,
        pendingVolunteers,
        newsletterCount,
        totalMessages: messages.length,
        unreadMessages: unreadCount,
        totalEvents: eventsCount,
      });

      // --------------------------------------------------------
      // Recent Data (top 5)
      // --------------------------------------------------------
      setRecentDonors(donors.slice(0, 5));
      setRecentVolunteers(volunteers.slice(0, 5));
      setUnreadMessages(messages.filter(m => m.status === 'unread').slice(0, 3));

      // --------------------------------------------------------
      // Monthly Donations Chart
      // --------------------------------------------------------
      const monthlyMap = donors.reduce<Record<string, number>>((acc, d) => {
        const month = format(new Date(d.created_at), 'MMM');
        acc[month] = (acc[month] || 0) + d.amount;
        return acc;
      }, {});
      setMonthlyChartData(
        Object.entries(monthlyMap).map(([month, amount]) => ({ month, amount }))
      );

      // --------------------------------------------------------
      // Donations by Program Chart
      // --------------------------------------------------------
      const programMap = donors.reduce<Record<string, number>>((acc, d) => {
        const key = d.program || 'General';
        acc[key] = (acc[key] || 0) + d.amount;
        return acc;
      }, {});
      setProgramChartData(
        Object.entries(programMap).map(([name, value]) => ({
          name: name.split(' ')[0],
          value,
        }))
      );

      // --------------------------------------------------------
      // Volunteer Distribution Pie Chart
      // --------------------------------------------------------
      const volunteerMap = volunteers.reduce<Record<string, number>>((acc, v) => {
        acc[v.program] = (acc[v.program] || 0) + 1;
        return acc;
      }, {});
      setVolunteerPieData(
        Object.entries(volunteerMap).map(([name, value]) => ({ name, value }))
      );

    } catch (err: any) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // ============================================================
  // STAT CARDS CONFIG
  // ============================================================
  const statCards = [
    {
      title: 'Total Donations',
      value: `$${stats.totalDonationAmount.toLocaleString()}`,
      icon: <DollarSign className="w-6 h-6" />,
      color: 'bg-green-500',
      change: `${stats.totalDonors} donors`,
      path: '/admin/donations',
    },
    {
      title: 'Total Donors',
      value: stats.totalDonors.toString(),
      icon: <HandHeart className="w-6 h-6" />,
      color: 'bg-blue-500',
      change: 'All time',
      path: '/admin/donations',
    },
    {
      title: 'Volunteers',
      value: stats.totalVolunteers.toString(),
      icon: <Users className="w-6 h-6" />,
      color: 'bg-purple-500',
      change: `${stats.pendingVolunteers} pending`,
      path: '/admin/volunteers',
    },
    {
      title: 'Newsletter Subs',
      value: stats.newsletterCount.toString(),
      icon: <Mail className="w-6 h-6" />,
      color: 'bg-orange-500',
      change: 'Subscribers',
      path: '/admin/newsletter',
    },
    {
      title: 'Messages',
      value: stats.totalMessages.toString(),
      icon: <MessageSquare className="w-6 h-6" />,
      color: 'bg-red-500',
      change: `${stats.unreadMessages} unread`,
      path: '/admin/messages',
    },
    {
      title: 'Events',
      value: stats.totalEvents.toString(),
      icon: <Calendar className="w-6 h-6" />,
      color: 'bg-teal-500',
      change: 'Total events',
      path: '/admin/events',
    },
  ];

  // ============================================================
  // LOADING STATE
  // ============================================================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-3">
          <Loader2 className="w-10 h-10 text-green-500 animate-spin mx-auto" />
          <p className="text-gray-500 text-sm">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="p-6 space-y-6 max-w-[1400px]">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500 text-sm">
            Welcome back, {user?.name || 'Admin'}! Here's what's happening with HopeRise Foundation.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-500">
            {format(new Date(), 'EEEE, MMMM dd, yyyy')}
          </div>
          {/* Refresh Button */}
          <button
            onClick={fetchDashboardData}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh data"
          >
            <Activity className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card) => (
          <Link
            key={card.title}
            to={card.path}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all hover:border-gray-200 group"
          >
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
        {/* Monthly Donations Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-gray-900">Donations Over Time</h2>
              <p className="text-gray-500 text-xs">Monthly donation amounts</p>
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          {monthlyChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `$${v}`} />
                <Tooltip formatter={(v) => [`$${Number(v).toLocaleString()}`, 'Amount']} />
                <Bar dataKey="amount" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-gray-400 text-sm">
              No donation data available yet
            </div>
          )}
        </div>

        {/* Volunteer Distribution Pie Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-gray-900">Volunteer Distribution</h2>
              <p className="text-gray-500 text-xs">By program</p>
            </div>
            <Activity className="w-5 h-5 text-blue-500" />
          </div>
          {volunteerPieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={volunteerPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    dataKey="value"
                  >
                    {volunteerPieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-3 space-y-1">
                {volunteerPieData.slice(0, 3).map((item, i) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: COLORS[i % COLORS.length] }}
                      />
                      <span className="text-gray-600 truncate">{item.name}</span>
                    </div>
                    <span className="font-medium text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-[150px] text-gray-400 text-sm">
              No volunteer data yet
            </div>
          )}
        </div>
      </div>

      {/* Donations by Program Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="font-bold text-gray-900 mb-6">Donations by Program</h2>
        {programChartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={programChartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={v => `$${v}`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} />
              <Tooltip formatter={(v) => [`$${Number(v).toLocaleString()}`, 'Donated']} />
              <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[200px] text-gray-400 text-sm">
            No program donation data yet
          </div>
        )}
      </div>

      {/* Recent Activity Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Donations */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Recent Donations</h2>
            <Link to="/admin/donations" className="text-green-600 text-sm font-medium hover:text-green-700">
              View All
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentDonors.length > 0 ? recentDonors.map((donor) => (
              <div key={donor.id} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-sm">
                    {donor.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{donor.name}</p>
                    <p className="text-gray-400 text-xs">
                      {donor.program || 'General'} • {format(new Date(donor.created_at), 'MMM dd')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">${donor.amount.toLocaleString()}</p>
                  <p className="text-xs text-gray-400 capitalize">{donor.donation_type}</p>
                </div>
              </div>
            )) : (
              <div className="py-8 text-center text-gray-400 text-sm">No donations yet</div>
            )}
          </div>
        </div>

        {/* Recent Volunteers */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Recent Volunteer Applications</h2>
            <Link to="/admin/volunteers" className="text-green-600 text-sm font-medium hover:text-green-700">
              View All
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentVolunteers.length > 0 ? recentVolunteers.map((vol) => (
              <div key={vol.id} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm">
                    {vol.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{vol.name}</p>
                    <p className="text-gray-400 text-xs">{vol.program} • {vol.location}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  vol.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : vol.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {vol.status}
                </span>
              </div>
            )) : (
              <div className="py-8 text-center text-gray-400 text-sm">No volunteer applications yet</div>
            )}
          </div>
        </div>
      </div>

      {/* Unread Messages Alert */}
      {stats.unreadMessages > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-red-800">
                  Unread Messages ({stats.unreadMessages})
                </h3>
                <p className="text-red-600 text-xs">Requires your attention</p>
              </div>
            </div>
            <Link
              to="/admin/messages"
              className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
            >
              View Messages
            </Link>
          </div>

          {/* Preview unread messages */}
          {unreadMessages.length > 0 && (
            <div className="mt-4 space-y-2">
              {unreadMessages.map((msg) => (
                <div key={msg.id} className="flex items-center justify-between bg-white rounded-xl px-4 py-2 border border-red-100">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{msg.name}</p>
                    <p className="text-xs text-gray-500">{msg.subject}</p>
                  </div>
                  <p className="text-xs text-gray-400">
                    {format(new Date(msg.created_at), 'MMM dd')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;