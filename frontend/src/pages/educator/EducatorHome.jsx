import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, ArcElement,
  PointElement, LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

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

const EducatorHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    activeCourses: 0,
    totalStudents: 0,
    totalAssignments: 0,
    materialsUploaded: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/educator/stats', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { label: 'Active Courses',    value: stats.activeCourses,      color: '#06b6d4', icon: '📚', change: '+2 this month' },
    { label: 'Total Students',    value: stats.totalStudents,      color: '#a855f7', icon: '👥', change: '+12 this week' },
    { label: 'Assignments',       value: stats.totalAssignments,   color: '#10b981', icon: '📝', change: 'Active' },
    { label: 'Materials Uploaded',value: stats.materialsUploaded,  color: '#f59e0b', icon: '📂', change: 'Total' },
  ];

  /* ── Bar chart: student enrollments per course ── */
  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    datasets: [
      {
        label: 'New Students',
        data: [12, 19, 14, 25, 22, 30, 28, stats.totalStudents || 35],
        backgroundColor: 'rgba(168,85,247,0.75)',
        borderRadius: 6,
        borderSkipped: false,
      },
      {
        label: 'Assignments Submitted',
        data: [8, 15, 10, 20, 18, 24, 22, stats.totalAssignments || 28],
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

  /* ── Doughnut: course completion status ── */
  const donutData = {
    labels: ['Completed', 'In Progress', 'Not Started'],
    datasets: [{
      data: [
        Math.round((stats.totalStudents || 10) * 0.4),
        Math.round((stats.totalStudents || 10) * 0.45),
        Math.round((stats.totalStudents || 10) * 0.15),
      ],
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
      legend: { position: 'bottom', labels: { color: 'rgba(255,255,255,0.5)', font: { size: 11 }, boxWidth: 12, padding: 14 } },
      tooltip: { backgroundColor: '#1e293b', titleColor: '#fff', bodyColor: 'rgba(255,255,255,0.7)' },
    },
  };

  /* ── Line chart: average score trend ── */
  const lineData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [{
      label: 'Avg Student Score (%)',
      data: [62, 68, 71, 75, 73, 80],
      borderColor: '#06b6d4',
      backgroundColor: 'rgba(6,182,212,0.1)',
      pointBackgroundColor: '#06b6d4',
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

  const recentActivities = [
    { text: 'Course "Python Basics" created', time: '2 hours ago', dot: '#10b981' },
    { text: 'Assignment "Chapter 3 Exercises" created', time: '4 hours ago', dot: '#06b6d4' },
    { text: 'Material "Lecture Notes.pdf" uploaded', time: '1 day ago', dot: '#a855f7' },
  ];

  const quickActions = [
    { label: '+ Create New Course',  onClick: () => navigate('/educator/courses'),     color: '#06b6d4', bg: 'rgba(6,182,212,0.1)',   border: 'rgba(6,182,212,0.25)'  },
    { label: '+ Create Assignment',  onClick: () => navigate('/educator/assignments'), color: '#a855f7', bg: 'rgba(168,85,247,0.1)', border: 'rgba(168,85,247,0.25)' },
    { label: '+ Upload Material',    onClick: () => navigate('/educator/materials'),   color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)' },
  ];

  return (
    <div style={{ color: 'white', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        .eh-stat:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
        .eh-act:hover { background: rgba(255,255,255,0.04) !important; }
      `}</style>

      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0a1a2e 0%, #061830 50%, #0d1117 100%)',
        border: '1px solid rgba(6,182,212,0.2)',
        borderRadius: 20,
        padding: '28px 32px',
        marginBottom: 24,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle,rgba(6,182,212,0.2) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -30, left: 200, width: 150, height: 150, borderRadius: '50%', background: 'radial-gradient(circle,rgba(168,85,247,0.12) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#06b6d4', marginBottom: 8 }}>Educator Dashboard</p>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 6, letterSpacing: '-0.02em' }}>
            Welcome back, {user?.name}! 👋
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Manage your courses, assignments, and track student progress</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {statCards.map((s, i) => (
          <div key={i} className="eh-stat" style={{
            background: '#111827', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16,
            padding: '20px 22px', transition: 'all 0.25s', cursor: 'default',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: '1.6rem' }}>{s.icon}</span>
              <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.05)', padding: '3px 8px', borderRadius: 100 }}>{s.change}</span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: s.color, lineHeight: 1, marginBottom: 6 }}>{s.value}</div>
            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 18, marginBottom: 24 }}>
        {/* Bar */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4 }}>Analytics</p>
              <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Student Enrollments & Submissions</h2>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#06b6d4', background: 'rgba(6,182,212,0.12)', padding: '4px 10px', borderRadius: 100, fontWeight: 600 }}>Jan – Aug</span>
          </div>
          <div style={{ height: 220 }}>
            <Bar data={barData} options={barOpts} />
          </div>
        </Card>

        {/* Donut */}
        <Card>
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4 }}>Overview</p>
            <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Student Completion</h2>
          </div>
          <div style={{ height: 220 }}>
            <Doughnut data={donutData} options={donutOpts} />
          </div>
        </Card>
      </div>

      {/* Line Chart + Actions + Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        {/* Line */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4 }}>Performance</p>
              <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Average Score Trend</h2>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#10b981', background: 'rgba(16,185,129,0.12)', padding: '4px 10px', borderRadius: 100, fontWeight: 600 }}>6 Weeks</span>
          </div>
          <div style={{ height: 200 }}>
            <Line data={lineData} options={lineOpts} />
          </div>
        </Card>

        {/* Quick Actions + Activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Quick Actions */}
          <Card style={{ padding: '18px 20px' }}>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white', marginBottom: 12 }}>Quick Actions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {quickActions.map((q, i) => (
                <button key={i} onClick={q.onClick} style={{
                  padding: '11px 16px', borderRadius: 10,
                  background: q.bg, border: `1px solid ${q.border}`,
                  color: q.color, fontWeight: 600, fontSize: '0.85rem',
                  cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                }}>{q.label}</button>
              ))}
            </div>
          </Card>

          {/* Recent Activities */}
          <Card style={{ flex: 1, padding: '18px 20px' }}>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white', marginBottom: 12 }}>Recent Activities</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recentActivities.map((act, i) => (
                <div key={i} className="eh-act" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 10px', borderRadius: 8, transition: 'background 0.2s' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: act.dot, flexShrink: 0 }} />
                  <p style={{ flex: 1, fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)' }}>{act.text}</p>
                  <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>{act.time}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EducatorHome;
