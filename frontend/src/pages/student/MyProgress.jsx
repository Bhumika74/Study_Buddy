import { useState } from 'react';

const MyProgress = () => {
  const [timeframe, setTimeframe] = useState('week');

  const stats = {
    totalStudyTime: '24h 30m',
    coursesCompleted: 3,
    averageScore: 85,
    streak: 7,
    quizzesCompleted: 18,
    notesCreated: 12
  };

  const weeklyActivity = [
    { day: 'Mon', hours: 2, quizzes: 2 },
    { day: 'Tue', hours: 3, quizzes: 1 },
    { day: 'Wed', hours: 1.5, quizzes: 3 },
    { day: 'Thu', hours: 4, quizzes: 2 },
    { day: 'Fri', hours: 2.5, quizzes: 1 },
    { day: 'Sat', hours: 5, quizzes: 4 },
    { day: 'Sun', hours: 3, quizzes: 2 }
  ];

  const courseProgress = [
    { name: 'Mathematics', progress: 85, color: 'blue' },
    { name: 'Physics', progress: 70, color: 'purple' },
    { name: 'Chemistry', progress: 92, color: 'green' },
    { name: 'Biology', progress: 65, color: 'pink' },
    { name: 'Computer Science', progress: 78, color: 'orange' }
  ];

  const recentQuizzes = [
    { id: 1, subject: 'Algebra', score: 90, date: '2024-03-01', difficulty: 'Medium' },
    { id: 2, subject: 'Quantum Physics', score: 75, date: '2024-02-28', difficulty: 'Hard' },
    { id: 3, subject: 'Organic Chemistry', score: 95, date: '2024-02-27', difficulty: 'Medium' },
    { id: 4, subject: 'Cell Biology', score: 82, date: '2024-02-26', difficulty: 'Easy' }
  ];

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">My Progress</h1>
              <p className="text-gray-600">Track your learning journey and achievements</p>
            </div>
          </div>
          <div className="flex space-x-2">
            {['week', 'month', 'year'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-4 py-2 rounded-lg font-medium capitalize transition ${
                  timeframe === tf
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">⏱️</span>
            <span className="text-sm text-blue-600 font-semibold">+2h today</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.totalStudyTime}</p>
          <p className="text-sm text-gray-600">Total Study Time</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">✅</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.coursesCompleted}</p>
          <p className="text-sm text-gray-600">Courses Completed</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">📊</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.averageScore}%</p>
          <p className="text-sm text-gray-600">Average Score</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">🔥</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.streak} days</p>
          <p className="text-sm text-gray-600">Study Streak</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">📝</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.quizzesCompleted}</p>
          <p className="text-sm text-gray-600">Quizzes Done</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">📚</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.notesCreated}</p>
          <p className="text-sm text-gray-600">Notes Created</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly Activity Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Weekly Activity</h2>
          <div className="space-y-3">
            {weeklyActivity.map((day, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{day.day}</span>
                  <span className="text-sm text-gray-600">{day.hours}h • {day.quizzes} quizzes</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full"
                    style={{ width: `${(day.hours / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Course Progress */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Course Progress</h2>
          <div className="space-y-4">
            {courseProgress.map((course, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-800">{course.name}</span>
                  <span className="text-sm font-semibold text-gray-700">{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getProgressColor(course.progress)}`}
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Quiz Results */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Quiz Results</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Subject</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Score</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Difficulty</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentQuizzes.map((quiz) => (
                <tr key={quiz.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="py-3 px-4 font-medium text-gray-800">{quiz.subject}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(quiz.score)}`}>
                      {quiz.score}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {quiz.difficulty}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{quiz.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Achievements</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <span className="text-3xl">🏆</span>
            <div>
              <p className="font-semibold text-gray-800">Quiz Master</p>
              <p className="text-sm text-gray-600">Completed 10 quizzes</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <span className="text-3xl">📚</span>
            <div>
              <p className="font-semibold text-gray-800">Dedicated Learner</p>
              <p className="text-sm text-gray-600">7-day study streak</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
            <span className="text-3xl">⭐</span>
            <div>
              <p className="font-semibold text-gray-800">High Scorer</p>
              <p className="text-sm text-gray-600">Avg score above 85%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProgress;