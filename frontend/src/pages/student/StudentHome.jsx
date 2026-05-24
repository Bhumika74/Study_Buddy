import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, ArcElement,
  PointElement, LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement,
  PointElement, LineElement, Title, Tooltip, Legend, Filler);

/* ── tiny dark-card helper ── */
const Card = ({ children, style = {} }) => (
  <div style={{
    background: '#111827',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 16,
    padding: '20px 22px',
    ...style
  }}>{children}</div>
);

const StudentHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    coursesEnrolled: 0,
    completedLessons: 0,
    quizzesTaken: 0,
    studyStreak: 0,
    aiChatsToday: 0,
    uploadedNotes: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await fetch('http://localhost:5000/api/student/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchStats();
  }, []);

  /* ── stats config ── */
  const statCards = [
    { label: 'Active Courses',   value: stats.coursesEnrolled,  color: '#a855f7', icon: '📚' },
    { label: 'Lessons Done',     value: stats.completedLessons, color: '#06b6d4', icon: '✅' },
    { label: 'Quizzes Taken',    value: stats.quizzesTaken,     color: '#ec4899', icon: '📝' },
    { label: 'Day Streak',       value: stats.studyStreak,      color: '#f59e0b', icon: '🔥' },
    { label: 'AI Chats Today',   value: stats.aiChatsToday,     color: '#10b981', icon: '🤖' },
    { label: 'Notes Uploaded',   value: stats.uploadedNotes,    color: '#f43f5e', icon: '📤' },
  ];

  /* ── Bar chart: weekly activity ── */
  const barData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Study Hours',
        data: [2, 3, 1.5, 4, 2.5, 3.5, 1],
        backgroundColor: 'rgba(168,85,247,0.75)',
        borderRadius: 6,
        borderSkipped: false,
      },
      {
        label: 'Quizzes',
        data: [1, 2, 0, 3, 1, 2, 0],
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
      y: { ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 11 } }, grid: { color: 'rgba(255,255,255,0.06)' }, border: { display: false } },
    },
  };

  /* ── Doughnut: course distribution ── */
  const donutData = {
    labels: ['Completed', 'In Progress', 'Not Started'],
    datasets: [{
      data: [
        stats.completedLessons || 3,
        stats.coursesEnrolled || 2,
        Math.max(0, 5 - (stats.coursesEnrolled || 2)),
      ],
      backgroundColor: ['#a855f7', '#06b6d4', '#1e293b'],
      borderWidth: 0,
      hoverOffset: 6,
    }],
  };

  const donutOpts = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: {
      legend: { position: 'bottom', labels: { color: 'rgba(255,255,255,0.5)', font: { size: 11 }, boxWidth: 12, padding: 14 } },
      tooltip: { backgroundColor: '#1e293b', titleColor: '#fff', bodyColor: 'rgba(255,255,255,0.7)' },
    },
  };

  /* ── Line chart: quiz scores over time ── */
  const lineData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [{
      label: 'Quiz Score (%)',
      data: [55, 68, 72, 80, 76, 85],
      borderColor: '#ec4899',
      backgroundColor: 'rgba(236,72,153,0.1)',
      pointBackgroundColor: '#ec4899',
      pointRadius: 5,
      tension: 0.4,
      fill: true,
    }],
  };

  const lineOpts = {
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

  const quickActions = [
    { title: 'Chat with AI Tutor',    description: 'Get instant help with any topic',       path: '/student/ai-chat', gradient: 'linear-gradient(135deg,#a855f7,#6366f1)', icon: '💬' },
    { title: 'Upload Study Material', description: 'Get AI-generated summaries & quizzes',  path: '/student/upload',  gradient: 'linear-gradient(135deg,#ec4899,#f43f5e)', icon: '📤' },
    { title: 'Generate Quiz',         description: 'AI creates custom practice tests',       path: '/student/quiz',    gradient: 'linear-gradient(135deg,#06b6d4,#3b82f6)', icon: '📝' },
    { title: 'View Progress',         description: 'Track your learning analytics',          path: '/student/progress',gradient: 'linear-gradient(135deg,#f59e0b,#ef4444)', icon: '📊' },
  ];

  const recentActivities = [
    { id: 1, type: 'quiz',    title: 'Completed Mathematics Quiz', time: '2 hours ago', score: 85 },
    { id: 2, type: 'ai-chat', title: 'AI Chat: Quantum Physics',   time: '5 hours ago' },
    { id: 3, type: 'upload',  title: 'Uploaded Chemistry Notes',   time: '1 day ago' },
    { id: 4, type: 'course',  title: 'Started Advanced Programming',time: '2 days ago' },
  ];

  const activityIcon = { quiz: '📝', 'ai-chat': '🤖', upload: '📤', course: '📚' };
  const activityColor = { quiz: '#a855f7', 'ai-chat': '#06b6d4', upload: '#10b981', course: '#f59e0b' };

  return (
    <div style={{ color: 'white', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        .sh-stat:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
        .sh-qa:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,0,0,0.4); }
        .sh-act:hover { background: rgba(255,255,255,0.04) !important; }
      `}</style>

      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e0a3c 0%, #0f1f3d 50%, #0d1117 100%)',
        border: '1px solid rgba(168,85,247,0.2)',
        borderRadius: 20,
        padding: '28px 32px',
        marginBottom: 24,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle,rgba(168,85,247,0.25) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -30, left: 200, width: 150, height: 150, borderRadius: '50%', background: 'radial-gradient(circle,rgba(6,182,212,0.15) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#a855f7', marginBottom: 8 }}>Student Dashboard</p>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 6, letterSpacing: '-0.02em' }}>
            Welcome Back, {user?.name || 'Student'}! 👋
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Ready to continue your AI-powered learning journey?</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 14, marginBottom: 24 }}>
        {statCards.map((s, i) => (
          <div key={i} className="sh-stat" style={{
            background: '#111827', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14,
            padding: '16px 18px', transition: 'all 0.25s', cursor: 'default',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: '1.4rem' }}>{s.icon}</span>
              <span style={{ fontSize: '0.6rem', fontWeight: 700, padding: '2px 7px', borderRadius: 100, background: `${s.color}22`, color: s.color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>live</span>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginTop: 4, fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 18, marginBottom: 24 }}>
        {/* Bar Chart */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4 }}>Weekly Activity</p>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'white' }}>Study Hours & Quizzes</h2>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#a855f7', background: 'rgba(168,85,247,0.12)', padding: '4px 10px', borderRadius: 100, fontWeight: 600 }}>This Week</span>
          </div>
          <div style={{ height: 220 }}>
            <Bar data={barData} options={barOpts} />
          </div>
        </Card>

        {/* Doughnut */}
        <Card>
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4 }}>Course Status</p>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'white' }}>Progress Overview</h2>
          </div>
          <div style={{ height: 220 }}>
            <Doughnut data={donutData} options={donutOpts} />
          </div>
        </Card>
      </div>

      {/* Line Chart + Quick Actions Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 24 }}>
        {/* Line */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4 }}>Performance</p>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'white' }}>Quiz Score Trend</h2>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#ec4899', background: 'rgba(236,72,153,0.12)', padding: '4px 10px', borderRadius: 100, fontWeight: 600 }}>6 Weeks</span>
          </div>
          <div style={{ height: 200 }}>
            <Line data={lineData} options={lineOpts} />
          </div>
        </Card>

        {/* Quick Actions */}
        <div>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'white', marginBottom: 14 }}>Quick Actions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {quickActions.map((a, i) => (
              <Link key={i} to={a.path} className="sh-qa" style={{
                background: '#111827', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 14, padding: '16px', textDecoration: 'none',
                display: 'block', transition: 'all 0.25s',
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10, background: a.gradient,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.2rem', marginBottom: 10,
                }}>{a.icon}</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'white', marginBottom: 4 }}>{a.title}</div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>{a.description}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'white' }}>Recent Activity</h2>
          <button style={{ fontSize: '0.75rem', color: '#a855f7', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>View All</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {recentActivities.map((act) => (
            <div key={act.id} className="sh-act" style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '12px 14px', borderRadius: 10, transition: 'background 0.2s',
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: '50%',
                background: `${activityColor[act.type]}22`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1rem', flexShrink: 0,
              }}>{activityIcon[act.type]}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: 2 }}>{act.title}</p>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>{act.time}</p>
              </div>
              {act.score && (
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '1rem', fontWeight: 800, color: '#10b981' }}>{act.score}%</p>
                  <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)' }}>Score</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default StudentHome;