import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const StudentCourses = () => {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterSubject, setFilterSubject] = useState('all');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchCourses();
    fetchEnrolledCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/student/courses', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrolledCourses = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/student/progress', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setEnrolledCourses(data.map(p => p.courseId));
      }
    } catch (error) {
      console.error('Failed to fetch enrolled courses:', error);
    }
  };

  const handleEnrollCourse = async (courseId) => {
    try {
      const response = await fetch('http://localhost:5000/api/student/enroll', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ courseId })
      });

      if (response.ok) {
        setSuccessMessage('✓ Enrolled successfully!');
        setEnrolledCourses([...enrolledCourses, courseId]);
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        const data = await response.json();
        setErrorMessage(data.error || 'Failed to enroll');
        setTimeout(() => setErrorMessage(''), 3000);
      }
    } catch (error) {
      setErrorMessage('Network error. Please try again.');
      console.error('Error:', error);
    }
  };

  const subjects = ['all', ...new Set(courses.map(c => c.subject))];
  const filteredCourses = filterSubject === 'all'
    ? courses
    : courses.filter(c => c.subject === filterSubject);

  return (
    <div className="space-y-6" style={{ fontFamily: "'Inter', sans-serif", color: 'white' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#1e0a3c 0%,#0f1f3d 50%,#0d1117 100%)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: 20, padding: '28px 32px', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle,rgba(168,85,247,0.2) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div className="relative z-1">
          <h1 className="text-3xl font-bold mb-2">Available Courses</h1>
          <p className="text-gray-400">Explore and enroll in courses taught by expert educators</p>
        </div>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="p-4 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg">
          {errorMessage}
        </div>
      )}

      {/* Filter by Subject */}
      <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)' }} className="rounded-xl shadow-md p-6">
        <label className="block text-sm font-medium text-gray-300 mb-3">Filter by Subject</label>
        <div className="flex flex-wrap gap-2">
          {subjects.map(subject => (
            <button
              key={subject}
              onClick={() => setFilterSubject(subject)}
              className={`px-4 py-2 rounded-full font-medium transition ${
                filterSubject === subject
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/5'
              }`}
            >
              {subject.charAt(0).toUpperCase() + subject.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="text-center py-8 text-gray-400">Loading courses...</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.length > 0 ? (
            filteredCourses.map(course => {
              const isEnrolled = enrolledCourses.includes(course.id);
              return (
                <div
                  key={course.id}
                  style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)' }}
                  className="rounded-xl shadow-md hover:shadow-lg transition overflow-hidden hover:-translate-y-1"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-block px-3 py-1 bg-purple-900/40 text-purple-400 text-sm font-medium rounded-full border border-purple-800/30">
                        {course.subject}
                      </span>
                      <span className="text-sm text-gray-400">Grade: {course.grade}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{course.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{course.description}</p>

                    <div className="space-y-2 mb-4 text-sm text-gray-400">
                      <div className="flex justify-between">
                        <span>📅 Duration:</span>
                        <span className="font-medium text-gray-200">{course.duration} weeks</span>
                      </div>
                      <div className="flex justify-between">
                        <span>👥 Max Students:</span>
                        <span className="font-medium text-gray-200">{course.maxStudents}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      {isEnrolled ? (
                        <>
                          <Link
                            to={`/student/course/${course.id}`}
                            className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium text-center hover:bg-green-700 transition shadow-md shadow-green-900/25"
                          >
                            View Course
                          </Link>
                        </>
                      ) : (
                        <button
                          onClick={() => handleEnrollCourse(course.id)}
                          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg font-medium hover:opacity-90 transition shadow-md shadow-purple-900/25"
                        >
                          Enroll Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-8 text-gray-400">
              No courses found in this subject
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentCourses;
