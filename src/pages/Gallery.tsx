import React, { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';

const Gallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string; category: string } | null>(null);
  const [filter, setFilter] = useState('All');

  const images = [
    { src: 'https://images.pexels.com/photos/6646855/pexels-photo-6646855.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800', alt: 'Volunteers distributing food', category: 'Community' },
    { src: 'https://images.pexels.com/photos/6646884/pexels-photo-6646884.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800', alt: 'Aid distribution', category: 'Humanitarian' },
    { src: 'https://images.pexels.com/photos/6646864/pexels-photo-6646864.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800', alt: 'Community food drive', category: 'Community' },
    { src: 'https://images.pexels.com/photos/6646952/pexels-photo-6646952.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800', alt: 'Volunteers packing supplies', category: 'Volunteers' },
    { src: 'https://images.pexels.com/photos/8363025/pexels-photo-8363025.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800', alt: 'Children in classroom', category: 'Education' },
    { src: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800', alt: 'Healthcare services', category: 'Healthcare' },
    { src: 'https://images.pexels.com/photos/2962405/pexels-photo-2962405.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800', alt: 'Clean water project', category: 'Water' },
    { src: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800', alt: "Women's empowerment workshop", category: 'Empowerment' },
    { src: 'https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800', alt: 'Tree planting drive', category: 'Environment' },
    { src: 'https://images.pexels.com/photos/4144179/pexels-photo-4144179.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800', alt: 'Digital literacy training', category: 'Education' },
    { src: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800', alt: 'Annual gala event', category: 'Events' },
    { src: 'https://images.pexels.com/photos/6647037/pexels-photo-6647037.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800', alt: 'Community outreach', category: 'Community' },
  ];

  const categories = ['All', 'Community', 'Education', 'Healthcare', 'Environment', 'Volunteers', 'Events', 'Empowerment', 'Water', 'Humanitarian'];
  const filteredImages = filter === 'All' ? images : images.filter(img => img.category === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-700 to-cyan-600 py-28 pt-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full mb-6">Photo Gallery</div>
          <h1 className="text-5xl font-bold text-white font-serif mb-4">Our Work in Pictures</h1>
          <p className="text-teal-100 text-lg max-w-2xl mx-auto">A visual journey through the communities we serve and the lives we touch around the world.</p>
        </div>
      </section>

      {/* Filter */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-2 flex-wrap justify-center">
            {categories.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border-2 ${filter === cat ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {filteredImages.map((image, idx) => (
              <div
                key={idx}
                className="break-inside-avoid relative group cursor-pointer rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                onClick={() => setSelectedImage(image)}
              >
                <img src={image.src} alt={image.alt} className="w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div>
                    <p className="text-white font-semibold text-sm">{image.alt}</p>
                    <span className="text-green-300 text-xs">{image.category}</span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <ZoomIn className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
          <button className="absolute top-6 right-6 text-white hover:text-gray-300 z-10">
            <X className="w-8 h-8" />
          </button>
          <div className="max-w-5xl w-full" onClick={e => e.stopPropagation()}>
            <img src={selectedImage.src} alt={selectedImage.alt} className="w-full rounded-2xl max-h-[80vh] object-contain" />
            <div className="text-center mt-4">
              <p className="text-white font-semibold">{selectedImage.alt}</p>
              <span className="text-green-400 text-sm">{selectedImage.category}</span>
            </div>
          </div>
        </div>
      )}

      {/* Download Media Kit */}
      <section className="py-16 bg-teal-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white font-serif mb-4">Need Media Resources?</h2>
          <p className="text-teal-100 mb-8">Download our press kit including high-resolution photos, logos, and brand guidelines for media use.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="px-8 py-3 bg-white text-teal-700 rounded-xl font-bold hover:bg-teal-50 transition-colors">
              📦 Download Media Kit
            </button>
            <button className="px-8 py-3 border-2 border-white text-white rounded-xl font-bold hover:bg-white/10 transition-colors">
              📧 Contact Press Team
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;
