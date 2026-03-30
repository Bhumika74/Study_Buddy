import { useState, useEffect } from 'react';

// ── Static course meta (emoji + colours keyed by title substring) ─────────
const COURSE_META = [
  { match: 'math',       emoji: '📐', tag: 'Science',  gradFrom: '#0f766e', gradTo: '#0891b2' },
  { match: 'physics',    emoji: '⚛️', tag: 'Science',  gradFrom: '#0e7490', gradTo: '#1d4ed8' },
  { match: 'chemistry',  emoji: '🧪', tag: 'Science',  gradFrom: '#047857', gradTo: '#0f766e' },
  { match: 'data',       emoji: '🧮', tag: 'Core CSE', gradFrom: '#0f766e', gradTo: '#065f46' },
  { match: 'operating',  emoji: '🖥️', tag: 'Core CSE', gradFrom: '#0d9488', gradTo: '#0891b2' },
  { match: 'web',        emoji: '🌐', tag: 'Web Dev',  gradFrom: '#059669', gradTo: '#0d9488' },
  { match: 'devops',     emoji: '☁️', tag: 'DevOps',   gradFrom: '#0891b2', gradTo: '#0f766e' },
  { match: 'algorithm',  emoji: '🧮', tag: 'Core CSE', gradFrom: '#0f766e', gradTo: '#065f46' },
  { match: 'cloud',      emoji: '☁️', tag: 'DevOps',   gradFrom: '#0891b2', gradTo: '#0f766e' },
];

const DEFAULT_META = { emoji: '📘', tag: 'General', gradFrom: '#0f766e', gradTo: '#0891b2' };

const getMeta = (title = '') => {
  const lower = title.toLowerCase();
  return COURSE_META.find(m => lower.includes(m.match)) || DEFAULT_META;
};

const TAG_STYLES = {
  'Core CSE': { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
  'Science':  { bg: '#ecfeff', color: '#0e7490', border: '#a5f3fc' },
  'Web Dev':  { bg: '#f0fdf4', color: '#065f46', border: '#a7f3d0' },
  'DevOps':   { bg: '#f0fdfa', color: '#0f766e', border: '#99f6e4' },
  'General':  { bg: '#f9fafb', color: '#6b7280', border: '#e5e7eb' },
};

const STAT_CARDS = [
  { icon: '⏱️', label: 'Total Study Time', key: 'totalStudyTime' },
  { icon: '✅', label: 'Courses Completed', key: 'coursesCompleted' },
  { icon: '📊', label: 'Average Score',     key: 'averageScore',     suffix: '%' },
  { icon: '🔥', label: 'Study Streak',      key: 'streak',           suffix: ' days' },
  { icon: '📝', label: 'Quizzes Done',      key: 'quizzesCompleted' },
  { icon: '📚', label: 'Notes Created',     key: 'notesCreated' },
];

// ── weekly activity stays empty until you add a study-time model ─────────
const weeklyActivity = [
  { day: 'Mon', hours: 0, quizzes: 0 },
  { day: 'Tue', hours: 0, quizzes: 0 },
  { day: 'Wed', hours: 0, quizzes: 0 },
  { day: 'Thu', hours: 0, quizzes: 0 },
  { day: 'Fri', hours: 0, quizzes: 0 },
  { day: 'Sat', hours: 0, quizzes: 0 },
  { day: 'Sun', hours: 0, quizzes: 0 },
];

export default function MyProgress() {
  const [timeframe, setTimeframe] = useState('week');

  // ── live data ─────────────────────────────────────────────────
  const [progressRecords, setProgressRecords] = useState([]);
  const [loading, setLoading]                 = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem('token');
        const res   = await fetch('http://localhost:5000/api/student/progress', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        setProgressRecords(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Progress fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  // ── derive COURSES array from API data (same shape as static) ─
  const COURSES = progressRecords.map((p, i) => {
    const title = p.Course?.title || `Course ${i + 1}`;
    const meta  = getMeta(title);
    return {
      id:       p.id,
      name:     title,
      emoji:    meta.emoji,
      tag:      meta.tag,
      progress: Math.min(p.progress || 0, 100),
      gradFrom: meta.gradFrom,
      gradTo:   meta.gradTo,
    };
  });

  // ── derive stats from API data ────────────────────────────────
  const totalQuizzes      = progressRecords.reduce((a, p) => a + (p.quizzesTaken || 0), 0);
  const completedCourses  = progressRecords.filter(p => (p.progress || 0) >= 100).length;
  const avgScore          = progressRecords.length > 0
    ? Math.round(progressRecords.reduce((a, p) => a + (p.averageScore || 0), 0) / progressRecords.length)
    : 0;

  const stats = {
    totalStudyTime:    '0h 0m',   // no study-time model yet
    coursesCompleted:  completedCourses,
    averageScore:      avgScore,
    streak:            0,         // no streak model yet
    quizzesCompleted:  totalQuizzes,
    notesCreated:      0,         // no notes model yet
  };

  // ── no quiz history in model yet ──────────────────────────────
  const recentQuizzes = [];

  // ── loading skeleton (same outer wrapper) ────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6" style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 animate-pulse">
          <div className="h-6 bg-gray-100 rounded w-40" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 animate-pulse">
              <div className="h-7 w-7 bg-gray-100 rounded mb-2" />
              <div className="h-5 bg-gray-100 rounded w-12 mb-1" />
              <div className="h-3 bg-gray-50 rounded w-20" />
            </div>
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {[1,2].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse space-y-3">
              <div className="h-4 bg-gray-100 rounded w-32 mb-4" />
              {[1,2,3,4].map(j => <div key={j} className="h-6 bg-gray-50 rounded-xl" />)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // EXACT SAME JSX as the original — only data sources changed
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 p-6" style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        .stat-card { transition: transform 0.18s ease, box-shadow 0.18s ease; }
        .stat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.09) !important; }
        .progress-bar { transition: width 0.6s ease; }
      `}</style>

      {/* ── Header ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
              style={{ background: 'linear-gradient(135deg,#0f766e,#0891b2)' }}>
              📈
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 leading-none">My Progress</h1>
              <p className="text-xs text-gray-400 mt-0.5">Track your learning journey & achievements</p>
            </div>
          </div>

          {/* Timeframe toggle */}
          <div className="flex space-x-1 p-1 rounded-xl bg-gray-100">
            {['week', 'month', 'year'].map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-150"
                style={timeframe === tf
                  ? { background: '#14b8a6', color: 'white', boxShadow: '0 2px 8px rgba(20,184,166,0.35)' }
                  : { background: 'transparent', color: '#6b7280' }
                }
              >{tf}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {STAT_CARDS.map(({ icon, label, key, suffix = '' }) => (
          <div
            key={key}
            className="stat-card bg-white rounded-2xl p-4 border border-gray-100"
            style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
          >
            <span className="text-2xl block mb-2">{icon}</span>
            <p className="text-xl font-bold text-gray-800 leading-none">
              {stats[key]}{suffix}
            </p>
            <p className="text-xs text-gray-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">

        {/* Weekly Activity */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6" style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <h2 className="text-base font-bold text-gray-800 mb-5">Weekly Activity</h2>
          <div className="space-y-3.5">
            {weeklyActivity.map((day, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-gray-600 w-8">{day.day}</span>
                  <span className="text-xs text-gray-400">{day.hours}h • {day.quizzes} quizzes</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100">
                  <div
                    className="progress-bar h-2 rounded-full"
                    style={{
                      width: day.hours === 0 ? '0%' : `${(day.hours / 5) * 100}%`,
                      background: 'linear-gradient(90deg,#0d9488,#14b8a6)',
                      boxShadow: day.hours > 0 ? '0 0 6px rgba(20,184,166,0.4)' : 'none',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-center py-3 rounded-xl bg-teal-50 border border-teal-100">
            <p className="text-xs text-teal-600 font-medium">📅 No activity yet — start studying to see your data!</p>
          </div>
        </div>

        {/* Course Progress */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6" style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <h2 className="text-base font-bold text-gray-800 mb-5">Course Progress</h2>

          {COURSES.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 rounded-xl bg-gray-50 border border-dashed border-gray-200">
              <span className="text-4xl mb-3">📚</span>
              <p className="text-sm font-semibold text-gray-500">No courses enrolled yet</p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {COURSES.map(course => {
                const ts = TAG_STYLES[course.tag] || TAG_STYLES['General'];
                return (
                  <div key={course.id} className="flex items-center space-x-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                      style={{ background: `linear-gradient(135deg,${course.gradFrom},${course.gradTo})` }}
                    >
                      {course.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-gray-700 truncate">{course.name}</span>
                        <span className="text-xs font-bold text-teal-600 ml-2 flex-shrink-0">{course.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-gray-100">
                        <div
                          className="progress-bar h-1.5 rounded-full"
                          style={{
                            width: `${course.progress}%`,
                            background: 'linear-gradient(90deg,#0d9488,#2dd4bf)',
                            boxShadow: course.progress > 0 ? '0 0 6px rgba(20,184,166,0.4)' : 'none',
                            minWidth: course.progress > 0 ? '4px' : '0',
                          }}
                        />
                      </div>
                    </div>
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{ background: ts.bg, color: ts.color, border: `1px solid ${ts.border}` }}
                    >{course.tag}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Recent Quiz Results ── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6" style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <h2 className="text-base font-bold text-gray-800 mb-5">Recent Quiz Results</h2>

        {recentQuizzes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 rounded-xl bg-gray-50 border border-dashed border-gray-200">
            <span className="text-4xl mb-3">📝</span>
            <p className="text-sm font-semibold text-gray-500">No quizzes taken yet</p>
            <p className="text-xs text-gray-400 mt-1">Complete a quiz to see your results here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                  {['Subject', 'Score', 'Difficulty', 'Date'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentQuizzes.map(quiz => (
                  <tr key={quiz.id} className="hover:bg-gray-50 transition" style={{ borderBottom: '1px solid #f9fafb' }}>
                    <td className="py-3 px-4 text-sm font-semibold text-gray-800">{quiz.subject}</td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold"
                        style={quiz.score >= 80
                          ? { background: '#f0fdf4', color: '#15803d' }
                          : quiz.score >= 60
                          ? { background: '#fefce8', color: '#a16207' }
                          : { background: '#fef2f2', color: '#b91c1c' }
                        }
                      >{quiz.score}%</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">{quiz.difficulty}</span>
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-400">{quiz.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Achievements ── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6" style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <h2 className="text-base font-bold text-gray-800 mb-5">Recent Achievements</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: '🏆', title: 'Quiz Master',       desc: 'Complete 10 quizzes',  locked: totalQuizzes < 10,   bg: '#fefce8', border: '#fde68a', color: '#a16207' },
            { icon: '📚', title: 'Dedicated Learner', desc: '7-day study streak',   locked: stats.streak < 7,    bg: '#eff6ff', border: '#bfdbfe', color: '#1d4ed8' },
            { icon: '⭐', title: 'High Scorer',       desc: 'Avg score above 85%',  locked: avgScore < 85,       bg: '#f0fdf4', border: '#bbf7d0', color: '#15803d' },
          ].map((a, i) => (
            <div
              key={i}
              className="flex items-center space-x-3 p-4 rounded-xl border"
              style={{
                background:   a.locked ? '#f9fafb' : a.bg,
                borderColor:  a.locked ? '#e5e7eb' : a.border,
                opacity:      a.locked ? 0.65 : 1,
              }}
            >
              <span className="text-3xl" style={{ filter: a.locked ? 'grayscale(1)' : 'none' }}>{a.icon}</span>
              <div>
                <p className="text-sm font-bold text-gray-700">{a.title}</p>
                <p className="text-xs text-gray-400">{a.desc}</p>
                {a.locked && (
                  <span className="text-xs font-semibold text-gray-400 mt-0.5 block">🔒 Locked</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}