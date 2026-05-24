import { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import EducatorHome from './educator/EducatorHome';
import CourseManagement from './educator/CourseManagement';
import AssignmentManagement from './educator/AssignmentManagement';
import MaterialManagement from './educator/MaterialManagement';
import StudentProgress from './educator/StudentProgress';
import EducatorProfile from './educator/EducatorProfile';

const EducatorDashboard = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigation = [
    {
      name: 'Dashboard',
      path: '/educator',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      name: 'My Courses',
      path: '/educator/courses',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      name: 'Assignments',
      path: '/educator/assignments',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      name: 'Student Progress',
      path: '/educator/students',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      name: 'Materials',
      path: '/educator/materials',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      )
    },
    {
      name: 'Profile',
      path: '/educator/profile',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    }
  ];

  const isActive = (path) => {
    if (path === '/educator') {
      return location.pathname === '/educator';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0d1117', overflow: 'hidden', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        .ed-sidebar { width: 256px; background: #0d1b2e; border-right: 1px solid rgba(255,255,255,0.06); display: flex; flex-direction: column; height: 100vh; flex-shrink: 0; }
        .ed-nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 16px; border-radius: 10px; margin-bottom: 4px; cursor: pointer; transition: all 0.2s; color: rgba(255,255,255,0.5); text-decoration: none; font-size: 0.875rem; font-weight: 500; }
        .ed-nav-item:hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.85); }
        .ed-nav-item.active { background: linear-gradient(135deg, #06b6d4, #3b82f6); color: white; box-shadow: 0 4px 15px rgba(6,182,212,0.35); }
        .ed-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
        .ed-content { flex: 1; overflow-y: auto; padding: 28px; background: #0d1117; }
        .ed-content::-webkit-scrollbar { width: 6px; }
        .ed-content::-webkit-scrollbar-track { background: transparent; }
        .ed-content::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
        .ed-mobile-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 20; }
        @media (max-width: 1024px) {
          .ed-sidebar { position: fixed; z-index: 30; transform: translateX(-100%); transition: transform 0.3s; }
          .ed-sidebar.open { transform: translateX(0); }
          .ed-mobile-header { display: flex !important; }
        }
        .ed-mobile-header { display: none; align-items: center; justify-content: space-between; padding: 12px 16px; background: #0d1b2e; border-bottom: 1px solid rgba(255,255,255,0.06); }
      `}</style>

      {isSidebarOpen && (
        <div className="ed-mobile-overlay" onClick={() => setIsSidebarOpen(false)} />
      )}

      <aside className={`ed-sidebar${isSidebarOpen ? ' open' : ''}`}>
        {/* Logo */}
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#06b6d4,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg style={{ width: 20, height: 20, color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <span style={{ color: 'white', fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.01em' }}>Educator Panel</span>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} style={{ color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer' }} className="lg:hidden">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search */}
        <div style={{ padding: '14px 16px 10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '8px 12px', border: '1px solid rgba(255,255,255,0.07)' }}>
            <svg style={{ width: 14, height: 14, color: 'rgba(255,255,255,0.3)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" />
            </svg>
            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>Search...</span>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '8px 12px', overflowY: 'auto' }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.25)', marginBottom: 8, paddingLeft: 4 }}>Main Menu</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`ed-nav-item${isActive(item.path) ? ' active' : ''}`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div style={{ padding: '12px 16px 20px' }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(59,130,246,0.1))', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <svg style={{ width: 16, height: 16, color: '#06b6d4' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span style={{ fontWeight: 700, color: 'white', fontSize: '0.8rem' }}>Educator Tools</span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>Manage courses, track student progress & more</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ed-main">
        <header className="ed-mobile-header">
          <button onClick={() => setIsSidebarOpen(true)} style={{ color: 'rgba(255,255,255,0.6)', background: 'none', border: 'none', cursor: 'pointer' }}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span style={{ color: 'white', fontWeight: 800, fontSize: '1rem' }}>Educator Panel</span>
          <div style={{ width: 24 }} />
        </header>

        <main className="ed-content">
          <Routes>
            <Route path="/" element={<EducatorHome />} />
            <Route path="/courses" element={<CourseManagement />} />
            <Route path="/assignments" element={<AssignmentManagement />} />
            <Route path="/students" element={<StudentProgress />} />
            <Route path="/materials" element={<MaterialManagement />} />
            <Route path="/profile" element={<EducatorProfile />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default EducatorDashboard;