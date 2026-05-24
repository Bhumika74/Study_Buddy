import { useState, useEffect } from 'react';

const MaterialManagement = () => {
  const [materials, setMaterials] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [filterCourse, setFilterCourse] = useState('all');

  const [formData, setFormData] = useState({
    title: '',
    courseId: '',
    type: 'notes',
    description: '',
    file: null,
    chapter: ''
  });

  const materialTypes = [
    { value: 'notes', label: '📓 Lecture Notes' },
    { value: 'syllabus', label: '📋 Syllabus' },
    { value: 'pdf', label: '📄 PDF Document' },
    { value: 'video', label: '🎥 Video Link' },
    { value: 'reference', label: '📚 Reference Material' },
    { value: 'other', label: '📎 Other' }
  ];

  // Fetch courses and materials
  useEffect(() => {
    fetchCourses();
    fetchMaterials();
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

  const fetchMaterials = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/educator/materials', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setMaterials(data);
      }
    } catch (error) {
      console.error('Failed to fetch materials:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrorMessage('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        setErrorMessage('File size must be less than 50MB');
        return;
      }
      setFormData(prev => ({ ...prev, file }));
      setErrorMessage('');
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setErrorMessage('Material title is required');
      return false;
    }
    if (!formData.courseId) {
      setErrorMessage('Please select a course');
      return false;
    }
    if (!formData.file && formData.type !== 'video') {
      setErrorMessage('Please select a file to upload');
      return false;
    }
    if (formData.type === 'video' && !formData.description.includes('http')) {
      setErrorMessage('For video, please provide a valid URL in description');
      return false;
    }
    return true;
  };

  const handleUploadMaterial = async () => {
    if (!validateForm()) return;

    setLoading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('title', formData.title);
    uploadFormData.append('courseId', formData.courseId);
    uploadFormData.append('type', formData.type);
    uploadFormData.append('description', formData.description);
    uploadFormData.append('chapter', formData.chapter);
    if (formData.file) {
      uploadFormData.append('file', formData.file);
    }

    try {
      const response = await fetch('http://localhost:5000/api/educator/materials', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: uploadFormData
      });

      if (response.ok) {
        const newMaterial = await response.json();
        setMaterials([...materials, newMaterial.material]);
        setSuccessMessage('✓ Material uploaded successfully!');
        setFormData({
          title: '',
          courseId: '',
          type: 'notes',
          description: '',
          file: null,
          chapter: ''
        });
        setShowForm(false);
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        const data = await response.json();
        setErrorMessage(data.error || 'Failed to upload material');
      }
    } catch (error) {
      setErrorMessage('Network error. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMaterial = async (materialId) => {
    if (!window.confirm('Are you sure you want to delete this material?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/educator/materials/${materialId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setMaterials(materials.filter(m => m.id !== materialId));
        setSuccessMessage('Material deleted successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const filteredMaterials = filterCourse === 'all' 
    ? materials 
    : materials.filter(m => m.courseId === filterCourse);

  const getMaterialIcon = (type) => {
    const icons = {
      notes: '📓',
      syllabus: '📋',
      pdf: '📄',
      video: '🎥',
      reference: '📚',
      other: '📎'
    };
    return icons[type] || '📎';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Study Materials</h1>
          <p className="text-gray-600 mt-2">Upload notes, syllabus, and learning materials</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg font-medium hover:shadow-lg transition"
        >
          + Upload Material
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

      {/* Upload Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Upload New Material</h2>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Material Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Chapter 3 Lecture Notes"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Course</label>
                <select
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Material Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {materialTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Chapter/Section (Optional)</label>
                <input
                  type="text"
                  name="chapter"
                  value={formData.chapter}
                  onChange={handleInputChange}
                  placeholder="e.g., Chapter 3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description / URL</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder={formData.type === 'video' ? 'Paste video URL here (YouTube, etc.)' : 'Describe the material...'}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {formData.type !== 'video' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select File</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.png,.jpg,.jpeg"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Max file size: 50MB. Accepted formats: PDF, Word, Excel, PowerPoint, Images</p>
                {formData.file && (
                  <p className="text-sm text-green-600 mt-2">✓ File selected: {formData.file.name}</p>
                )}
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={handleUploadMaterial}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg font-medium hover:shadow-lg transition disabled:opacity-50"
              >
                {loading ? 'Uploading...' : 'Upload Material'}
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
          <option value="all">All Materials</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
      </div>

      {/* Materials List */}
      <div className="space-y-4">
        {filteredMaterials.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-white rounded-xl">
            <p className="text-lg">No materials uploaded yet.</p>
            <p className="text-sm">Click "Upload Material" to get started</p>
          </div>
        ) : (
          filteredMaterials.map(material => {
            const course = courses.find(c => c.id === material.courseId);
            return (
              <div key={material.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">{getMaterialIcon(material.type)}</div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{material.title}</h3>
                      <p className="text-sm text-green-600 font-medium">{course?.title} {material.chapter && `- ${material.chapter}`}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    {material.type}
                  </span>
                </div>
                {material.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{material.description}</p>
                )}
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span>📅 {new Date(material.createdAt).toLocaleDateString()}</span>
                  <span>👥 {material.downloads || 0} downloads</span>
                </div>
                <div className="flex space-x-2">
                  <button className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition">
                    Preview
                  </button>
                  <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteMaterial(material.id)}
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

export default MaterialManagement;
