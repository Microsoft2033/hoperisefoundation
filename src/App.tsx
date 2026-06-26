import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Programs = lazy(() => import('./pages/Programs'));
const Events = lazy(() => import('./pages/Events'));
const Blog = lazy(() => import('./pages/Blog'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Contact = lazy(() => import('./pages/Contact'));
const Donate = lazy(() => import('./pages/Donate'));
const Volunteer = lazy(() => import('./pages/Volunteer'));

// Admin Pages
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminDonations = lazy(() => import('./pages/admin/AdminDonations'));
const AdminVolunteers = lazy(() => import('./pages/admin/AdminVolunteers'));
const AdminMessages = lazy(() => import('./pages/admin/AdminMessages'));
const AdminNewsletter = lazy(() => import('./pages/admin/AdminNewsletter'));
const AdminEvents = lazy(() => import('./pages/admin/AdminEvents'));
const AdminPrograms = lazy(() => import('./pages/admin/AdminPrograms'));
const AdminBlog = lazy(() => import('./pages/admin/AdminBlog'));
const AdminGallery = lazy(() => import('./pages/admin/AdminGallery'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));

const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-green-200 rounded-full animate-spin border-t-green-500"></div>
        <div className="absolute inset-2 w-8 h-8 border-4 border-emerald-200 rounded-full animate-spin border-t-emerald-500" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
      </div>
      <div className="text-green-600 font-semibold text-lg">HopeRise Foundation</div>
      <div className="text-gray-400 text-sm">Loading...</div>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { borderRadius: '12px', background: '#1f2937', color: '#fff', fontSize: '14px' },
            success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/events" element={<Events />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/donate" element={<Donate />} />
              <Route path="/volunteer" element={<Volunteer />} />
              <Route path="/privacy" element={<div className="min-h-screen pt-24 pb-16 max-w-3xl mx-auto px-4"><h1 className="text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h1><p className="text-gray-600">Coming soon...</p></div>} />
              <Route path="/terms" element={<div className="min-h-screen pt-24 pb-16 max-w-3xl mx-auto px-4"><h1 className="text-3xl font-bold text-gray-900 mb-4">Terms of Service</h1><p className="text-gray-600">Coming soon...</p></div>} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/*" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="donations" element={<AdminDonations />} />
              <Route path="volunteers" element={<AdminVolunteers />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="newsletter" element={<AdminNewsletter />} />
              <Route path="events" element={<AdminEvents />} />
              <Route path="programs" element={<AdminPrograms />} />
              <Route path="blog" element={<AdminBlog />} />
              <Route path="gallery" element={<AdminGallery />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
    
  );
};

export default App;
