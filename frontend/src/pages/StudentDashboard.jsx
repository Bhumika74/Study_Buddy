import { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import StudentHome from './student/StudentHome';
import AIChat from './student/AIChat';
import MyProgress from './student/MyProgress';
import MyCourses from './student/MyCourses';
import UploadMaterial from './student/UploadMaterial';
import QuizGeneration from './student/QuizGeneration';
import StudentProfile from './student/StudentProfile';
import StudentCourses from './student/StudentCourses';
import CourseDetails from './student/CourseDetails';
import StudentProgress from './student/StudentProgress';

const StudentDashboard = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigation = [
    {
      name: 'Dashboard',
      path: '/student',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      name: 'AI Tutor Chat',
      path: '/student/ai-chat',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      badge: 'AI'
    },
    {
      name: 'Upload Materials',
      path: '/student/upload',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      )
    },
    {
      name: 'AI Quiz Generator',
      path: '/student/quiz',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      badge: 'AI'
    },
    {
      name: 'My Courses',
      path: '/student/courses',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      name: 'My Progress',
      path: '/student/progress',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      name: 'Profile',
      path: '/student/profile',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    }
  ];

  const isActive = (path) => {
    if (path === '/student') {
      return location.pathname === '/student';
    }
    return location.pathname.startsWith(path);
  };

  return (
<<<<<<< HEAD
    <div style={{ display: 'flex', height: '100vh', background: '#0d1117', overflow: 'hidden', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        .sd-sidebar { width: 256px; background: #0d1b2e; border-right: 1px solid rgba(255,255,255,0.06); display: flex; flex-direction: column; height: 100vh; flex-shrink: 0; }
        .sd-nav-item { display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; border-radius: 10px; margin-bottom: 4px; cursor: pointer; transition: all 0.2s; color: rgba(255,255,255,0.5); text-decoration: none; font-size: 0.875rem; font-weight: 500; }
        .sd-nav-item:hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.85); }
        .sd-nav-item.active { background: linear-gradient(135deg, #a855f7, #ec4899); color: white; box-shadow: 0 4px 15px rgba(168,85,247,0.35); }
        .sd-badge { font-size: 0.65rem; font-weight: 700; padding: 2px 7px; border-radius: 100px; background: #10b981; color: white; }
        .sd-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
        .sd-content { flex: 1; overflow-y: auto; padding: 28px; background: #0d1117; }
        .sd-content::-webkit-scrollbar { width: 6px; }
        .sd-content::-webkit-scrollbar-track { background: transparent; }
        .sd-content::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
        .sd-mobile-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 20; display: none; }
        @media (max-width: 1024px) {
          .sd-sidebar { position: fixed; z-index: 30; transform: translateX(-100%); transition: transform 0.3s; }
          .sd-sidebar.open { transform: translateX(0); }
          .sd-mobile-overlay { display: block; }
          .sd-mobile-header { display: flex !important; }
        }
        .sd-mobile-header { display: none; align-items: center; justify-content: space-between; padding: 12px 16px; background: #0d1b2e; border-bottom: 1px solid rgba(255,255,255,0.06); }
      `}</style>

      {/* Mobile Overlay */}
=======
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* Hide global navbar on this page only */}
      <style>{`
        .global-navbar { display: none !important; }
        nav.navbar  { display: none !important; }
      `}</style>

      {/* Mobile Sidebar Overlay */}
>>>>>>> 32f3dcd11122fc2299a77435e264b8f56721f81e
      {isSidebarOpen && (
        <div className="sd-mobile-overlay" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
<<<<<<< HEAD
      <aside className={`sd-sidebar${isSidebarOpen ? ' open' : ''}`}>
        {/* Logo */}
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#a855f7,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg className="w-5 h-5" style={{ color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
=======
      <aside
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed lg:relative lg:translate-x-0 z-30 w-64 bg-white h-full shadow-xl transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full">

          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {/* ✅ teal logo mark instead of blue-purple */}
                <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: '#1a7a6e' }}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                {/* ✅ teal text */}
                <span className="text-lg font-bold" style={{ color: '#1a7a6e' }}>Study Buddy</span>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden text-gray-600 hover:text-gray-800"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
>>>>>>> 32f3dcd11122fc2299a77435e264b8f56721f81e
                </svg>
              </div>
              <span style={{ color: 'white', fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.01em' }}>Student Portal</span>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} style={{ color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer' }} className="lg:hidden">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

<<<<<<< HEAD
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
                  className={`sd-nav-item${isActive(item.path) ? ' active' : ''}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {item.icon}
                    <span>{item.name}</span>
                  </div>
                  {item.badge && <span className="sd-badge">{item.badge}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer card */}
        <div style={{ padding: '12px 16px 20px' }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(236,72,153,0.1))', border: '1px solid rgba(168,85,247,0.2)', borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <svg style={{ width: 16, height: 16, color: '#a855f7' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span style={{ fontWeight: 700, color: 'white', fontSize: '0.8rem' }}>AI Features Active</span>
=======
          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg transition ${
                      isActive(item.path)
                        ? 'text-white shadow-md'  /* ✅ active: teal bg via inline style */
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    style={isActive(item.path) ? { background: '#1a7a6e' } : {}}
                  >
                    <div className="flex items-center space-x-3">
                      {item.icon}
                      <span className="font-medium">{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="px-2 py-1 text-xs bg-green-500 text-white rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200">
            {/* ✅ teal tinted box instead of blue-purple */}
            <div className="rounded-lg p-4" style={{ background: 'linear-gradient(135deg, #f0faf8, #e8f5f0)', border: '1px solid #d1faf4' }}>
              <div className="flex items-center space-x-2 mb-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  style={{ color: '#1a7a6e' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="font-semibold text-gray-800">AI Features</span>
              </div>
              <p className="text-xs text-gray-600">
                Powered by advanced AI to enhance your learning experience
              </p>
>>>>>>> 32f3dcd11122fc2299a77435e264b8f56721f81e
            </div>
            <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>Powered by advanced AI to enhance your learning</p>
          </div>

        </div>
      </aside>

      {/* Main Content */}
<<<<<<< HEAD
      <div className="sd-main">
        {/* Mobile Header */}
        <header className="sd-mobile-header">
          <button onClick={() => setIsSidebarOpen(true)} style={{ color: 'rgba(255,255,255,0.6)', background: 'none', border: 'none', cursor: 'pointer' }}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span style={{ color: 'white', fontWeight: 800, fontSize: '1rem' }}>Student Portal</span>
          <div style={{ width: 24 }} />
=======
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="text-gray-600 hover:text-gray-800"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            {/* ✅ teal text */}
            <span className="text-lg font-bold" style={{ color: '#1a7a6e' }}>Study Buddy</span>
            <div className="w-6"></div>
          </div>
>>>>>>> 32f3dcd11122fc2299a77435e264b8f56721f81e
        </header>

        {/* Content Area */}
        <main className="sd-content">
          <Routes>
            <Route path="/" element={<StudentHome />} />
            <Route path="/ai-chat" element={<AIChat />} />
            <Route path="/upload" element={<UploadMaterial />} />
            <Route path="/quiz" element={<QuizGeneration />} />
            <Route path="/courses" element={<StudentCourses />} />
            <Route path="/course/:courseId" element={<CourseDetails />} />
            <Route path="/progress" element={<StudentProgress />} />
            <Route path="/profile" element={<StudentProfile />} />
          </Routes>
        </main>

      </div>
    </div>
  );
};

export default StudentDashboard;