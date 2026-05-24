import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const CourseDetails = () => {
  const { courseId } = useParams();
  const currentUserId = localStorage.getItem('userId');
  const [course, setCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [submittedAssignments, setSubmittedAssignments] = useState([]);
  const [doubts, setDoubts] = useState([]);
  const [doubtInput, setDoubtInput] = useState('');
  const [loadingDoubts, setLoadingDoubts] = useState(false);

  useEffect(() => {
    fetchCourseDetails();
    fetchProgress();
    fetchDoubts();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/student/courses/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCourse(data);
        setAssignments(data.assignments || []);
        setMaterials(data.materials || []);
      }
    } catch (error) {
      console.error('Failed to fetch course details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/student/progress/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setProgress(data);
        if (data.submittedAssignments) {
          setSubmittedAssignments(data.submittedAssignments);
        }
      }
    } catch (error) {
      console.error('Failed to fetch progress:', error);
    }
  };

  const fetchDoubts = async () => {
    setLoadingDoubts(true);
    try {
      const response = await fetch(`http://localhost:5000/api/chat/course/${courseId}/chat`, {
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

  const handlePostDoubt = async (e) => {
    e.preventDefault();
    if (!doubtInput.trim()) return;

    try {
      const response = await fetch(`http://localhost:5000/api/chat/course/${courseId}/doubt`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: doubtInput })
      });

      if (response.ok) {
        const result = await response.json();
        setDoubts((prevDoubts) => [...prevDoubts, result.message]);
        setDoubtInput('');
        return;
      } else {
        const error = await response.json().catch(() => ({}));
        alert(error.error || 'Failed to post doubt');
      }
    } catch (error) {
      console.error('Error posting doubt:', error);
      alert('Error posting doubt');
    }
  };

  const handleDeleteDoubt = async (messageId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/chat/message/${messageId}/delete-me`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setDoubts((prevDoubts) => prevDoubts.filter((d) => d.id !== messageId));
        alert('Doubt deleted');
      }
    } catch (error) {
      console.error('Error deleting doubt:', error);
    }
  };

  const handleSubmitAssignment = async (assignmentId) => {
    if (submittedAssignments.includes(assignmentId)) {
      alert('You have already submitted this assignment');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/student/submit-assignment', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          assignmentId,
          courseId,
          score: Math.floor(Math.random() * 100) // Mock score
        })
      });

      if (response.ok) {
        const result = await response.json();
        // Update submitted assignments from the response
        setSubmittedAssignments(result.progress.submittedAssignments || [...submittedAssignments, assignmentId]);
        fetchProgress();
        alert('✓ Assignment submitted successfully!');
      }
    } catch (error) {
      console.error('Error submitting assignment:', error);
      alert('Failed to submit assignment');
    }
  };

  const downloadFile = (url, filename) => {
    fetch(url, {
      headers: { 'Authorization': "Bearer " + localStorage.getItem('token') }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to download file');
        return res.blob();
      })
      .then(blob => {
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
      })
      .catch(err => {
        console.error('Download error:', err);
        alert('Failed to download file. Please try again.');
      });
  };

  const handleDownloadMaterial = (material) => {
    if (!material.fileUrl) {
      alert('This material does not have a file attached');
      return;
    }
    downloadFile('http://localhost:5000' + material.fileUrl, material.fileName || material.title + '.pdf');
  };

  const handleDownloadAttachment = (attachment) => {
    downloadFile('http://localhost:5000' + attachment.fileUrl, attachment.fileName);
  };

  if (loading) return <div className="text-center py-8 text-gray-400">Loading course...</div>;
  if (!course) return <div className="text-center py-8 text-gray-400">Course not found</div>;

  const progressPercentage = progress?.progress || 0;
  const getProgressColor = (percent) => {
    if (percent >= 80) return 'text-green-400';
    if (percent >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6" style={{ fontFamily: "'Inter', sans-serif", color: 'white' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#1e0a3c 0%,#0f1f3d 50%,#0d1117 100%)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: 20 }} className="p-8 text-white shadow-xl relative overflow-hidden">
        <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle,rgba(168,85,247,0.2) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div className="flex items-start justify-between relative z-1">
          <div>
            <span className="inline-block px-3 py-1 bg-purple-900/40 text-purple-400 border border-purple-800/30 rounded-full text-sm font-medium mb-3">
              {course.subject}
            </span>
            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
            <p className="text-gray-400">{course.description}</p>
          </div>
        </div>
      </div>

      {/* Progress Card */}
      {progress && (
        <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)' }} className="rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Overall Progress</p>
              <p className={`text-4xl font-bold ${getProgressColor(progressPercentage)}`}>
                {progressPercentage}%
              </p>
            </div>
            <div className="flex-1 mx-8">
              <div className="w-full bg-white/5 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm">Status</p>
              <p className="text-lg font-bold text-white capitalize">{progress.status}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-center">
              <p className="text-gray-400 text-sm">Assignments</p>
              <p className="text-2xl font-bold text-purple-400">{progress.assignmentsCompleted || 0}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm">Avg Score</p>
              <p className="text-2xl font-bold text-purple-400">{progress.averageScore?.toFixed(1) || 0}%</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm">Quizzes</p>
              <p className="text-2xl font-bold text-purple-400">{progress.quizzesTaken || 0}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {['overview', 'assignments', 'materials', 'ask-doubt'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-medium text-sm transition border-b-2 ${
              activeTab === tab
                ? 'text-purple-400 border-purple-500'
                : 'text-gray-400 border-transparent hover:text-gray-200'
            }`}
          >
            {tab === 'ask-doubt' ? '❓ Ask Doubt' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)' }} className="rounded-xl shadow-md p-6 space-y-4">
          <div>
            <h3 className="font-bold text-white mb-2">Course Description</h3>
            <p className="text-gray-300">{course.description}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-white/5 border border-white/5">
              <p className="text-gray-400 text-sm font-medium">Duration</p>
              <p className="text-2xl font-bold text-white">{course.duration} weeks</p>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/5">
              <p className="text-gray-400 text-sm font-medium">Grade Level</p>
              <p className="text-2xl font-bold text-white">{course.grade}</p>
            </div>
          </div>
        </div>
      )}

      {/* Assignments Tab */}
      {activeTab === 'assignments' && (
        <div className="space-y-4">
          {assignments.length > 0 ? (
            assignments.map(assignment => (
              <div key={assignment.id} style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)' }} className="rounded-xl shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-white text-lg">{assignment.title}</h3>
                    <p className="text-gray-400 text-sm">
                      📅 Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-purple-950/40 text-purple-400 border border-purple-800/30 rounded-full text-sm font-medium">
                    {assignment.maxMarks} marks
                  </span>
                </div>
                <p className="text-gray-300 mb-4">{assignment.description}</p>
                {assignment.instructions && (
                  <div className="p-4 rounded-lg mb-4" style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.15)' }}>
                    <p className="text-sm text-gray-300"><strong>Instructions:</strong> {assignment.instructions}</p>
                  </div>
                )}
                {/* Task File Attachments */}
                {assignment.attachments && assignment.attachments.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-300 mb-2">📎 Task Files:</p>
                    <div className="space-y-2">
                      {assignment.attachments.map((att, idx) => (
                        <div key={idx} className="flex items-center justify-between rounded-lg px-4 py-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                          <span className="text-sm text-gray-300 truncate">{att.fileName}</span>
                          <button
                            onClick={() => handleDownloadAttachment(att)}
                            className="ml-4 px-3 py-1 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700 transition flex-shrink-0"
                          >
                            ↓ Download
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <button
                  onClick={() => handleSubmitAssignment(assignment.id)}
                  disabled={submittedAssignments.includes(assignment.id)}
                  className={`w-full py-2 rounded-lg font-medium transition ${
                    submittedAssignments.includes(assignment.id)
                      ? 'bg-green-800/40 text-green-300 border border-green-700/30 cursor-not-allowed'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                >
                  {submittedAssignments.includes(assignment.id) ? '✓ Completed' : 'Submit Assignment'}
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-400">
              No assignments available for this course
            </div>
          )}
        </div>
      )}

      {/* Materials Tab */}
      {activeTab === 'materials' && (
        <div className="space-y-4">
          {materials.length > 0 ? (
            materials.map(material => (
              <div key={material.id} style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)' }} className="rounded-xl shadow-md p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">
                        {material.type === 'notes' && '📓'}
                        {material.type === 'syllabus' && '📋'}
                        {material.type === 'pdf' && '📄'}
                        {material.type === 'video' && '🎥'}
                        {material.type === 'reference' && '📚'}
                        {material.type === 'other' && '📎'}
                      </span>
                      <div>
                        <h3 className="font-bold text-white">{material.title}</h3>
                        <p className="text-sm text-gray-400">{material.type.toUpperCase()}</p>
                      </div>
                    </div>
                    {material.description && (
                      <p className="text-gray-300 text-sm">{material.description}</p>
                    )}
                    {material.chapter && (
                      <p className="text-sm text-gray-400 mt-1">Chapter: {material.chapter}</p>
                    )}
                  </div>
                  <button 
                    onClick={() => handleDownloadMaterial(material)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                  >
                    Download
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-400">
              No materials available for this course
            </div>
          )}
        </div>
      )}

      {/* Ask Doubt Tab */}
      {activeTab === 'ask-doubt' && (
        <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)' }} className="rounded-2xl shadow-md overflow-hidden">
          <div className="px-6 py-5" style={{ background: '#1e293b', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 className="font-bold text-white text-lg">Doubt Chat</h3>
            <p className="text-sm text-gray-400 mt-1">
              Ask questions here and continue the conversation with your educator in a clean chat view.
            </p>
          </div>

          <div className="p-4 md:p-6 space-y-5" style={{ background: '#0d1117' }}>
            <div className="rounded-2xl shadow-sm" style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-sm font-semibold text-white">Conversation</p>
              </div>

              <div className="max-h-[30rem] overflow-y-auto p-4 space-y-4">
                {loadingDoubts ? (
                  <div className="text-center py-8 text-gray-400">Loading doubts...</div>
                ) : doubts.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    No doubts posted yet. Start the conversation with your first question.
                  </div>
                ) : (
                  doubts.map((doubt) => {
                    const isOwnMessage = doubt.senderId === currentUserId;

                    return (
                      <div
                        key={doubt.id}
                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[88%] md:max-w-[72%] ${isOwnMessage ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
                          <div
                            className={`rounded-2xl px-4 py-3 shadow-sm ${
                              isOwnMessage
                                ? 'text-white rounded-br-md'
                                : 'text-gray-100 rounded-bl-md'
                            }`}
                            style={{
                              background: isOwnMessage
                                ? 'linear-gradient(135deg, #a855f7, #ec4899)'
                                : '#1e293b',
                              border: isOwnMessage
                                ? 'none'
                                : '1px solid rgba(255,255,255,0.06)'
                            }}
                          >
                            <div className={`flex items-center gap-2 text-xs ${isOwnMessage ? 'text-purple-100' : 'text-gray-400'}`}>
                              <span className="font-semibold">
                                {isOwnMessage ? 'You' : doubt.sender?.name || 'Educator'}
                              </span>
                              <span>&bull;</span>
                              <span>
                                {new Date(doubt.createdAt).toLocaleDateString()} {new Date(doubt.createdAt).toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="mt-2 whitespace-pre-wrap leading-relaxed">{doubt.message}</p>
                          </div>

                          <div className={`flex items-center gap-3 px-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                            {!isOwnMessage && (
                              <span className="text-xs font-medium text-emerald-400">Educator reply</span>
                            )}
                            {isOwnMessage && (
                              <button
                                onClick={() => handleDeleteDoubt(doubt.id)}
                                className="text-xs font-medium text-red-400 hover:text-red-300"
                                title="Delete your doubt"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <form onSubmit={handlePostDoubt} style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)' }} className="rounded-2xl shadow-sm p-4 md:p-5 space-y-4">
              <div>
                <h4 className="font-semibold text-white">Send a new message</h4>
                <p className="text-sm text-gray-400 mt-1">Your educator will see this in the same conversation.</p>
              </div>

              <textarea
                value={doubtInput}
                onChange={(e) => setDoubtInput(e.target.value)}
                placeholder="Type your doubt here..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                style={{ background: '#1e293b', border: '1.5px solid rgba(255,255,255,0.1)', color: '#fff' }}
              />

              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-gray-400">Keep your question specific so your educator can reply faster.</p>
                <button
                  type="submit"
                  disabled={!doubtInput.trim()}
                  className="px-5 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetails;
