import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Users, MapPin, Calendar } from 'lucide-react';
import { db, Program } from '../lib/mockDb';
import { Link } from 'react-router-dom';

const Programs: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [status, setStatus] = useState('All');

  const categories = ['All', 'Education', 'Healthcare', 'Water & Sanitation', 'Economic Empowerment', 'Environment', 'Digital Education'];

  useEffect(() => {
    const data = db.programs.getAll();
    setPrograms(data);
  }, []);

  useEffect(() => {
    let result = programs;
    if (search) result = result.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()));
    if (category !== 'All') result = result.filter(p => p.category === category);
    if (status !== 'All') result = result.filter(p => p.status === status.toLowerCase());
    setFilteredPrograms(result);
  }, [programs, search, category, status]);

  const categoryColors: Record<string, string> = {
    Education: 'bg-blue-100 text-blue-700 border-blue-200',
    Healthcare: 'bg-red-100 text-red-700 border-red-200',
    Environment: 'bg-green-100 text-green-700 border-green-200',
    'Water & Sanitation': 'bg-cyan-100 text-cyan-700 border-cyan-200',
    'Economic Empowerment': 'bg-purple-100 text-purple-700 border-purple-200',
    'Digital Education': 'bg-orange-100 text-orange-700 border-orange-200',
  };

  const totalBeneficiaries = programs.filter(p => p.status === 'active').reduce((sum, p) => sum + p.beneficiaries, 0);
  const activePrograms = programs.filter(p => p.status === 'active').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative py-28 bg-gradient-to-br from-blue-900 to-blue-700 pt-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full mb-6">Our Programs</div>
            <h1 className="text-5xl font-bold text-white font-serif mb-6">Transforming Communities<br />One Program at a Time</h1>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-10">Explore our comprehensive programs designed to address the root causes of poverty and empower communities toward self-sufficiency.</p>
            <div className="grid grid-cols-3 gap-6 max-w-md mx-auto">
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
                <div className="text-white font-bold text-2xl">{activePrograms}</div>
                <div className="text-blue-200 text-xs">Active Programs</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
                <div className="text-white font-bold text-2xl">{(totalBeneficiaries / 1000).toFixed(0)}K+</div>
                <div className="text-blue-200 text-xs">Beneficiaries</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
                <div className="text-white font-bold text-2xl">30+</div>
                <div className="text-blue-200 text-xs">Countries</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-gray-100 sticky top-20 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Search programs..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none" />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Filter className="w-5 h-5 text-gray-400 mt-2.5" />
              {categories.map(cat => (
                <button key={cat} onClick={() => setCategory(cat)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border-2 ${category === cat ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                  {cat}
                </button>
              ))}
            </div>
            <select value={status} onChange={e => setStatus(e.target.value)} className="px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-sm">
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPrograms.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No programs found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPrograms.map((program) => (
                <div key={program.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                  <div className="relative h-56 overflow-hidden">
                    <img src={program.image} alt={program.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-4 left-4">
                      <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${categoryColors[program.category] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                        {program.category}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${program.status === 'active' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                        {program.status === 'active' ? '🟢 Active' : '✅ Completed'}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">{program.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-5 line-clamp-3">{program.description}</p>
                    <div className="space-y-2 text-sm text-gray-500 mb-5">
                      <div className="flex items-center space-x-2"><MapPin className="w-4 h-4 text-blue-500" /><span>{program.location}</span></div>
                      <div className="flex items-center space-x-2"><Users className="w-4 h-4 text-green-500" /><span>{program.beneficiaries.toLocaleString()} beneficiaries served</span></div>
                      <div className="flex items-center space-x-2"><Calendar className="w-4 h-4 text-orange-500" /><span>Started {new Date(program.start_date).getFullYear()}</span></div>
                    </div>
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <div className="w-32 bg-gray-100 rounded-full h-2 mb-1">
                          <div className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full" style={{ width: `${Math.min(100, (program.beneficiaries / 15000) * 100)}%` }}></div>
                        </div>
                        <span className="text-xs text-gray-500">Impact Progress</span>
                      </div>
                      <Link to="/donate" className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-600 hover:text-white transition-colors">
                        Support →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Impact Summary */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white font-serif mb-10">Collective Impact Across All Programs</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '50,000+', label: 'Total Beneficiaries' },
              { value: '6', label: 'Program Areas' },
              { value: '30+', label: 'Countries' },
              { value: '$2M+', label: 'Invested' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
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
