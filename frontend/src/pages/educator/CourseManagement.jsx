import { useState, useEffect } from 'react';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedCourseForDoubts, setSelectedCourseForDoubts] = useState(null);
  const [doubts, setDoubts] = useState([]);
  const [loadingDoubts, setLoadingDoubts] = useState(false);
  const [replyInput, setReplyInput] = useState({});

  const subjects = [
    'Mathematics', 'Science', 'English', 'History', 'Geography',
    'Computer Science', 'Physics', 'Chemistry', 'Biology', 'Economics',
    'Java', 'Python', 'Web Development', 'Data Science', 'Other'
  ];

  const [formData, setFormData] = useState({
    title: '',
    subject: 'Mathematics',
    description: '',
    grade: '10th Grade',
    duration: '',
    maxStudents: '',
    thumbnail: ''
  });

  // Fetch courses
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/educator/courses', {
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
    }
  };

  const fetchDoubts = async (courseId) => {
    setLoadingDoubts(true);
    try {
      const response = await fetch(`http://localhost:5000/api/chat/course/${courseId}/doubts`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setDoubts(data || []);
      }
    } catch (error) {
      console.error('Failed to fetch doubts:', error);
    } finally {
      setLoadingDoubts(false);
    }
  };

  const handleViewDoubts = (course) => {
    setSelectedCourseForDoubts(course);
    fetchDoubts(course.id);
  };

  const handleReplyToDoubt = async (messageId) => {
    if (!replyInput[messageId]?.trim()) return;

    try {
      const response = await fetch(`http://localhost:5000/api/chat/message/${messageId}/reply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reply: replyInput[messageId] })
      });

      if (response.ok) {
        const result = await response.json();
        setDoubts((prevDoubts) => [...prevDoubts, result.message]);
        setReplyInput((prevReplyInput) => ({ ...prevReplyInput, [messageId]: '' }));
        alert('✓ Reply posted successfully!');
      }
    } catch (error) {
      console.error('Error posting reply:', error);
      alert('Failed to post reply');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrorMessage('');
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setErrorMessage('Course title is required');
      return false;
    }
    if (!formData.description.trim()) {
      setErrorMessage('Course description is required');
      return false;
    }
    if (!formData.duration) {
      setErrorMessage('Course duration is required');
      return false;
    }
    if (!formData.maxStudents || parseInt(formData.maxStudents) <= 0) {
      setErrorMessage('Max students must be greater than 0');
      return false;
    }
    return true;
  };

  const handleCreateCourse = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/educator/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const newCourse = await response.json();
        setCourses([...courses, newCourse.course]);
        setSuccessMessage('✓ Course created successfully!');
        setFormData({
          title: '',
          subject: 'Mathematics',
          description: '',
          grade: '10th Grade',
          duration: '',
          maxStudents: '',
          thumbnail: ''
        });
        setShowForm(false);
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        const data = await response.json();
        setErrorMessage(data.error || 'Failed to create course');
      }
    } catch (error) {
      setErrorMessage('Network error. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/educator/courses/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setCourses(courses.filter(c => c.id !== courseId));
        setSuccessMessage('Course deleted successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        const data = await response.json();
        setErrorMessage(data.error || 'Failed to delete course');
      }
    } catch (error) {
      console.error('Delete error:', error);
      setErrorMessage('Error deleting course');
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course.id);
    setFormData({
      title: course.title,
      subject: course.subject,
      description: course.description,
      grade: course.grade,
      duration: course.duration,
      maxStudents: course.maxStudents,
      thumbnail: course.thumbnail || ''
    });
    setShowForm(true);
  };

  const handleUpdateCourse = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/educator/courses/${editingCourse}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const updatedCourse = await response.json();
        setCourses(courses.map(c => c.id === editingCourse ? updatedCourse.course : c));
        setSuccessMessage('✓ Course updated successfully!');
        setFormData({
          title: '',
          subject: 'Mathematics',
          description: '',
          grade: '10th Grade',
          duration: '',
          maxStudents: '',
          thumbnail: ''
        });
        setEditingCourse(null);
        setShowForm(false);
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        const data = await response.json();
        setErrorMessage(data.error || 'Failed to update course');
      }
    } catch (error) {
      setErrorMessage('Network error. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Courses</h1>
          <p className="text-gray-600 mt-2">Create and manage courses by subject</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg font-medium hover:shadow-lg transition"
        >
          + Create Course
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {errorMessage}
        </div>
      )}

      {/* Create/Edit Course Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {editingCourse ? 'Edit Course' : 'Create New Course'}
          </h2>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Python Basics, Advanced Java, etc."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {subjects.map(subj => (
                    <option key={subj} value={subj}>{subj}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the course content, objectives, and learning outcomes..."
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level</label>
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option>9th Grade</option>
                  <option>10th Grade</option>
                  <option>11th Grade</option>
                  <option>12th Grade</option>
                  <option>College/University</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (weeks)</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="e.g., 8"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Students</label>
                <input
                  type="number"
                  name="maxStudents"
                  value={formData.maxStudents}
                  onChange={handleInputChange}
                  placeholder="e.g., 50"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={editingCourse ? handleUpdateCourse : handleCreateCourse}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg font-medium hover:shadow-lg transition disabled:opacity-50"
              >
                {loading ? (editingCourse ? 'Updating...' : 'Creating...') : (editingCourse ? 'Update Course' : 'Create Course')}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingCourse(null);
                  setFormData({
                    title: '',
                    subject: 'Mathematics',
                    description: '',
                    grade: '10th Grade',
                    duration: '',
                    maxStudents: '',
                    thumbnail: ''
                  });
                }}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            <p className="text-lg">No courses created yet.</p>
            <p className="text-sm">Click "Create Course" to get started</p>
          </div>
        ) : (
          courses.map(course => (
            <div key={course.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
              <div className="bg-gradient-to-r from-green-500 to-teal-500 h-32"></div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{course.title}</h3>
                    <p className="text-sm text-green-600 font-medium">{course.subject}</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    {course.grade}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span>📚 {course.duration} weeks</span>
                  <span>👥 {course.maxStudents} students</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewDoubts(course)}
                    className="flex-1 px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition"
                  >
                    💬 Doubts
                  </button>
                  <button
                    onClick={() => handleEditCourse(course)}
                    className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Doubts Modal */}
      {selectedCourseForDoubts && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Course Doubts</h2>
                <p className="text-green-100">{selectedCourseForDoubts.title}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedCourseForDoubts(null);
                  setDoubts([]);
                }}
                className="text-2xl hover:bg-white/20 p-2 rounded"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {loadingDoubts ? (
                <div className="text-center py-8 text-gray-600">Loading doubts...</div>
              ) : doubts.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                  <p>No doubts posted yet for this course</p>
                </div>
              ) : (
                doubts.map((doubt) => (
                  <div key={doubt.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                        {doubt.sender?.name?.charAt(0) || 'S'}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{doubt.sender?.name || 'Student'}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(doubt.createdAt).toLocaleDateString()} {new Date(doubt.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-800">{doubt.message}</p>
                    </div>

                    <div className="border-t pt-3 mt-3">
                      <textarea
                        value={replyInput[doubt.id] || ''}
                        onChange={(e) => setReplyInput({ ...replyInput, [doubt.id]: e.target.value })}
                        placeholder="Type your response here..."
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      />
                      <button
                        onClick={() => handleReplyToDoubt(doubt.id)}
                        disabled={!replyInput[doubt.id]?.trim()}
                        className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 text-sm font-medium"
                      >
                        Send Reply
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;
