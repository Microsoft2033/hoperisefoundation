import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit, Eye, EyeOff } from 'lucide-react';
import { db, BlogPost } from '../../lib/mockDb';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const emptyForm = { title: '', content: '', excerpt: '', image: '', category: 'Education', author: '', published: true, tags: [] as string[] };

const AdminBlog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    setPosts(db.blog.getAll());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      db.blog.update(editingId, form);
      toast.success('Post updated!');
    } else {
      db.blog.create(form);
      toast.success('Post created!');
    }
    setPosts(db.blog.getAll());
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setTagInput('');
  };

  const handleEdit = (post: BlogPost) => {
    setForm({ title: post.title, content: post.content, excerpt: post.excerpt, image: post.image, category: post.category, author: post.author, published: post.published, tags: post.tags });
    setEditingId(post.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this post?')) {
      db.blog.delete(id);
      setPosts(db.blog.getAll());
      toast.success('Post deleted');
    }
  };

  const togglePublish = (id: string, published: boolean) => {
    db.blog.update(id, { published: !published });
    setPosts(db.blog.getAll());
    toast.success(published ? 'Post unpublished' : 'Post published!');
  };

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      setForm({ ...form, tags: [...form.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const categoryColors: Record<string, string> = {
    Education: 'bg-blue-100 text-blue-700', Healthcare: 'bg-red-100 text-red-700',
    Environment: 'bg-green-100 text-green-700', Empowerment: 'bg-purple-100 text-purple-700',
    Technology: 'bg-orange-100 text-orange-700',
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-gray-500 text-sm">{posts.filter(p => p.published).length} published • {posts.filter(p => !p.published).length} drafts</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); setTagInput(''); }} className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 text-sm">
          <Plus className="w-4 h-4" />
          <span>New Post</span>
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">{editingId ? 'Edit Post' : 'Create New Post'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 text-xl">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                <input required type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Author *</label>
                  <input required type="text" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none">
                    {['Education', 'Healthcare', 'Environment', 'Empowerment', 'Technology', 'General'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Excerpt *</label>
                <input required type="text" value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none" placeholder="Brief summary of the post" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Content *</label>
                <textarea required value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={8} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none resize-y" placeholder="Write your blog content here..." />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL</label>
                <input type="url" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tags (Press Enter to add)</label>
                <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={addTag} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none" placeholder="Add tags..." />
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm flex items-center space-x-1">
                        <span>#{tag}</span>
                        <button type="button" onClick={() => setForm({ ...form, tags: form.tags.filter(t => t !== tag) })} className="ml-1 text-orange-400 hover:text-orange-700">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <input type="checkbox" id="published" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} className="w-5 h-5 rounded" />
                <label htmlFor="published" className="text-sm font-medium text-gray-700">Publish immediately</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700">{editingId ? 'Update Post' : 'Create Post'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Posts List */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
            <div className="flex items-start">
              {post.image && <img src={post.image} alt={post.title} className="w-32 h-24 object-cover flex-shrink-0 hidden sm:block" />}
              <div className="p-5 flex-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${categoryColors[post.category] || 'bg-gray-100 text-gray-700'}`}>{post.category}</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${post.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{post.published ? 'Published' : 'Draft'}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">{post.title}</h3>
                    <p className="text-gray-500 text-sm line-clamp-1">{post.excerpt}</p>
                    <div className="text-gray-400 text-xs mt-2">By {post.author} • {format(new Date(post.created_at), 'MMM dd, yyyy')}</div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button onClick={() => togglePublish(post.id, post.published)} className={`p-1.5 rounded-lg ${post.published ? 'text-gray-400 hover:bg-gray-50' : 'text-green-500 hover:bg-green-50'}`} title={post.published ? 'Unpublish' : 'Publish'}>
                      {post.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button onClick={() => handleEdit(post)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(post.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {posts.length === 0 && <div className="text-center py-16 bg-white rounded-2xl"><div className="text-5xl mb-4">📝</div><p className="text-gray-500">No blog posts yet</p></div>}
      </div>
    </div>
  );
};

export default AdminBlog;
