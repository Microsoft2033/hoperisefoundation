// import React, { useState } from 'react';
// import { Plus, Trash2, X } from 'lucide-react';
// import toast from 'react-hot-toast';

// interface GalleryImage {
//   id: string;
//   src: string;
//   alt: string;
//   category: string;
// }

// const defaultImages: GalleryImage[] = [
//   { id: '1', src: 'https://images.pexels.com/photos/6646855/pexels-photo-6646855.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600', alt: 'Volunteers distributing food', category: 'Community' },
//   { id: '2', src: 'https://images.pexels.com/photos/6646884/pexels-photo-6646884.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600', alt: 'Aid distribution', category: 'Humanitarian' },
//   { id: '3', src: 'https://images.pexels.com/photos/8363025/pexels-photo-8363025.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600', alt: 'Children in classroom', category: 'Education' },
//   { id: '4', src: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600', alt: 'Healthcare services', category: 'Healthcare' },
//   { id: '5', src: 'https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600', alt: 'Tree planting', category: 'Environment' },
//   { id: '6', src: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600', alt: "Women's empowerment", category: 'Empowerment' },
// ];

// const AdminGallery: React.FC = () => {
//   const [images, setImages] = useState<GalleryImage[]>(defaultImages);
//   const [showForm, setShowForm] = useState(false);
//   const [form, setForm] = useState({ src: '', alt: '', category: 'Community' });
//   const categories = ['Community', 'Education', 'Healthcare', 'Environment', 'Volunteers', 'Events', 'Empowerment', 'Humanitarian'];

//   const handleAdd = (e: React.FormEvent) => {
//     e.preventDefault();
//     const newImg: GalleryImage = { id: Date.now().toString(), ...form };
//     setImages([...images, newImg]);
//     setShowForm(false);
//     setForm({ src: '', alt: '', category: 'Community' });
//     toast.success('Image added to gallery!');
//   };

//   const handleDelete = (id: string) => {
//     setImages(images.filter(img => img.id !== id));
//     toast.success('Image removed from gallery');
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Gallery Management</h1>
//           <p className="text-gray-500 text-sm">{images.length} images</p>
//         </div>
//         <button onClick={() => setShowForm(true)} className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 text-sm">
//           <Plus className="w-4 h-4" />
//           <span>Add Image</span>
//         </button>
//       </div>

//       {showForm && (
//         <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-xl font-bold">Add Gallery Image</h2>
//               <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-gray-400" /></button>
//             </div>
//             <form onSubmit={handleAdd} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL *</label>
//                 <input required type="url" value={form.src} onChange={e => setForm({ ...form, src: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none" placeholder="https://..." />
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">Alt Text / Caption *</label>
//                 <input required type="text" value={form.alt} onChange={e => setForm({ ...form, alt: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none" />
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
//                 <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none">
//                   {categories.map(c => <option key={c}>{c}</option>)}
//                 </select>
//               </div>
//               {form.src && <div className="mt-2"><img src={form.src} alt="Preview" className="w-full h-40 object-cover rounded-xl" onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200'; }} /></div>}
//               <div className="flex gap-3 pt-2">
//                 <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold">Cancel</button>
//                 <button type="submit" className="flex-1 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700">Add Image</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//         {images.map((img) => (
//           <div key={img.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
//             <div className="relative h-40 overflow-hidden">
//               <img src={img.src} alt={img.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
//               <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
//                 <button onClick={() => handleDelete(img.id)} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
//                   <Trash2 className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//             <div className="p-3">
//               <p className="font-medium text-gray-900 text-sm truncate">{img.alt}</p>
//               <span className="text-xs text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">{img.category}</span>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AdminGallery;

import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Trash2, X, Loader2, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';

// ============================================================
// TYPES
// ============================================================

interface GalleryImage {
  id: string;
  created_at: string;
  src: string;
  alt: string;
  category: string;
}

type GalleryForm = Omit<GalleryImage, 'id' | 'created_at'>;

// ============================================================
// CONSTANTS
// ============================================================

const CATEGORIES = [
  'Community',
  'Education',
  'Healthcare',
  'Environment',
  'Volunteers',
  'Events',
  'Empowerment',
  'Humanitarian',
];

const emptyForm: GalleryForm = {
  src: '',
  alt: '',
  category: 'Community',
};

const categoryColors: Record<string, string> = {
  Community:    'bg-green-50 text-green-700',
  Education:    'bg-blue-50 text-blue-700',
  Healthcare:   'bg-red-50 text-red-700',
  Environment:  'bg-emerald-50 text-emerald-700',
  Volunteers:   'bg-purple-50 text-purple-700',
  Events:       'bg-yellow-50 text-yellow-700',
  Empowerment:  'bg-pink-50 text-pink-700',
  Humanitarian: 'bg-orange-50 text-orange-700',
};

// ============================================================
// COMPONENT
// ============================================================

const AdminGallery: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<GalleryForm>(emptyForm);
  const [previewError, setPreviewError] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('All');

  // ============================================================
  // FETCH IMAGES
  // ============================================================
  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (err: any) {
      console.error('Error fetching gallery:', err);
      toast.error('Failed to load gallery images');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  // ============================================================
  // RESET FORM
  // ============================================================
  const resetForm = () => {
    setShowForm(false);
    setForm(emptyForm);
    setPreviewError(false);
  };

  // ============================================================
  // ADD IMAGE
  // ============================================================
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('gallery')
        .insert([form]);

      if (error) throw error;

      toast.success('Image added to gallery!');
      await fetchImages();
      resetForm();
    } catch (err: any) {
      console.error('Error adding image:', err);
      toast.error(err.message || 'Failed to add image');
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================================
  // DELETE IMAGE
  // ============================================================
  const handleDelete = async (id: string) => {
    if (!window.confirm('Remove this image from the gallery?')) return;

    try {
      setDeletingId(id);

      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Image removed from gallery');
      setImages(prev => prev.filter(img => img.id !== id));
    } catch (err: any) {
      console.error('Error deleting image:', err);
      toast.error(err.message || 'Failed to remove image');
    } finally {
      setDeletingId(null);
    }
  };

  // ============================================================
  // FILTERED IMAGES
  // ============================================================
  const filteredImages = categoryFilter === 'All'
    ? images
    : images.filter(img => img.category === categoryFilter);

  // ============================================================
  // LOADING STATE
  // ============================================================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <Loader2 className="w-10 h-10 text-teal-500 animate-spin mx-auto" />
          <p className="text-gray-500 text-sm">Loading gallery...</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Gallery Management</h1>
          <p className="text-gray-500 text-sm">
            {images.length} total images
            {categoryFilter !== 'All' && ` • ${filteredImages.length} in ${categoryFilter}`}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Image</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Images',      value: images.length                                           },
          { label: 'Categories',        value: new Set(images.map(i => i.category)).size               },
          { label: 'Latest Category',   value: images[0]?.category || '—'                              },
          { label: 'Showing',           value: filteredImages.length                                    },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-teal-600">{card.value}</div>
            <div className="text-gray-500 text-xs mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {['All', ...CATEGORIES].map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              categoryFilter === cat
                ? 'bg-teal-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-teal-400 hover:text-teal-600'
            }`}
          >
            {cat}
            {cat !== 'All' && (
              <span className="ml-1 text-xs opacity-70">
                ({images.filter(i => i.category === cat).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Add Image Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Add Gallery Image</h2>
              <button
                onClick={resetForm}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-4">
              {/* Image URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Image URL *
                </label>
                <input
                  required
                  type="url"
                  value={form.src}
                  onChange={e => {
                    setForm({ ...form, src: e.target.value });
                    setPreviewError(false);
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                  placeholder="https://..."
                />
              </div>

              {/* Alt Text */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Alt Text / Caption *
                </label>
                <input
                  required
                  type="text"
                  value={form.alt}
                  onChange={e => setForm({ ...form, alt: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                  placeholder="Describe this image..."
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                >
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              {/* Image Preview */}
              {form.src && (
                <div className="mt-2 rounded-xl overflow-hidden border-2 border-gray-100">
                  {!previewError ? (
                    <img
                      src={form.src}
                      alt="Preview"
                      className="w-full h-40 object-cover"
                      onError={() => setPreviewError(true)}
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-100 flex flex-col items-center justify-center text-gray-400 gap-2">
                      <ImageIcon className="w-8 h-8" />
                      <p className="text-xs">Invalid image URL</p>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || previewError}
                  className="flex-1 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors disabled:opacity-70 flex items-center justify-center space-x-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Adding...</span>
                    </>
                  ) : (
                    <span>Add Image</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Grid */}
      {filteredImages.length > 0 ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map(img => {
            const isDeleting = deletingId === img.id;

            return (
              <div
                key={img.id}
                className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group transition-all ${
                  isDeleting ? 'opacity-50 pointer-events-none' : 'hover:shadow-md'
                }`}
              >
                {/* Image */}
                <div className="relative h-40 overflow-hidden bg-gray-100">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={e => {
                      (e.target as HTMLImageElement).src =
                        'https://via.placeholder.com/400x200?text=Image+Not+Found';
                    }}
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => handleDelete(img.id)}
                      disabled={isDeleting}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      title="Remove image"
                    >
                      {isDeleting
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <Trash2 className="w-4 h-4" />
                      }
                    </button>
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-3 flex items-center justify-between gap-2">
                  <p className="font-medium text-gray-900 text-sm truncate flex-1">
                    {img.alt}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${
                    categoryColors[img.category] || 'bg-gray-50 text-gray-700'
                  }`}>
                    {img.category}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <div className="text-5xl mb-4">🖼️</div>
          <h3 className="text-lg font-bold text-gray-700 mb-1">No images found</h3>
          <p className="text-gray-400 text-sm mb-6">
            {categoryFilter !== 'All'
              ? `No images in the "${categoryFilter}" category yet`
              : 'Start by adding your first gallery image'}
          </p>
          {categoryFilter !== 'All' ? (
            <button
              onClick={() => setCategoryFilter('All')}
              className="px-4 py-2 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 text-sm font-medium mr-3"
            >
              Clear Filter
            </button>
          ) : null}
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors text-sm"
          >
            Add First Image
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminGallery;