


import React, { useState, useEffect, useCallback } from 'react';
import { Search, Tag, Calendar, User, Loader2, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabase';

// ============================================================
// TYPES
// ============================================================

interface BlogPost {
  id: string;
  created_at: string;
  title: string;
  content: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  published: boolean;
  tags: string[];
}

// ============================================================
// CONSTANTS
// ============================================================

const categoryLabels: Record<string, string> = {
  education: 'Education',
  news:      'News',
  stories:   'Stories',
  updates:   'Updates',
  events:    'Events',
  opinion:   'Opinion',
  other:     'Other',
};

const categoryColors: Record<string, string> = {
  education: 'bg-blue-100 text-blue-700',
  news:      'bg-gray-100 text-gray-700',
  stories:   'bg-pink-100 text-pink-700',
  updates:   'bg-indigo-100 text-indigo-700',
  events:    'bg-yellow-100 text-yellow-700',
  opinion:   'bg-teal-100 text-teal-700',
  other:     'bg-orange-100 text-orange-700',
};

// ============================================================
// SKELETON LOADERS
// ============================================================

const FeaturedSkeleton: React.FC = () => (
  <div className="grid lg:grid-cols-2 gap-0 bg-white rounded-3xl overflow-hidden shadow-lg animate-pulse mb-12">
    <div className="h-72 lg:h-80 bg-gray-200" />
    <div className="p-10 flex flex-col justify-center space-y-4">
      <div className="h-4 bg-gray-200 rounded w-24" />
      <div className="h-8 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-5/6" />
      <div className="h-4 bg-gray-200 rounded w-32" />
      <div className="h-10 bg-gray-200 rounded w-36 mt-2" />
    </div>
  </div>
);

const CardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
    <div className="h-48 bg-gray-200" />
    <div className="p-6 space-y-3">
      <div className="flex gap-3">
        <div className="h-5 bg-gray-200 rounded-full w-20" />
        <div className="h-5 bg-gray-200 rounded w-24" />
      </div>
      <div className="h-5 bg-gray-200 rounded w-full" />
      <div className="h-5 bg-gray-200 rounded w-4/5" />
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
    </div>
  </div>
);

// ============================================================
// ARTICLE DETAIL VIEW
// ============================================================

const ArticleDetail: React.FC<{
  post: BlogPost;
  onBack: () => void;
}> = ({ post, onBack }) => (
  <div className="min-h-screen bg-gray-50 pt-20">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-green-600 font-semibold mb-8 hover:text-green-700 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Blog</span>
      </button>

      <article>
        {/* Category Badge */}
        <div className="mb-6">
          <span className={`text-sm font-semibold px-3 py-1.5 rounded-full ${
            categoryColors[post.category] || 'bg-gray-100 text-gray-700'
          }`}>
            {categoryLabels[post.category] || post.category}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 font-serif mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-6 text-gray-500 text-sm mb-8 pb-8 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>{format(new Date(post.created_at), 'MMMM dd, yyyy')}</span>
          </div>
          {post.tags?.length > 0 && (
            <div className="flex items-center space-x-2">
              <Tag className="w-4 h-4" />
              <span>{post.tags.join(', ')}</span>
            </div>
          )}
        </div>

        {/* Hero Image */}
        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-80 object-cover rounded-2xl mb-8 shadow-md"
            onError={e => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        )}

        {/* Content */}
        <div className="prose max-w-none">
          <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
            {post.content}
          </p>
        </div>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="mt-10 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="text-sm bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  </div>
);

// ============================================================
// MAIN COMPONENT
// ============================================================

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filtered, setFiltered] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [selected, setSelected] = useState<BlogPost | null>(null);

  // ============================================================
  // FETCH PUBLISHED POSTS
  // ============================================================
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error('Error fetching blog posts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // ============================================================
  // CLIENT-SIDE FILTERING
  // ============================================================
  useEffect(() => {
    let result = [...posts];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        p =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.author.toLowerCase().includes(q) ||
          (p.tags || []).some(t => t.toLowerCase().includes(q))
      );
    }

    if (category !== 'all') {
      result = result.filter(p => p.category === category);
    }

    setFiltered(result);
  }, [posts, search, category]);

  // ============================================================
  // ARTICLE DETAIL VIEW
  // ============================================================
  if (selected) {
    return (
      <ArticleDetail
        post={selected}
        onBack={() => setSelected(null)}
      />
    );
  }

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-700 to-amber-600 py-28 pt-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full mb-6">
            News & Stories
          </div>
          <h1 className="text-5xl font-bold text-white font-serif mb-4">
            Stories of Hope & Impact
          </h1>
          <p className="text-orange-100 text-lg max-w-2xl mx-auto">
            Read the latest news, success stories, and updates from our programs around the world.
          </p>
        </div>
      </section>

      {/* Search & Filter */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles, authors, or tags..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setCategory('all')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border-2 ${
                  category === 'all'
                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                All
              </button>
              {Object.keys(categoryLabels).map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border-2 ${
                    category === cat
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {categoryLabels[cat]}
                  {!loading && (
                    <span className="ml-1 text-xs opacity-60">
                      ({posts.filter(p => p.category === cat).length})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Loading */}
          {loading && (
            <>
              <FeaturedSkeleton />
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 3 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            </>
          )}

          {/* Results */}
          {!loading && filtered.length > 0 && (
            <>
              {/* Featured Post */}
              <div className="mb-12">
                <div
                  className="grid lg:grid-cols-2 gap-0 bg-white rounded-3xl overflow-hidden shadow-lg group cursor-pointer hover:shadow-xl transition-all"
                  onClick={() => setSelected(filtered[0])}
                >
                  {/* Image */}
                  <div className="relative h-72 lg:h-auto overflow-hidden">
                    <img
                      src={filtered[0].image}
                      alt={filtered[0].title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={e => {
                        (e.target as HTMLImageElement).src =
                          'https://via.placeholder.com/600x400?text=No+Image';
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                        Featured
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-10 flex flex-col justify-center">
                    <span className={`text-sm font-semibold px-3 py-1.5 rounded-full w-fit mb-4 ${
                      categoryColors[filtered[0].category] || 'bg-gray-100 text-gray-700'
                    }`}>
                      {categoryLabels[filtered[0].category] || filtered[0].category}
                    </span>
                    <h2 className="text-3xl font-bold text-gray-900 font-serif mb-4 leading-tight group-hover:text-orange-600 transition-colors">
                      {filtered[0].title}
                    </h2>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {filtered[0].excerpt}
                    </p>
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

              {/* Post Grid */}
              {filtered.length > 1 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filtered.slice(1).map(post => (
                    <article
                      key={post.id}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group cursor-pointer hover:-translate-y-1"
                      onClick={() => setSelected(post)}
                    >
                      {/* Card Image */}
                      <div className="h-48 overflow-hidden bg-gray-100">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={e => {
                            (e.target as HTMLImageElement).src =
                              'https://via.placeholder.com/400x200?text=No+Image';
                          }}
                        />
                      </div>

                      {/* Card Content */}
                      <div className="p-6">
                        <div className="flex items-center space-x-3 mb-3">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            categoryColors[post.category] || 'bg-gray-100 text-gray-700'
                          }`}>
                            {categoryLabels[post.category] || post.category}
                          </span>
                          <span className="text-gray-400 text-xs">
                            {format(new Date(post.created_at), 'MMM dd, yyyy')}
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-3 leading-snug group-hover:text-orange-600 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500 text-xs">By {post.author}</span>
                          <span className="text-orange-600 text-sm font-semibold group-hover:translate-x-1 transition-transform inline-block">
                            Read More →
                          </span>
                        </div>

                        {/* Tags */}
                        {post.tags?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-gray-100">
                            {post.tags.slice(0, 3).map(tag => (
                              <span
                                key={tag}
                                className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Empty State */}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📰</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No posts found</h3>
              <p className="text-gray-400 text-sm">
                {search || category !== 'all'
                  ? 'Try adjusting your search or category filter'
                  : 'No blog posts have been published yet'}
              </p>
              {(search || category !== 'all') && (
                <button
                  onClick={() => { setSearch(''); setCategory('all'); }}
                  className="mt-4 px-5 py-2 bg-orange-50 text-orange-600 rounded-xl font-semibold hover:bg-orange-100 transition-colors text-sm"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}

        </div>
      </section>
    </div>
  );
};

export default Blog;