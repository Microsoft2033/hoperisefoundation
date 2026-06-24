

import React, { useState, useEffect, useCallback } from 'react';
import { X, ZoomIn, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
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

// ============================================================
// CONSTANTS
// ============================================================

const CATEGORIES = [
  'All',
  'Community',
  'Education',
  'Healthcare',
  'Environment',
  'Volunteers',
  'Events',
  'Empowerment',
  'Humanitarian',
];

// ============================================================
// SKELETON LOADER
// ============================================================

const ImageSkeleton: React.FC<{ height: string }> = ({ height }) => (
  <div
    className="bg-gray-200 rounded-2xl animate-pulse mb-4 break-inside-avoid"
    style={{ height }}
  />
);

const GallerySkeleton: React.FC = () => {
  // Varied heights for masonry effect
  const heights = ['200px', '300px', '250px', '350px', '220px', '280px', '320px', '240px'];

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <ImageSkeleton key={i} height={heights[i % heights.length]} />
      ))}
    </div>
  );
};

// ============================================================
// LIGHTBOX COMPONENT
// ============================================================

const Lightbox: React.FC<{
  image: GalleryImage;
  images: GalleryImage[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}> = ({ image, images, currentIndex, onClose, onNavigate }) => {
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape')        onClose();
      else if (e.key === 'ArrowLeft' && hasPrev)  onNavigate(currentIndex - 1);
      else if (e.key === 'ArrowRight' && hasNext) onNavigate(currentIndex + 1);
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [currentIndex, hasPrev, hasNext, onClose, onNavigate]);

  return (
    <div
      className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        className="absolute top-6 right-6 text-white hover:text-gray-300 z-20 p-2 hover:bg-white/10 rounded-full transition-colors"
        onClick={onClose}
        aria-label="Close"
      >
        <X className="w-8 h-8" />
      </button>

      {/* Counter */}
      <div className="absolute top-6 left-6 text-white text-sm bg-black/40 px-3 py-1.5 rounded-full">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Previous Button */}
      {hasPrev && (
        <button
          onClick={e => { e.stopPropagation(); onNavigate(currentIndex - 1); }}
          className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>
      )}

      {/* Next Button */}
      {hasNext && (
        <button
          onClick={e => { e.stopPropagation(); onNavigate(currentIndex + 1); }}
          className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>
      )}

      {/* Image Content */}
      <div
        className="max-w-5xl w-full max-h-[90vh] flex flex-col items-center"
        onClick={e => e.stopPropagation()}
      >
        <img
          src={image.src}
          alt={image.alt}
          className="w-full rounded-2xl max-h-[75vh] object-contain"
        />
        <div className="text-center mt-4">
          <p className="text-white font-semibold text-lg">{image.alt}</p>
          <span className="text-teal-300 text-sm font-medium">
            {image.category}
          </span>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================

const Gallery: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

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
    } catch (err) {
      console.error('Error fetching gallery:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  // ============================================================
  // FILTERED IMAGES
  // ============================================================
  const filteredImages = filter === 'All'
    ? images
    : images.filter(img => img.category === filter);

  // ============================================================
  // CATEGORY COUNTS
  // ============================================================
  const getCategoryCount = (cat: string) =>
    cat === 'All' ? images.length : images.filter(i => i.category === cat).length;

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-700 to-cyan-600 py-28 pt-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full mb-6">
            Photo Gallery
          </div>
          <h1 className="text-5xl font-bold text-white font-serif mb-4">
            Our Work in Pictures
          </h1>
          <p className="text-teal-100 text-lg max-w-2xl mx-auto">
            A visual journey through the communities we serve and the lives we
            touch around the world.
          </p>

          {/* Gallery Stats */}
          {!loading && (
            <div className="mt-8 flex justify-center gap-6">
              <div className="bg-white/10 rounded-xl px-6 py-3 backdrop-blur">
                <div className="text-white font-bold text-xl">{images.length}</div>
                <div className="text-teal-100 text-xs">Total Photos</div>
              </div>
              <div className="bg-white/10 rounded-xl px-6 py-3 backdrop-blur">
                <div className="text-white font-bold text-xl">
                  {new Set(images.map(i => i.category)).size}
                </div>
                <div className="text-teal-100 text-xs">Categories</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-2 flex-wrap justify-center">
            {CATEGORIES.map(cat => {
              const count = getCategoryCount(cat);
              return (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border-2 ${
                    filter === cat
                      ? 'border-teal-500 bg-teal-50 text-teal-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {cat}
                  {!loading && (
                    <span className="ml-1 text-xs opacity-60">({count})</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Loading State */}
          {loading && <GallerySkeleton />}

          {/* Empty State */}
          {!loading && filteredImages.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📷</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">
                No photos found
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                {filter !== 'All'
                  ? `No images in the "${filter}" category yet`
                  : 'No photos have been uploaded yet'}
              </p>
              {filter !== 'All' && (
                <button
                  onClick={() => setFilter('All')}
                  className="mt-2 px-5 py-2 bg-teal-50 text-teal-600 rounded-xl font-semibold hover:bg-teal-100 transition-colors text-sm"
                >
                  View All Photos
                </button>
              )}
            </div>
          )}

          {/* Image Grid */}
          {!loading && filteredImages.length > 0 && (
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
              {filteredImages.map((image, idx) => (
                <div
                  key={image.id}
                  className="break-inside-avoid relative group cursor-pointer rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-gray-100"
                  onClick={() => setSelectedIndex(idx)}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    loading="lazy"
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={e => {
                      (e.target as HTMLImageElement).src =
                        'https://via.placeholder.com/600x400?text=Image+Not+Found';
                    }}
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div>
                      <p className="text-white font-semibold text-sm">
                        {image.alt}
                      </p>
                      <span className="text-teal-300 text-xs">
                        {image.category}
                      </span>
                    </div>
                  </div>

                  {/* Zoom Icon */}
                  <div className="absolute top-4 right-4 bg-black/40 backdrop-blur p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="w-4 h-4 text-white" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selectedIndex !== null && filteredImages[selectedIndex] && (
        <Lightbox
          image={filteredImages[selectedIndex]}
          images={filteredImages}
          currentIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
          onNavigate={setSelectedIndex}
        />
      )}

      {/* Download Media Kit */}
      <section className="py-16 bg-teal-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white font-serif mb-4">
            Need Media Resources?
          </h2>
          <p className="text-teal-100 mb-8">
            Download our press kit including high-resolution photos, logos, and
            brand guidelines for media use.
          </p>
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