import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coursesMap, setCoursesMap] = useState({});

  useEffect(() => {
    fetchProgress();
    fetchCourses();
  }, []);

  const fetchProgress = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/student/progress', {
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

  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/student/courses', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        const map = {};
        data.forEach(course => { map[course.id] = course; });
        setCoursesMap(map);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  };

  const totalProgress = progressData.length > 0
    ? Math.round(progressData.reduce((sum, p) => sum + (p.progress || 0), 0) / progressData.length)
    : 0;

  const completedCourses = progressData.filter(p => p.status === 'completed').length;
  const inProgressCourses = progressData.filter(p => p.status === 'in-progress').length;

  /* ── Bar chart: per-course progress ── */
  const barData = {
    labels: progressData.slice(0, 6).map((p, i) => coursesMap[p.courseId]?.title?.substring(0, 12) || `Course ${i + 1}`),
    datasets: [
      {
        label: 'Progress (%)',
        data: progressData.slice(0, 6).map(p => p.progress || 0),
        backgroundColor: 'rgba(168,85,247,0.75)',
        borderRadius: 6,
        borderSkipped: false,
      },
      {
        label: 'Avg Score (%)',
        data: progressData.slice(0, 6).map(p => p.averageScore || 0),
        backgroundColor: 'rgba(6,182,212,0.65)',
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

  /* ── Doughnut: status breakdown ── */
  const donutData = {
    labels: ['Completed', 'In Progress', 'Not Started'],
    datasets: [{
      data: [completedCourses, inProgressCourses, Math.max(0, progressData.length - completedCourses - inProgressCourses)],
      backgroundColor: ['#10b981', '#a855f7', '#1e293b'],
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

  const getBarColor = (pct) => pct >= 80 ? '#10b981' : pct >= 60 ? '#f59e0b' : '#ef4444';

  const statCards = [
    { label: 'Overall Progress',    value: `${totalProgress}%`, color: '#a855f7' },
    { label: 'Courses Enrolled',    value: progressData.length, color: '#06b6d4' },
    { label: 'In Progress',         value: inProgressCourses,   color: '#f59e0b' },
    { label: 'Completed',           value: completedCourses,    color: '#10b981' },
  ];

  return (
    <div style={{ color: 'white', fontFamily: "'Inter', sans-serif" }}>
      {/* Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1a0a3c 0%, #0f1540 50%, #0d1117 100%)',
        border: '1px solid rgba(168,85,247,0.2)',
        borderRadius: 20, padding: '28px 32px', marginBottom: 24,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle,rgba(168,85,247,0.25) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <p style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#a855f7', marginBottom: 8 }}>Progress Tracker</p>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 6, letterSpacing: '-0.02em' }}>My Learning Progress</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Track your course completion and academic growth</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {statCards.map((s, i) => (
          <Card key={i} style={{ padding: '20px 22px' }}>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: 8, fontWeight: 500 }}>{s.label}</p>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</p>
            {s.label === 'Overall Progress' && (
              <div style={{ marginTop: 12, height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 100 }}>
                <div style={{ height: '100%', width: `${totalProgress}%`, background: 'linear-gradient(90deg,#a855f7,#ec4899)', borderRadius: 100, transition: 'width 0.6s' }} />
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 18, marginBottom: 24 }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4 }}>Analytics</p>
              <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Progress vs Avg Score (per course)</h2>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#a855f7', background: 'rgba(168,85,247,0.12)', padding: '4px 10px', borderRadius: 100, fontWeight: 600 }}>Live</span>
          </div>
          <div style={{ height: 220 }}>
            {progressData.length > 0
              ? <Bar data={barData} options={barOpts} />
              : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '0.85rem' }}>No data yet</div>
            }
          </div>
        </Card>
        <Card>
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4 }}>Status</p>
            <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Course Breakdown</h2>
          </div>
          <div style={{ height: 220 }}>
            <Doughnut data={donutData} options={donutOpts} />
          </div>
        </Card>
      </div>

      {/* Course Progress List */}
      <Card>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>Course Progress</h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'rgba(255,255,255,0.3)' }}>Loading progress...</div>
        ) : progressData.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {progressData.map(progress => {
              const course = coursesMap[progress.courseId];
              const pct = progress.progress || 0;
              const barCol = getBarColor(pct);
              const statusColors = { completed: '#10b981', 'in-progress': '#f59e0b', 'not-started': '#ef4444' };
              const statusBg = { completed: 'rgba(16,185,129,0.1)', 'in-progress': 'rgba(245,158,11,0.1)', 'not-started': 'rgba(239,68,68,0.1)' };

              return (
                <div key={progress.id} style={{
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 12, padding: '16px 18px',
                  transition: 'border-color 0.2s',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div>
                      <h3 style={{ fontWeight: 700, color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem', marginBottom: 4 }}>
                        {course?.title || 'Unknown Course'}
                      </h3>
                      <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                        {course?.subject} {course?.grade && `• ${course.grade}`}
                      </p>
                    </div>
                    <span style={{
                      padding: '4px 10px', borderRadius: 100, fontSize: '0.72rem', fontWeight: 600,
                      color: statusColors[progress.status] || '#a855f7',
                      background: statusBg[progress.status] || 'rgba(168,85,247,0.1)',
                    }}>{progress.status}</span>
                  </div>

                  <div style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Progress</span>
                      <span style={{ fontSize: '0.875rem', fontWeight: 700, color: barCol }}>{pct}%</span>
                    </div>
                    <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 100 }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: barCol, borderRadius: 100, transition: 'width 0.6s' }} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    {[
                      { label: 'Assignments', val: progress.assignmentsCompleted || 0 },
                      { label: 'Avg Score',   val: `${progress.averageScore?.toFixed(1) || 0}%` },
                      { label: 'Quizzes',     val: progress.quizzesTaken || 0 },
                    ].map((m, i) => (
                      <div key={i} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '8px 6px' }}>
                        <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', marginBottom: 3 }}>{m.label}</p>
                        <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>{m.val}</p>
                      </div>
                    ))}
                  </div>

                  <Link
                    to={`/student/course/${progress.courseId}`}
                    style={{
                      display: 'inline-block', marginTop: 12, padding: '7px 16px',
                      background: 'linear-gradient(135deg,#a855f7,#ec4899)',
                      color: 'white', borderRadius: 8, fontSize: '0.8rem', fontWeight: 700,
                      textDecoration: 'none', transition: 'opacity 0.2s',
                    }}
                  >Continue Course →</Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(255,255,255,0.3)' }}>
            <p style={{ marginBottom: 8 }}>You haven't enrolled in any courses yet</p>
            <Link to="/student/courses" style={{ color: '#a855f7', fontWeight: 600, textDecoration: 'none', fontSize: '0.875rem' }}>
              Explore Courses →
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
};

export default StudentProgress;
