import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, ArcElement,
  PointElement, LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement,
  PointElement, LineElement, Title, Tooltip, Legend, Filler);

const Card = ({ children, style = {} }) => (
  <div style={{
    background: '#111827',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 16,
    padding: '20px 22px',
    ...style
  }}>{children}</div>
);

const StudentProgress = () => {
  const [courses, setCourses] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [filterCourse, setFilterCourse] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (filterCourse) {
      fetchCourseProgress(filterCourse);
    }
  }, [filterCourse]);

  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/educator/courses', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
        if (data.length > 0) {
          setFilterCourse(data[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  };

  const fetchCourseProgress = async (courseId) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/educator/progress/${courseId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setProgressData(data);
      }
    } catch (error) {
      console.error('Failed to fetch progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentCourseProgress = async (studentId, courseId) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/educator/progress/${courseId}/${studentId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setStudentDetails(data);
      }
    } catch (error) {
      console.error('Failed to fetch student progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSelect = (studentId) => {
    setSelectedStudent(studentId);
    if (filterCourse) {
      fetchStudentCourseProgress(studentId, filterCourse);
    }
  };

  const getBarColor = (progress) => {
    if (progress >= 80) return '#10b981';
    if (progress >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const avgProgress = progressData.length > 0
    ? Math.round(progressData.reduce((sum, p) => sum + (p.progress || 0), 0) / progressData.length)
    : 0;

  /* ── Bar chart ── */
  const barData = {
    labels: progressData.slice(0, 8).map((p, i) => `Student ${i + 1}`),
    datasets: [
      {
        label: 'Progress (%)',
        data: progressData.slice(0, 8).map(p => p.progress || 0),
        backgroundColor: progressData.slice(0, 8).map(p => `${getBarColor(p.progress || 0)}bb`),
        borderRadius: 6,
        borderSkipped: false,
      },
      {
        label: 'Avg Score (%)',
        data: progressData.slice(0, 8).map(p => p.averageScore || 0),
        backgroundColor: 'rgba(6,182,212,0.55)',
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const barOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: 'rgba(255,255,255,0.5)', font: { size: 11 }, boxWidth: 12 } },
      tooltip: { backgroundColor: '#1e293b', titleColor: '#fff', bodyColor: 'rgba(255,255,255,0.7)' },
    },
    scales: {
      x: { ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 11 } }, grid: { color: 'rgba(255,255,255,0.04)' }, border: { display: false } },
      y: { ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 11 } }, grid: { color: 'rgba(255,255,255,0.06)' }, border: { display: false }, min: 0, max: 100 },
    },
  };

  /* ── Doughnut ── */
  const completed = progressData.filter(p => p.status === 'completed').length;
  const inProg    = progressData.filter(p => p.status === 'in-progress').length;
  const other     = progressData.length - completed - inProg;

  const donutData = {
    labels: ['Completed', 'In Progress', 'Not Started'],
    datasets: [{
      data: [completed || 0, inProg || 0, other || 0],
      backgroundColor: ['#10b981', '#06b6d4', '#1e293b'],
      borderWidth: 0,
      hoverOffset: 6,
    }],
  };

  const donutOpts = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: {
      legend: { position: 'bottom', labels: { color: 'rgba(255,255,255,0.5)', font: { size: 11 }, boxWidth: 12, padding: 12 } },
      tooltip: { backgroundColor: '#1e293b', titleColor: '#fff', bodyColor: 'rgba(255,255,255,0.7)' },
    },
  };

  const statCards = [
    { label: 'Total Enrollments', value: progressData.length, color: '#06b6d4' },
    { label: 'In Progress',       value: inProg,              color: '#f59e0b' },
    { label: 'Completed',         value: completed,           color: '#10b981' },
    { label: 'Average Progress',  value: `${avgProgress}%`,  color: '#a855f7' },
  ];

  return (
    <div style={{ color: 'white', fontFamily: "'Inter', sans-serif" }}>
      {/* Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #051a2e 0%, #072040 50%, #0d1117 100%)',
        border: '1px solid rgba(6,182,212,0.2)',
        borderRadius: 20, padding: '28px 32px', marginBottom: 24,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle,rgba(6,182,212,0.2) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <p style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#06b6d4', marginBottom: 8 }}>Student Analytics</p>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 6, letterSpacing: '-0.02em' }}>Student Progress Tracking</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Monitor student performance in your courses</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {statCards.map((s, i) => (
          <Card key={i} style={{ padding: '20px 22px' }}>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: 8, fontWeight: 500 }}>{s.label}</p>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Course Filter */}
      <Card style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Select Course to View Progress
        </label>
        <select
          value={filterCourse}
          onChange={(e) => setFilterCourse(e.target.value)}
          style={{
            padding: '10px 14px', background: '#1e293b', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 10, color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem',
            outline: 'none', cursor: 'pointer', minWidth: 320,
          }}
        >
          <option value="">-- Select a Course --</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>{course.title} ({course.subject})</option>
          ))}
        </select>
      </Card>

      {/* Charts Row */}
      {progressData.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 18, marginBottom: 20 }}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Student Progress vs Avg Score</h2>
              <span style={{ fontSize: '0.72rem', color: '#06b6d4', background: 'rgba(6,182,212,0.12)', padding: '4px 10px', borderRadius: 100, fontWeight: 600 }}>Live</span>
            </div>
            <div style={{ height: 200 }}>
              <Bar data={barData} options={barOpts} />
            </div>
          </Card>
          <Card>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>Status Breakdown</h2>
            <div style={{ height: 200 }}>
              <Doughnut data={donutData} options={donutOpts} />
            </div>
          </Card>
        </div>
      )}

      {/* Student List + Details */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 18 }}>
        {/* Students */}
        <div>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'white', marginBottom: 14 }}>Enrolled Students</h2>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'rgba(255,255,255,0.3)' }}>Loading progress data...</div>
          ) : progressData.length === 0 ? (
            <Card style={{ textAlign: 'center', padding: '32px 0' }}>
              <p style={{ color: 'rgba(255,255,255,0.35)' }}>Select a course to view student progress</p>
            </Card>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {progressData.map(progress => {
                const pct = progress.progress || 0;
                const col = getBarColor(pct);
                const isSelected = selectedStudent === progress.studentId;

                return (
                  <div
                    key={progress.id}
                    onClick={() => handleStudentSelect(progress.studentId)}
                    style={{
                      background: '#111827',
                      border: `1px solid ${isSelected ? 'rgba(6,182,212,0.4)' : 'rgba(255,255,255,0.06)'}`,
                      borderRadius: 12, padding: '14px 16px', cursor: 'pointer',
                      transition: 'all 0.2s', boxShadow: isSelected ? '0 0 0 1px rgba(6,182,212,0.3)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                      <div>
                        <h3 style={{ fontWeight: 700, color: 'rgba(255,255,255,0.9)', fontSize: '0.875rem', marginBottom: 3 }}>
                          Student #{progress.studentId?.substring(0, 8)}
                        </h3>
                        <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'capitalize' }}>
                          Status: {progress.status}
                        </p>
                      </div>
                      <span style={{ fontSize: '1.3rem', fontWeight: 800, color: col }}>{pct}%</span>
                    </div>

                    <div style={{ height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 100, marginBottom: 10 }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: col, borderRadius: 100, transition: 'width 0.5s' }} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
                      {[
                        { l: 'Assignments', v: progress.assignmentsCompleted || 0 },
                        { l: 'Avg Score',   v: `${progress.averageScore?.toFixed(1) || 0}%` },
                        { l: 'Quizzes',     v: progress.quizzesTaken || 0 },
                      ].map((m, i) => (
                        <div key={i} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 7, padding: '6px 8px', textAlign: 'center' }}>
                          <p style={{ fontSize: '0.67rem', color: 'rgba(255,255,255,0.3)', marginBottom: 2 }}>{m.l}</p>
                          <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>{m.v}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Student Detail Panel */}
        {selectedStudent && studentDetails ? (
          <Card style={{ height: 'fit-content' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>Student Details</h2>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '20px 0', color: 'rgba(255,255,255,0.3)' }}>Loading...</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 10 }}>
                  <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', marginBottom: 3 }}>Student ID</p>
                  <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', wordBreak: 'break-all' }}>{selectedStudent}</p>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '14px' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: 12 }}>Performance Metrics</h3>

                  <div style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)' }}>Overall Progress</p>
                      <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#06b6d4' }}>{studentDetails.progress || 0}%</span>
                    </div>
                    <div style={{ height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 100 }}>
                      <div style={{ height: '100%', width: `${studentDetails.progress || 0}%`, background: 'linear-gradient(90deg,#06b6d4,#3b82f6)', borderRadius: 100 }} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {[
                      { l: 'Assignments', v: studentDetails.assignmentsCompleted || 0, color: '#06b6d4' },
                      { l: 'Quizzes',     v: studentDetails.quizzesTaken || 0,         color: '#a855f7' },
                      { l: 'Avg Score',   v: `${studentDetails.averageScore?.toFixed(1) || 0}%`, color: '#10b981' },
                      { l: 'Status',      v: studentDetails.status || 'in-progress',  color: '#f59e0b' },
                    ].map((m, i) => (
                      <div key={i} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '10px 12px' }}>
                        <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', marginBottom: 4 }}>{m.l}</p>
                        <p style={{ fontSize: '1rem', fontWeight: 800, color: m.color, textTransform: 'capitalize' }}>{m.v}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '14px' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: 10 }}>Activity</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ padding: '8px 10px', background: 'rgba(255,255,255,0.04)', borderRadius: 8, fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)' }}>
                      Last accessed: {studentDetails.lastAccessed ? new Date(studentDetails.lastAccessed).toLocaleDateString() : 'Never'}
                    </div>
                    {studentDetails.completedAt && (
                      <div style={{ padding: '8px 10px', background: 'rgba(16,185,129,0.08)', borderRadius: 8, fontSize: '0.78rem', color: '#10b981' }}>
                        Completed: {new Date(studentDetails.completedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Card>
        ) : (
          <Card style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.875rem', textAlign: 'center' }}>Select a student to view details</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StudentProgress;
