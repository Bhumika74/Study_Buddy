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
    <nav style={{
      background: 'rgba(13,27,46,0.97)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      position: 'sticky', top: 0, zIndex: 50,
      fontFamily: "'Inter', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .nb-link {
          padding: 8px 16px; border-radius: 8px;
          font-size: 0.875rem; font-weight: 600;
          color: rgba(255,255,255,0.55); text-decoration: none;
          transition: all 0.18s;
        }
        .nb-link:hover { background: rgba(255,255,255,0.07); color: white; }
        .nb-dropdown {
          position: absolute; right: 0; top: calc(100% + 8px);
          background: #111827; border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px; padding: 6px;
          min-width: 200px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          animation: nbDropDown 0.15s ease;
        }
        @keyframes nbDropDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .nb-dd-item {
          display: block; padding: 10px 14px; border-radius: 10px;
          font-size: 0.875rem; font-weight: 600; color: rgba(255,255,255,0.65);
          text-decoration: none; transition: all 0.15s; cursor: pointer;
          background: none; border: none; width: 100%; text-align: left;
        }
        .nb-dd-item:hover { background: rgba(255,255,255,0.07); color: white; }
        .nb-dd-danger { color: #f87171 !important; }
        .nb-dd-danger:hover { background: rgba(239,68,68,0.1) !important; }
        .nb-mobile-drawer {
          background: #0d1b2e;
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 16px;
        }
        .nb-mobile-item {
          display: block; padding: 11px 14px; border-radius: 10px;
          font-size: 0.9rem; font-weight: 600; color: rgba(255,255,255,0.6);
          text-decoration: none; transition: all 0.15s; margin-bottom: 4px;
          background: none; border: none; width: 100%; text-align: left;
          cursor: pointer;
        }
        .nb-mobile-item:hover { background: rgba(255,255,255,0.07); color: white; }
      `}</style>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg,#a855f7,#ec4899)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(168,85,247,0.4)',
            }}>
              <svg width="18" height="18" fill="none" stroke="white" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span style={{ color: 'white', fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.02em' }}>
              Study Buddy
            </span>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }} className="hidden-mobile">
            {user ? (
              <>
                <Link to={getDashboardLink()} className="nb-link">Dashboard</Link>

                {/* Profile Dropdown */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '7px 14px', borderRadius: 100,
                      background: 'rgba(255,255,255,0.07)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
                  >
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: 'linear-gradient(135deg,#a855f7,#ec4899)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontWeight: 700, fontSize: '0.8rem',
                      boxShadow: '0 2px 8px rgba(168,85,247,0.4)',
                    }}>
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600, fontSize: '0.875rem' }}>
                      {user.name}
                    </span>
                    <svg
                      width="14" height="14" fill="none" stroke="rgba(255,255,255,0.4)" viewBox="0 0 24 24"
                      style={{ transform: isProfileOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isProfileOpen && (
                    <div className="nb-dropdown">
                      <div style={{
                        padding: '8px 14px 10px', marginBottom: 4,
                        borderBottom: '1px solid rgba(255,255,255,0.07)',
                      }}>
                        <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>
                          Signed in as
                        </p>
                        <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'white', textTransform: 'capitalize' }}>
                          {user.role}
                        </p>
                      </div>
                      <Link
                        to={`${getDashboardLink()}/profile`}
                        className="nb-dd-item"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        👤 Profile Settings
                      </Link>
                      <button onClick={handleLogout} className="nb-dd-item nb-dd-danger">
                        🚪 Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="nb-link">Login</Link>
                <Link
                  to="/register"
                  style={{
                    padding: '9px 20px', borderRadius: 100,
                    background: 'linear-gradient(135deg,#a855f7,#ec4899)',
                    color: 'white', fontWeight: 700, fontSize: '0.875rem',
                    textDecoration: 'none', transition: 'all 0.2s',
                    boxShadow: '0 4px 14px rgba(168,85,247,0.4)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'none'; }}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', display: 'none' }}
            className="show-mobile"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="nb-mobile-drawer">
          {user ? (
            <>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 14px', background: 'rgba(168,85,247,0.08)',
                border: '1px solid rgba(168,85,247,0.2)', borderRadius: 12, marginBottom: 12,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'linear-gradient(135deg,#a855f7,#ec4899)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 700, fontSize: '1rem',
                }}>
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <p style={{ fontWeight: 700, color: 'white', fontSize: '0.9rem' }}>{user.name}</p>
                  <p style={{ fontSize: '0.72rem', color: '#a855f7', fontWeight: 600, textTransform: 'capitalize' }}>{user.role}</p>
                </div>
              </div>
              <Link to={getDashboardLink()} className="nb-mobile-item" onClick={() => setIsMenuOpen(false)}>
                🏠 Dashboard
              </Link>
              <Link to={`${getDashboardLink()}/profile`} className="nb-mobile-item" onClick={() => setIsMenuOpen(false)}>
                👤 Profile Settings
              </Link>
              <button onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                className="nb-mobile-item" style={{ color: '#f87171' }}>
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nb-mobile-item" onClick={() => setIsMenuOpen(false)}>Login</Link>
              <Link
                to="/register"
                onClick={() => setIsMenuOpen(false)}
                style={{
                  display: 'block', padding: '11px 14px', borderRadius: 10,
                  background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: 'white',
                  fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', textAlign: 'center',
                }}
              >
                Sign Up Free
              </Link>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 768px) { .show-mobile { display: none !important; } }
        @media (max-width: 767px) { .hidden-mobile { display: none !important; } .show-mobile { display: flex !important; } }
      `}</style>
    </nav>
  );
};

export default Navbar;