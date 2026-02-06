import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, LogOut, Home, Film, Grid3x3, Mail, Menu, X, LayoutDashboard, Ticket } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LogoutConfirmationModal from './LogoutConfirmationModal';

const Navbar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { currentUser, userData, logout } = useAuth();
  const navigate = useNavigate();

  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    setShowLogoutModal(false);
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.search.value;
    if (query.trim()) {
      navigate(`/movies?search=${encodeURIComponent(query)}`);
      setSearchOpen(false);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 border-b border-purple-800 shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-purple-600 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                  <Film className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full animate-pulse"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-red-500 via-purple-500 to-red-500 bg-clip-text text-transparent">
                CineVerse
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-300 hover:scale-105"
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </Link>
              <Link
                to="/movies"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-300 hover:scale-105"
              >
                <Film className="w-5 h-5" />
                <span>Movies</span>
              </Link>
              <Link
                to="/movies/category"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-300 hover:scale-105"
              >
                <Grid3x3 className="w-5 h-5" />
                <span>Category</span>
              </Link>
              <Link
                to="/contact"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-300 hover:scale-105"
              >
                <Mail className="w-5 h-5" />
                <span>Contact</span>
              </Link>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Search Icon */}
              <div ref={searchRef} className="relative">
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="p-2 rounded-full bg-purple-800/50 hover:bg-purple-700/50 transition-colors duration-300"
                >
                  <Search className="w-5 h-5 text-white" />
                </button>

                {searchOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-xl border border-purple-700 p-2 animate-slideDown">
                    <form onSubmit={handleSearch} className="flex">
                      <input
                        type="text"
                        name="search"
                        placeholder="Search movies..."
                        className="flex-grow bg-gray-700 text-white px-3 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-r-lg transition-colors duration-300"
                      >
                        <Search className="w-5 h-5" />
                      </button>
                    </form>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div ref={userMenuRef} className="relative">
                {currentUser ? (
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2 p-1 rounded-full bg-gradient-to-r from-purple-700 to-red-700 hover:from-purple-600 hover:to-red-600 transition-all duration-300"
                  >
                    <img
                      src={userData?.profileImage || `https://ui-avatars.com/api/?name=User&background=FF6B6B&color=fff`}
                      alt="Profile"
                      className="w-8 h-8 rounded-full border-2 border-white"
                    />
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/login')}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    <User className="w-5 h-5" />
                    <span>Login</span>
                  </button>
                )}

                {userMenuOpen && currentUser && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-purple-700 py-2 animate-slideDown z-50">
                    <div className="px-4 py-3 border-b border-gray-700">
                      <p className="text-sm font-semibold text-white">{userData?.name || 'User'}</p>
                      <p className="text-xs text-gray-400">{userData?.email}</p>
                    </div>

                    {userData?.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-purple-900/30 hover:text-white transition-colors duration-200"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Dashboard</span>
                      </Link>
                    )}

                    <Link
                      to="/my-bookings"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-purple-900/30 hover:text-white transition-colors duration-200"
                    >
                      <Ticket className="w-4 h-4" />
                      <span>My Bookings</span>
                    </Link>

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        setShowLogoutModal(true);
                      }}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg bg-purple-800/50 hover:bg-purple-700/50 transition-colors duration-300"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-700 pt-4 animate-slideDown">
              <div className="flex flex-col space-y-4">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors duration-300"
                >
                  <Home className="w-5 h-5" />
                  <span>Home</span>
                </Link>
                <Link
                  to="/movies"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors duration-300"
                >
                  <Film className="w-5 h-5" />
                  <span>Movies</span>
                </Link>
                <Link
                  to="/movies?category=now-playing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors duration-300"
                >
                  <Grid3x3 className="w-5 h-5" />
                  <span>Category</span>
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors duration-300"
                >
                  <Mail className="w-5 h-5" />
                  <span>Contact</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};

export default Navbar;