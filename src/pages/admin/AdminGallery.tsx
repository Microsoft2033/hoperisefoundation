import React, { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: string;
}

const defaultImages: GalleryImage[] = [
  { id: '1', src: 'https://images.pexels.com/photos/6646855/pexels-photo-6646855.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600', alt: 'Volunteers distributing food', category: 'Community' },
  { id: '2', src: 'https://images.pexels.com/photos/6646884/pexels-photo-6646884.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600', alt: 'Aid distribution', category: 'Humanitarian' },
  { id: '3', src: 'https://images.pexels.com/photos/8363025/pexels-photo-8363025.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600', alt: 'Children in classroom', category: 'Education' },
  { id: '4', src: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600', alt: 'Healthcare services', category: 'Healthcare' },
  { id: '5', src: 'https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600', alt: 'Tree planting', category: 'Environment' },
  { id: '6', src: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600', alt: "Women's empowerment", category: 'Empowerment' },
];

const AdminGallery: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>(defaultImages);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ src: '', alt: '', category: 'Community' });
  const categories = ['Community', 'Education', 'Healthcare', 'Environment', 'Volunteers', 'Events', 'Empowerment', 'Humanitarian'];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newImg: GalleryImage = { id: Date.now().toString(), ...form };
    setImages([...images, newImg]);
    setShowForm(false);
    setForm({ src: '', alt: '', category: 'Community' });
    toast.success('Image added to gallery!');
  };

  const handleDelete = (id: string) => {
    setImages(images.filter(img => img.id !== id));
    toast.success('Image removed from gallery');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gallery Management</h1>
          <p className="text-gray-500 text-sm">{images.length} images</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 text-sm">
          <Plus className="w-4 h-4" />
          <span>Add Image</span>
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Add Gallery Image</h2>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL *</label>
                <input required type="url" value={form.src} onChange={e => setForm({ ...form, src: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Alt Text / Caption *</label>
                <input required type="text" value={form.alt} onChange={e => setForm({ ...form, alt: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none">
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              {form.src && <div className="mt-2"><img src={form.src} alt="Preview" className="w-full h-40 object-cover rounded-xl" onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200'; }} /></div>}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700">Add Image</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img) => (
          <div key={img.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
            <div className="relative h-40 overflow-hidden">
              <img src={img.src} alt={img.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button onClick={() => handleDelete(img.id)} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-3">
              <p className="font-medium text-gray-900 text-sm truncate">{img.alt}</p>
              <span className="text-xs text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">{img.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminGallery;
