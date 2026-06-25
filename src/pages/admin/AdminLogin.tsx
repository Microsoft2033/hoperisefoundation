


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart,  Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ login() now returns { success: boolean, error: string | null }
      const { success, error } = await login(email, password);

      if (success) {
        toast.success('Welcome back, Admin!');
        navigate('/admin/dashboard', { replace: true });
      } else {
        // Show specific Supabase error (e.g., invalid password, user not found)
        toast.error(error || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      console.error('Unexpected login error:', err);
      toast.error('A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = loading || authLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white fill-white" />
            </div>
            <div className="text-left">
              <span className="text-2xl font-bold text-white font-serif">HopeRise</span>
              <p className="text-green-400 text-xs">Foundation Admin</p>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-gray-400">Sign in to access the management dashboard</p>
        </div>

        {/* Form Card */}
        <div className="bg-gray-800 rounded-3xl border border-gray-700 p-8 shadow-2xl">
          {/* <div className="flex items-center space-x-2 bg-blue-900/30 border border-blue-800/50 rounded-xl p-4 mb-6">
            <Shield className="w-5 h-5 text-blue-400 flex-shrink-0" />
            <div>
              <p className="text-blue-300 text-xs font-medium">Demo Credentials</p>
              <p className="text-blue-200 text-xs">Email: admin@hoperise.org | Password: Admin@123</p>
            </div>
          </div> */}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-700 border-2 border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-green-500 focus:outline-none transition-colors"
                placeholder="admin@hoperise.org"
                disabled={isDisabled}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 pr-12 bg-gray-700 border-2 border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-green-500 focus:outline-none transition-colors"
                  placeholder="Enter your password"
                  disabled={isDisabled}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                  disabled={isDisabled}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isDisabled}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all flex items-center justify-center space-x-2 disabled:opacity-70 mt-6"
            >
              {isDisabled ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{authLoading ? 'Checking Session...' : 'Signing In...'}</span>
                </>
              ) : (
                <span>Sign In to Dashboard</span>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-600 text-sm mt-6">
          <a href="/" className="text-gray-400 hover:text-white transition-colors">← Back to Website</a>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;