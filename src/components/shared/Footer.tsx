import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Send } from 'lucide-react';
import { db } from '../../lib/mockDb';
import toast from 'react-hot-toast';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribing(true);
    try {
      db.newsletter.subscribe(email);
      toast.success('Successfully subscribed to our newsletter!');
      setEmail('');
    } catch {
      toast.error('This email is already subscribed.');
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter Bar */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-white">Stay Updated with Our Impact</h3>
              <p className="text-green-100 mt-1">Get the latest news, stories, and updates directly to your inbox.</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full md:w-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 md:w-72 px-4 py-3 rounded-l-xl bg-white/20 backdrop-blur border border-white/30 text-white placeholder-green-100 focus:outline-none focus:border-white"
                required
              />
              <button
                type="submit"
                disabled={subscribing}
                className="px-6 py-3 bg-white text-green-700 font-semibold rounded-r-xl hover:bg-green-50 transition-colors flex items-center space-x-2 disabled:opacity-70"
              >
                <Send className="w-4 h-4" />
                <span>{subscribing ? 'Subscribing...' : 'Subscribe'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white font-serif">HopeRise</span>
                <p className="text-xs text-green-400 -mt-1">Foundation</p>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Empowering underprivileged communities through education, healthcare, and sustainable development since 2015.
            </p>
            <div className="flex space-x-3">
              {[
                { emoji: '📘', href: '#', label: 'Facebook' },
                { emoji: '🐦', href: '#', label: 'Twitter' },
                { emoji: '📷', href: '#', label: 'Instagram' },
                { emoji: '▶️', href: '#', label: 'YouTube' },
              ].map(({ emoji, href, label }) => (
                <a key={label} href={href} aria-label={label} className="w-9 h-9 bg-gray-800 hover:bg-green-600 rounded-lg flex items-center justify-center transition-colors text-sm">
                  {emoji}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: 'About Us', path: '/about' },
                { label: 'Our Programs', path: '/programs' },
                { label: 'Events', path: '/events' },
                { label: 'News & Blog', path: '/blog' },
                { label: 'Gallery', path: '/gallery' },
                { label: 'Contact Us', path: '/contact' },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-gray-400 hover:text-green-400 transition-colors text-sm flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Our Programs</h4>
            <ul className="space-y-3">
              {[
                'Education & Scholarships',
                'Healthcare Services',
                'Clean Water Initiative',
                'Women Empowerment',
                'Environmental Projects',
                'Digital Literacy',
              ].map((program) => (
                <li key={program}>
                  <Link to="/programs" className="text-gray-400 hover:text-green-400 transition-colors text-sm flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    <span>{program}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-sm">123 Hope Street, New York, NY 10001, USA</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-green-400 flex-shrink-0" />
                <a href="tel:+12125550100" className="text-gray-400 hover:text-green-400 text-sm transition-colors">+1 (212) 555-0100</a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-green-400 flex-shrink-0" />
                <a href="mailto:info@hoperise.org" className="text-gray-400 hover:text-green-400 text-sm transition-colors">info@hoperise.org</a>
              </li>
            </ul>
            <div className="mt-6">
              <Link to="/donate" className="inline-flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg text-sm font-semibold hover:from-green-600 hover:to-emerald-700 transition-all">
                <Heart className="w-4 h-4 fill-white" />
                <span>Donate Now</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">© 2025 HopeRise Foundation. All rights reserved. | Registered NGO #501(c)(3)</p>
            <div className="flex items-center space-x-6">
              <Link to="/privacy" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">Terms of Service</Link>
              <Link to="/admin" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">Admin</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
