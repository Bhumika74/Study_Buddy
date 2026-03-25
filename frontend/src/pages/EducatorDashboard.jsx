import { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';

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
      name: 'Students',
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

  const EducatorHome = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-3xl font-bold mb-2">Educator Dashboard</h1>
        <p className="text-green-100">Create and manage courses, assignments, and student progress</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">📚</span>
            <span className="text-3xl font-bold text-blue-600">12</span>
          </div>
          <p className="text-gray-600 font-medium">Active Courses</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">👥</span>
            <span className="text-3xl font-bold text-purple-600">156</span>
          </div>
          <p className="text-gray-600 font-medium">Total Students</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">📝</span>
            <span className="text-3xl font-bold text-green-600">23</span>
          </div>
          <p className="text-gray-600 font-medium">Assignments</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">⭐</span>
            <span className="text-3xl font-bold text-orange-600">4.8</span>
          </div>
          <p className="text-gray-600 font-medium">Avg Rating</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Link
              to="/educator/courses"
              className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
            >
              <span className="text-2xl">➕</span>
              <span className="font-medium text-gray-800">Create New Course</span>
            </Link>
            <Link
              to="/educator/assignments"
              className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition"
            >
              <span className="text-2xl">📋</span>
              <span className="font-medium text-gray-800">Create Assignment</span>
            </Link>
            <Link
              to="/educator/materials"
              className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition"
            >
              <span className="text-2xl">📤</span>
              <span className="font-medium text-gray-800">Upload Materials</span>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Educator Features</h2>
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <span className="text-green-600">✓</span>
              <span className="text-sm text-gray-700">Create and manage course curriculum</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-green-600">✓</span>
              <span className="text-sm text-gray-700">Upload notes, syllabus, and materials</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-green-600">✓</span>
              <span className="text-sm text-gray-700">Create assignments and quizzes</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-green-600">✓</span>
              <span className="text-sm text-gray-700">Track student progress and performance</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-green-600">✓</span>
              <span className="text-sm text-gray-700">Manage practice sessions</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <aside
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed lg:relative lg:translate-x-0 z-30 w-64 bg-white h-full shadow-xl transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <span className="text-lg font-bold text-gray-800">Educator Panel</span>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden text-gray-600 hover:text-gray-800"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                      isActive(item.path)
                        ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.icon}
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
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
            <span className="text-lg font-bold text-gray-800">Educator Panel</span>
            <div className="w-6"></div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 lg:p-8">
          <Routes>
            <Route path="/" element={<EducatorHome />} />
            <Route path="/courses" element={<div className="bg-white rounded-xl p-8 shadow-md text-center"><h2 className="text-2xl font-bold text-gray-800">Course Management - Coming Soon</h2></div>} />
            <Route path="/assignments" element={<div className="bg-white rounded-xl p-8 shadow-md text-center"><h2 className="text-2xl font-bold text-gray-800">Assignment Management - Coming Soon</h2></div>} />
            <Route path="/students" element={<div className="bg-white rounded-xl p-8 shadow-md text-center"><h2 className="text-2xl font-bold text-gray-800">Student Management - Coming Soon</h2></div>} />
            <Route path="/materials" element={<div className="bg-white rounded-xl p-8 shadow-md text-center"><h2 className="text-2xl font-bold text-gray-800">Materials Upload - Coming Soon</h2></div>} />
            <Route path="/profile" element={<div className="bg-white rounded-xl p-8 shadow-md text-center"><h2 className="text-2xl font-bold text-gray-800">Profile - Coming Soon</h2></div>} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default EducatorDashboard;