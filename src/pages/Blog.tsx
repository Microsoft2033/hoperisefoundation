import React, { useState, useEffect } from 'react';
import { Search, Tag, Calendar, User } from 'lucide-react';
import { db, BlogPost } from '../lib/mockDb';
import { format } from 'date-fns';

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filtered, setFiltered] = useState<BlogPost[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState<BlogPost | null>(null);

  const categories = ['All', 'Education', 'Healthcare', 'Environment', 'Empowerment', 'Technology'];

  useEffect(() => {
    const data = db.blog.getPublished();
    setPosts(data);
    setFiltered(data);
  }, []);

  useEffect(() => {
    let result = posts;
    if (search) result = result.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase()));
    if (category !== 'All') result = result.filter(p => p.category === category);
    setFiltered(result);
  }, [posts, search, category]);

  const categoryColors: Record<string, string> = {
    Education: 'bg-blue-100 text-blue-700',
    Healthcare: 'bg-red-100 text-red-700',
    Environment: 'bg-green-100 text-green-700',
    Empowerment: 'bg-purple-100 text-purple-700',
    Technology: 'bg-orange-100 text-orange-700',
  };

  if (selected) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button onClick={() => setSelected(null)} className="flex items-center space-x-2 text-green-600 font-semibold mb-8 hover:text-green-700">
            ← Back to Blog
          </button>
          <article>
            <div className="mb-6">
              <span className={`text-sm font-semibold px-3 py-1.5 rounded-full ${categoryColors[selected.category] || 'bg-gray-100 text-gray-700'}`}>{selected.category}</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 font-serif mb-6 leading-tight">{selected.title}</h1>
            <div className="flex items-center space-x-6 text-gray-500 text-sm mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-center space-x-2"><User className="w-4 h-4" /><span>{selected.author}</span></div>
              <div className="flex items-center space-x-2"><Calendar className="w-4 h-4" /><span>{format(new Date(selected.created_at), 'MMMM dd, yyyy')}</span></div>
              <div className="flex items-center space-x-2"><Tag className="w-4 h-4" /><span>{selected.tags.join(', ')}</span></div>
            </div>
            <img src={selected.image} alt={selected.title} className="w-full h-80 object-cover rounded-2xl mb-8" />
            <div className="prose max-w-none">
              <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">{selected.content}</p>
            </div>
            <div className="mt-10 pt-8 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {selected.tags.map(tag => (
                  <span key={tag} className="text-sm bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">#{tag}</span>
                ))}
              </div>
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-700 to-amber-600 py-28 pt-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full mb-6">News & Stories</div>
          <h1 className="text-5xl font-bold text-white font-serif mb-4">Stories of Hope & Impact</h1>
          <p className="text-orange-100 text-lg max-w-2xl mx-auto">Read the latest news, success stories, and updates from our programs around the world.</p>
        </div>
      </section>

      {/* Search & Filter */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Search articles..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none" />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button key={cat} onClick={() => setCategory(cat)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border-2 ${category === cat ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length > 0 && (
            <>
              {/* Featured Post */}
              <div className="mb-12">
                <div className="grid lg:grid-cols-2 gap-0 bg-white rounded-3xl overflow-hidden shadow-lg group cursor-pointer hover:shadow-xl transition-all" onClick={() => setSelected(filtered[0])}>
                  <div className="relative h-72 lg:h-auto overflow-hidden">
                    <img src={filtered[0].image} alt={filtered[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 left-4">
                      <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">Featured</span>
                    </div>
                  </div>
                  <div className="p-10 flex flex-col justify-center">
                    <span className={`text-sm font-semibold px-3 py-1.5 rounded-full w-fit mb-4 ${categoryColors[filtered[0].category] || 'bg-gray-100 text-gray-700'}`}>{filtered[0].category}</span>
                    <h2 className="text-3xl font-bold text-gray-900 font-serif mb-4 leading-tight group-hover:text-orange-600 transition-colors">{filtered[0].title}</h2>
                    <p className="text-gray-600 leading-relaxed mb-6">{filtered[0].excerpt}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>By {filtered[0].author}</span>
                      <span>•</span>
                      <span>{format(new Date(filtered[0].created_at), 'MMM dd, yyyy')}</span>
                    </div>
                    <button className="mt-6 w-fit px-6 py-3 bg-orange-50 text-orange-700 rounded-xl font-semibold hover:bg-orange-500 hover:text-white transition-all">
                      Read Full Story →
                    </button>
                  </div>
                </div>
              </div>

              {/* Other Posts Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.slice(1).map((post) => (
                  <article key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group cursor-pointer hover:-translate-y-1" onClick={() => setSelected(post)}>
                    <div className="h-48 overflow-hidden">
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${categoryColors[post.category] || 'bg-gray-100 text-gray-700'}`}>{post.category}</span>
                        <span className="text-gray-400 text-xs">{format(new Date(post.created_at), 'MMM dd, yyyy')}</span>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-3 leading-snug group-hover:text-orange-600 transition-colors line-clamp-2">{post.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4">{post.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 text-xs">By {post.author}</span>
                        <span className="text-orange-600 text-sm font-semibold">Read More →</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
          {filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📰</div>
              <h3 className="text-xl font-bold text-gray-700">No posts found</h3>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;
