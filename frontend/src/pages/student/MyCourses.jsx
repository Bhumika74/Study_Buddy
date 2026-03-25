import { useState } from 'react';

const MyCourses = () => {
  const [activeTab, setActiveTab] = useState('enrolled');

  const enrolledCourses = [
    {
      id: 1,
      title: 'Advanced Mathematics',
      instructor: 'Dr. Sarah Johnson',
      progress: 75,
      nextLesson: 'Calculus Integration',
      totalLessons: 24,
      completedLessons: 18,
      image: '📐'
    },
    {
      id: 2,
      title: 'Quantum Physics',
      instructor: 'Prof. Michael Chen',
      progress: 60,
      nextLesson: 'Wave-Particle Duality',
      totalLessons: 20,
      completedLessons: 12,
      image: '⚛️'
    },
    {
      id: 3,
      title: 'Organic Chemistry',
      instructor: 'Dr. Emily Rodriguez',
      progress: 90,
      nextLesson: 'Reaction Mechanisms',
      totalLessons: 18,
      completedLessons: 16,
      image: '🧪'
    }
  ];

  const availableCourses = [
    {
      id: 4,
      title: 'Machine Learning Fundamentals',
      instructor: 'Dr. James Wilson',
      description: 'Learn the basics of ML algorithms and applications',
      duration: '12 weeks',
      level: 'Intermediate',
      image: '🤖'
    },
    {
      id: 5,
      title: 'World History',
      instructor: 'Prof. Lisa Anderson',
      description: 'Comprehensive study of major historical events',
      duration: '10 weeks',
      level: 'Beginner',
      image: '🌍'
    },
    {
      id: 6,
      title: 'Data Structures & Algorithms',
      instructor: 'Dr. Robert Kumar',
      description: 'Master fundamental CS concepts and problem-solving',
      duration: '14 weeks',
      level: 'Advanced',
      image: '💻'
    }
  ];

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-700';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-700';
      case 'Advanced':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">My Courses</h1>
        <p className="text-gray-600">Manage your enrolled courses and explore new ones</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md p-2">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('enrolled')}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'enrolled'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Enrolled Courses ({enrolledCourses.length})
          </button>
          <button
            onClick={() => setActiveTab('available')}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'available'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Available Courses ({availableCourses.length})
          </button>
        </div>
      </div>

      {/* Enrolled Courses */}
      {activeTab === 'enrolled' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-32 flex items-center justify-center">
                <span className="text-6xl">{course.image}</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-4">by {course.instructor}</p>
                
                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm font-semibold text-blue-600">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {course.completedLessons} of {course.totalLessons} lessons completed
                  </p>
                </div>

                {/* Next Lesson */}
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Next Lesson:</p>
                  <p className="text-sm font-semibold text-gray-800">{course.nextLesson}</p>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                    Continue
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm">
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Available Courses */}
      {activeTab === 'available' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
              <div className="bg-gradient-to-r from-green-500 to-teal-500 h-32 flex items-center justify-center">
                <span className="text-6xl">{course.image}</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-3">by {course.instructor}</p>
                
                <p className="text-sm text-gray-700 mb-4">{course.description}</p>

                {/* Course Info */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{course.duration}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getLevelColor(course.level)}`}>
                    {course.level}
                  </span>
                </div>

                {/* Actions */}
                <button className="w-full px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition text-sm font-medium">
                  Enroll Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;