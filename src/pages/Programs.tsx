

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, Users, MapPin, Calendar, Loader2 } from 'lucide-react';
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

// ============================================================
// CONSTANTS
// ============================================================

const CATEGORY_ENUM_KEYS = [
  'education',
  'health',
  'environment',
  'community',
  'empowerment',
  'relief',
  'other',
];

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
  education:    'bg-blue-100 text-blue-700 border-blue-200',
  health:       'bg-red-100 text-red-700 border-red-200',
  environment:  'bg-green-100 text-green-700 border-green-200',
  community:    'bg-orange-100 text-orange-700 border-orange-200',
  empowerment:  'bg-purple-100 text-purple-700 border-purple-200',
  relief:       'bg-cyan-100 text-cyan-700 border-cyan-200',
  other:        'bg-gray-100 text-gray-700 border-gray-200',
};

const statusColors: Record<string, string> = {
  planned:    'bg-yellow-500 text-white',
  active:     'bg-green-500 text-white',
  paused:     'bg-orange-400 text-white',
  completed:  'bg-blue-500 text-white',
  cancelled:  'bg-red-500 text-white',
};

const statusEmojis: Record<string, string> = {
  planned:    '📋',
  active:     '🟢',
  paused:     '⏸️',
  completed:  '✅',
  cancelled:  '❌',
};

// ============================================================
// SKELETON LOADER
// ============================================================

const ProgramCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
    <div className="h-56 bg-gray-200" />
    <div className="p-6 space-y-3">
      <div className="h-6 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-5/6" />
      <div className="h-4 bg-gray-200 rounded w-4/6" />
      <div className="space-y-2 mt-4">
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
      <div className="h-10 bg-gray-200 rounded-lg mt-4" />
    </div>
  </div>
);

// ============================================================
// MAIN COMPONENT
// ============================================================

const Programs: React.FC = () => {
  const [searchParams] = useSearchParams();

  const [programs, setPrograms]           = useState<Program[]>([]);
  const [filteredPrograms, setFiltered]   = useState<Program[]>([]);
  const [loading, setLoading]             = useState(true);
  const [search, setSearch]               = useState('');
  const [category, setCategory]           = useState(
    searchParams.get('category') || 'all'
  );
  const [status, setStatus]               = useState('all');

  // ============================================================
  // FETCH PROGRAMS FROM SUPABASE
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
    } catch (err) {
      console.error('Error fetching programs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  // ============================================================
  // CLIENT-SIDE FILTERING
  // ============================================================
  useEffect(() => {
    let result = [...programs];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        p =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q)
      );
    }

    if (category !== 'all') {
      result = result.filter(p => p.category === category);
    }

    if (status !== 'all') {
      result = result.filter(p => p.status === status);
    }

    setFiltered(result);
  }, [programs, search, category, status]);

  // ============================================================
  // COMPUTED STATS (from all programs, not just filtered)
  // ============================================================
  const activePrograms      = programs.filter(p => p.status === 'active').length;
  const totalBeneficiaries  = programs
    .filter(p => p.status === 'active')
    .reduce((sum, p) => sum + (p.beneficiaries || 0), 0);

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <section className="relative py-28 bg-gradient-to-br from-blue-900 to-blue-700 pt-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full mb-6">
            Our Programs
          </div>
          <h1 className="text-5xl font-bold text-white font-serif mb-6">
            Transforming Communities<br />One Program at a Time
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-10">
            Explore our comprehensive programs designed to address the root causes
            of poverty and empower communities toward self-sufficiency.
          </p>

          {/* Live Stats from Supabase */}
          <div className="grid grid-cols-3 gap-6 max-w-md mx-auto">
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
              <div className="text-white font-bold text-2xl">
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                ) : (
                  activePrograms
                )}
              </div>
              <div className="text-blue-200 text-xs">Active Programs</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
              <div className="text-white font-bold text-2xl">
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                ) : totalBeneficiaries >= 1000 ? (
                  `${(totalBeneficiaries / 1000).toFixed(0)}K+`
                ) : (
                  totalBeneficiaries.toLocaleString()
                )}
              </div>
              <div className="text-blue-200 text-xs">Beneficiaries</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
              <div className="text-white font-bold text-2xl">30+</div>
              <div className="text-blue-200 text-xs">Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search programs by name, description or location..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap items-center">
              <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <button
                onClick={() => setCategory('all')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border-2 ${
                  category === 'all'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                All
                {!loading && (
                  <span className="ml-1 text-xs opacity-60">
                    ({programs.length})
                  </span>
                )}
              </button>
              {CATEGORY_ENUM_KEYS.map(cat => {
                const count = programs.filter(p => p.category === cat).length;
                if (count === 0) return null;
                return (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border-2 ${
                      category === cat
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {categoryLabels[cat]}
                    {!loading && (
                      <span className="ml-1 text-xs opacity-60">({count})</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Status Filter */}
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-sm"
            >
              <option value="all">All Status</option>
              <option value="planned">Planned</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Showing Count */}
          {!loading && (search || category !== 'all' || status !== 'all') && (
            <p className="text-xs text-gray-500 mt-2">
              Showing{' '}
              <span className="font-semibold text-gray-700">
                {filteredPrograms.length}
              </span>{' '}
              of{' '}
              <span className="font-semibold text-gray-700">
                {programs.length}
              </span>{' '}
              programs
            </p>
          )}
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Skeleton */}
          {loading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProgramCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredPrograms.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">
                No programs found
              </h3>
              <p className="text-gray-500 mb-4">
                {search || category !== 'all' || status !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'No programs have been added yet'}
              </p>
              {(search || category !== 'all' || status !== 'all') && (
                <button
                  onClick={() => {
                    setSearch('');
                    setCategory('all');
                    setStatus('all');
                  }}
                  className="px-5 py-2 bg-blue-50 text-blue-600 rounded-xl font-semibold hover:bg-blue-100 transition-colors text-sm"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}

          {/* Program Cards */}
          {!loading && filteredPrograms.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPrograms.map(program => {
                const progressPct = Math.min(
                  100,
                  ((program.beneficiaries || 0) / 15000) * 100
                );

                return (
                  <div
                    key={program.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
                  >
                    {/* Image */}
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={program.image}
                        alt={program.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={e => {
                          (e.target as HTMLImageElement).src =
                            'https://via.placeholder.com/600x300?text=Program';
                        }}
                      />

                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${
                          categoryColors[program.category] ||
                          'bg-gray-100 text-gray-700 border-gray-200'
                        }`}>
                          {categoryLabels[program.category] || program.category}
                        </span>
                      </div>

                      {/* Status Badge */}
                      <div className="absolute top-4 right-4">
                        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full capitalize ${
                          statusColors[program.status] || 'bg-gray-500 text-white'
                        }`}>
                          {statusEmojis[program.status] || ''} {program.status}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                        {program.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-5 line-clamp-3">
                        {program.description}
                      </p>

                      {/* Meta */}
                      <div className="space-y-2 text-sm text-gray-500 mb-5">
                        {program.location && (
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
                            <span className="truncate">{program.location}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>
                            {(program.beneficiaries || 0).toLocaleString()} beneficiaries served
                          </span>
                        </div>
                        {program.start_date && (
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-orange-500 flex-shrink-0" />
                            <span>
                              Started {new Date(program.start_date).getFullYear()}
                              {program.end_date && (
                                <span className="text-gray-400">
                                  {' '}→ {new Date(program.end_date).getFullYear()}
                                </span>
                              )}
                              {!program.end_date && program.status === 'active' && (
                                <span className="text-green-500"> (Ongoing)</span>
                              )}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Impact Progress */}
                      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex-1 mr-4">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Impact Progress</span>
                            <span>{Math.round(progressPct)}%</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                        </div>
                        <Link
                          to="/donate"
                          className="flex-shrink-0 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-600 hover:text-white transition-colors"
                        >
                          Support →
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Impact Summary */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white font-serif mb-10">
            Collective Impact Across All Programs
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                value: loading ? '...' : `${totalBeneficiaries.toLocaleString()}+`,
                label: 'Total Beneficiaries',
              },
              {
                value: loading ? '...' : programs.length.toString(),
                label: 'Total Programs',
              },
              {
                value: '30+',
                label: 'Countries',
              },
              {
                value: '$2M+',
                label: 'Invested',
              },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-blue-200 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Programs;