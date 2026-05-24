import { useState, useEffect } from 'react';

const AssignmentManagement = () => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [filterCourse, setFilterCourse] = useState('all');

  const [formData, setFormData] = useState({
    title: '',
    courseId: '',
    description: '',
    instructions: '',
    dueDate: '',
    maxMarks: '',
  });
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [coursesLoading, setCoursesLoading] = useState(false);

  // Fetch courses and assignments
  useEffect(() => {
    fetchCourses();
    fetchAssignments();
  }, []);

  const fetchCourses = async () => {
    setCoursesLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/educator/courses', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched courses:', data);
        setCourses(data);
      } else {
        console.error('Failed to fetch courses, status:', response.status);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setCoursesLoading(false);
    }
  };

  const fetchAssignments = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/educator/assignments', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAssignments(data);
      }
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrorMessage('');
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setErrorMessage('Assignment title is required');
      return false;
    }
    if (!formData.courseId) {
      setErrorMessage('Please select a course');
      return false;
    }
    if (!formData.description.trim()) {
      setErrorMessage('Assignment description is required');
      return false;
    }
    if (!formData.dueDate) {
      setErrorMessage('Due date is required');
      return false;
    }
    if (!formData.maxMarks || parseInt(formData.maxMarks) <= 0) {
      setErrorMessage('Max marks must be greater than 0');
      return false;
    }
    return true;
  };

  const handleCreateAssignment = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Use FormData to support optional file attachment
      const body = new FormData();
      body.append('title', formData.title);
      body.append('courseId', formData.courseId);
      body.append('description', formData.description);
      body.append('instructions', formData.instructions);
      body.append('dueDate', formData.dueDate);
      body.append('maxMarks', formData.maxMarks);
      if (attachmentFile) body.append('file', attachmentFile);

      const response = await fetch('http://localhost:5000/api/educator/assignments', {
        method: 'POST',
        headers: {
          // Do NOT set Content-Type; browser sets multipart boundary automatically
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body
      });

      if (response.ok) {
        const newAssignment = await response.json();
        setAssignments([...assignments, newAssignment.assignment]);
        setSuccessMessage('✓ Assignment created successfully!');
        setFormData({ title: '', courseId: '', description: '', instructions: '', dueDate: '', maxMarks: '' });
        setAttachmentFile(null);
        setShowForm(false);
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        const data = await response.json();
        setErrorMessage(data.error || 'Failed to create assignment');
      }
    } catch (error) {
      setErrorMessage('Network error. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/educator/assignments/${assignmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setAssignments(assignments.filter(a => a.id !== assignmentId));
        setSuccessMessage('Assignment deleted successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const filteredAssignments = filterCourse === 'all' 
    ? assignments 
    : assignments.filter(a => a.courseId === filterCourse);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Assignments</h1>
          <p className="text-gray-600 mt-2">Create and manage course assignments</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg font-medium hover:shadow-lg transition"
        >
          + Create Assignment
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

      {/* Create Assignment Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Create New Assignment</h2>
          
          {courses.length === 0 && (
            <div className="p-4 bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-lg mb-4">
              ⚠️ No courses found. Please create a course first before adding assignments.
            </div>
          )}

          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assignment Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Chapter 3 Exercises, Project Assignment 1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Course {coursesLoading && <span className="text-xs text-gray-500">(Loading...)</span>}
                </label>
                <select
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleInputChange}
                  disabled={courses.length === 0 || coursesLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">-- Select a Course --</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.title} ({course.subject})
                    </option>
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
                placeholder="Describe what the assignment is about..."
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Instructions</label>
              <textarea
                name="instructions"
                value={formData.instructions}
                onChange={handleInputChange}
                placeholder="Provide detailed instructions for students..."
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Marks</label>
                <input
                  type="number"
                  name="maxMarks"
                  value={formData.maxMarks}
                  onChange={handleInputChange}
                  placeholder="e.g., 100"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">File Attachment (Optional)</label>
                <input
                  type="file"
                  onChange={(e) => setAttachmentFile(e.target.files[0] || null)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {attachmentFile && (
                  <p className="text-xs text-green-600 mt-1">📎 {attachmentFile.name}</p>
                )}
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleCreateAssignment}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg font-medium hover:shadow-lg transition disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Assignment'}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter by Course */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Course</label>
        <select
          value={filterCourse}
          onChange={(e) => setFilterCourse(e.target.value)}
          className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="all">All Assignments</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {filteredAssignments.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-white rounded-xl">
            <p className="text-lg">No assignments created yet.</p>
            <p className="text-sm">Click "Create Assignment" to get started</p>
          </div>
        ) : (
          filteredAssignments.map(assignment => {
            const course = courses.find(c => c.id === assignment.courseId);
            return (
              <div key={assignment.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{assignment.title}</h3>
                    <p className="text-sm text-green-600 font-medium">{course?.title}</p>
                  </div>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                    {assignment.maxMarks} Marks
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4">{assignment.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span>📅 Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                  <span>📝 {assignment.status || 'Active'}</span>
                </div>
                <div className="flex space-x-2">
                  <button className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition">
                    View Submissions
                  </button>
                  <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteAssignment(assignment.id)}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AssignmentManagement;
