import { useState } from 'react';
import { Link } from 'react-router-dom';

const StudentHome = () => {
  const [stats] = useState({
    coursesEnrolled: 5,
    completedLessons: 42,
    quizzesTaken: 18,
    studyStreak: 7,
    aiChatsToday: 3,
    uploadedNotes: 12
  });

  const recentActivities = [
    { id: 1, type: 'quiz', title: 'Completed Mathematics Quiz', time: '2 hours ago', score: 85 },
    { id: 2, type: 'ai-chat', title: 'AI Chat: Quantum Physics', time: '5 hours ago' },
    { id: 3, type: 'upload', title: 'Uploaded Chemistry Notes', time: '1 day ago' },
    { id: 4, type: 'course', title: 'Started Advanced Programming', time: '2 days ago' }
  ];

  const quickActions = [
    {
      title: 'Chat with AI Tutor',
      description: 'Get instant help with any topic',
      path: '/student/ai-chat',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Upload Study Material',
      description: 'Get AI-generated summaries and quizzes',
      path: '/student/upload',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Generate Quiz',
      description: 'AI creates custom practice tests',
      path: '/student/quiz',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      gradient: 'from-green-500 to-teal-500'
    },
    {
      title: 'View Progress',
      description: 'Track your learning analytics',
      path: '/student/progress',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
     <div className="rounded-2xl p-8 text-white shadow-xl"
  style={{ background: '#1a7a6e' }}>
  <h1 className="text-3xl font-bold mb-2">Welcome Back, Student! 👋</h1>
  <p style={{ color: 'rgba(255,255,255,0.8)' }}>Ready to continue your learning journey with AI-powered assistance?</p>
</div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">📚</span>
            <span className="text-2xl font-bold text-blue-600">{stats.coursesEnrolled}</span>
          </div>
          <p className="text-sm text-gray-600 font-medium">Active Courses</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">✅</span>
            <span className="text-2xl font-bold text-green-600">{stats.completedLessons}</span>
          </div>
          <p className="text-sm text-gray-600 font-medium">Lessons Done</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">📝</span>
            <span className="text-2xl font-bold text-purple-600">{stats.quizzesTaken}</span>
          </div>
          <p className="text-sm text-gray-600 font-medium">Quizzes Taken</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">🔥</span>
            <span className="text-2xl font-bold text-orange-600">{stats.studyStreak}</span>
          </div>
          <p className="text-sm text-gray-600 font-medium">Day Streak</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">🤖</span>
            <span className="text-2xl font-bold text-cyan-600">{stats.aiChatsToday}</span>
          </div>
          <p className="text-sm text-gray-600 font-medium">AI Chats Today</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">📤</span>
            <span className="text-2xl font-bold text-pink-600">{stats.uploadedNotes}</span>
          </div>
          <p className="text-sm text-gray-600 font-medium">Notes Uploaded</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.path}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transform hover:-translate-y-1 transition duration-300"
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${action.gradient} rounded-lg flex items-center justify-center text-white mb-4`}>
                {action.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Recent Activity</h2>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All
          </button>
        </div>
        <div className="space-y-3">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition">
              <div className="mt-1">
                {activity.type === 'quiz' && (
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">📝</span>
                  </div>
                )}
                {activity.type === 'ai-chat' && (
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">🤖</span>
                  </div>
                )}
                {activity.type === 'upload' && (
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">📤</span>
                  </div>
                )}
                {activity.type === 'course' && (
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">📚</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">{activity.title}</p>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
              {activity.score && (
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">{activity.score}%</p>
                  <p className="text-xs text-gray-500">Score</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentHome;