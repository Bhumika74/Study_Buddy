import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileOpen(false);
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'admin':    return '/admin';
      case 'educator': return '/educator';
      case 'student':  return '/student';
      default:         return '/';
    }
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">

          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              {/* ✅ teal logo mark */}
              <div className="p-2 rounded-lg" style={{ background: '#1a7a6e' }}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              {/* ✅ teal brand text */}
              <span className="text-xl font-bold" style={{ color: '#1a7a6e' }}>
                Study Buddy
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to={getDashboardLink()}
                  className="px-4 py-2 text-gray-700 font-medium transition"
                  onMouseEnter={e => e.target.style.color = '#1a7a6e'}
                  onMouseLeave={e => e.target.style.color = '#374151'}
                >
                  Dashboard
                </Link>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                  >
                    {/* ✅ teal avatar */}
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold"
                      style={{ background: '#1a7a6e' }}>
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="text-gray-700 font-medium">{user.name}</span>
                    <svg className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 border border-gray-200">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm text-gray-500">Signed in as</p>
                        <p className="text-sm font-semibold text-gray-800 capitalize">{user.role}</p>
                      </div>
                      <Link
                        to={`${getDashboardLink()}/profile`}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Profile Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* ✅ teal hover on Login */}
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 font-medium transition"
                  onMouseEnter={e => e.target.style.color = '#1a7a6e'}
                  onMouseLeave={e => e.target.style.color = '#374151'}
                >
                  Login
                </Link>
                {/* ✅ teal Sign Up button */}
                <Link
                  to="/register"
                  className="px-6 py-2 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition"
                  style={{ background: '#1a7a6e' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#155f55'}
                  onMouseLeave={e => e.currentTarget.style.background = '#1a7a6e'}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 focus:outline-none"
              onMouseEnter={e => e.currentTarget.style.color = '#1a7a6e'}
              onMouseLeave={e => e.currentTarget.style.color = '#374151'}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-3 space-y-2">
            {user ? (
              <>
                <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
                  {/* ✅ teal mobile avatar */}
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                    style={{ background: '#1a7a6e' }}>
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
                </div>
                <Link
                  to={getDashboardLink()}
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to={`${getDashboardLink()}/profile`}
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile Settings
                </Link>
                <button
                  onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                  className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                {/* ✅ teal mobile Sign Up */}
                <Link
                  to="/register"
                  className="block px-3 py-2 text-white rounded-lg text-center transition"
                  style={{ background: '#1a7a6e' }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;