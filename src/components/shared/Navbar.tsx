import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart, ChevronDown } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState('');
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setDropdownOpen('');
  }, [location]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    {
      label: 'Programs', path: '/programs',
      dropdown: [
        { label: 'All Programs', path: '/programs' },
        { label: 'Education', path: '/programs?category=Education' },
        { label: 'Healthcare', path: '/programs?category=Healthcare' },
        { label: 'Environment', path: '/programs?category=Environment' },
      ]
    },
    { label: 'Events', path: '/events' },
    { label: 'News & Blog', path: '/blog' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <span className={`text-xl font-bold font-serif ${scrolled ? 'text-gray-900' : 'text-white'}`}>
                HopeRise
              </span>
              <p className={`text-xs ${scrolled ? 'text-green-600' : 'text-green-300'} -mt-1`}>Foundation</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <div key={link.path} className="relative group">
                {link.dropdown ? (
                  <>
                    <button
                      onMouseEnter={() => setDropdownOpen(link.label)}
                      onMouseLeave={() => setDropdownOpen('')}
                      className={`flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive(link.path)
                          ? 'text-green-500 bg-green-50'
                          : scrolled
                          ? 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                          : 'text-white/90 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    {dropdownOpen === link.label && (
                      <div
                        onMouseEnter={() => setDropdownOpen(link.label)}
                        onMouseLeave={() => setDropdownOpen('')}
                        className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                      >
                        {link.dropdown.map((item) => (
                          <Link key={item.path} to={item.path} className="block px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors">
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={link.path}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(link.path)
                        ? 'text-green-500 bg-green-50'
                        : scrolled
                        ? 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link to="/volunteer" className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${scrolled ? 'border-green-600 text-green-600 hover:bg-green-50' : 'border-white/60 text-white hover:bg-white/10'}`}>
              Volunteer
            </Link>
            <Link to="/donate" className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg text-sm font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg shadow-green-500/30 flex items-center space-x-2">
              <Heart className="w-4 h-4 fill-white" />
              <span>Donate Now</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className={`lg:hidden p-2 rounded-lg ${scrolled ? 'text-gray-700' : 'text-white'}`}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <div key={link.path}>
                <Link to={link.path} className={`block px-4 py-3 rounded-lg text-sm font-medium ${isActive(link.path) ? 'text-green-600 bg-green-50' : 'text-gray-700 hover:bg-gray-50'}`}>
                  {link.label}
                </Link>
                {link.dropdown && (
                  <div className="ml-4 mt-1 space-y-1">
                    {link.dropdown.slice(1).map((item) => (
                      <Link key={item.path} to={item.path} className="block px-4 py-2 text-sm text-gray-600 hover:text-green-600">
                        → {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-4 space-y-2">
              <Link to="/volunteer" className="block w-full text-center px-4 py-3 border border-green-600 text-green-600 rounded-lg text-sm font-medium hover:bg-green-50">
                Volunteer
              </Link>
              <Link to="/donate" className="block w-full text-center px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg text-sm font-semibold">
                ❤️ Donate Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
