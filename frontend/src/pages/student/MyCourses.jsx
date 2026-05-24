import { useState } from 'react';

const youtubeChannels = {
  1: [
    { name: '3Blue1Brown', handle: '@3blue1brown', url: 'https://www.youtube.com/@3blue1brown', avatar: '🔵', desc: 'Visual, intuitive math — calculus, linear algebra & more', subs: '5.9M' },
    { name: 'Professor Leonard', handle: '@ProfessorLeonard', url: 'https://www.youtube.com/@ProfessorLeonard', avatar: '📘', desc: 'Full university-level math lectures, step by step', subs: '1.2M' },
    { name: 'MIT OpenCourseWare', handle: '@mitocw', url: 'https://www.youtube.com/@mitocw', avatar: '🏛️', desc: 'Official MIT lectures on calculus, algebra & analysis', subs: '4.5M' },
    { name: 'blackpenredpen', handle: '@blackpenredpen', url: 'https://www.youtube.com/@blackpenredpen', avatar: '✏️', desc: 'Fast-paced calculus & integration problem walkthroughs', subs: '1.1M' },
  ],
  2: [
    { name: 'PBS Space Time', handle: '@pbsspacetime', url: 'https://www.youtube.com/@pbsspacetime', avatar: '🌌', desc: 'Deep dives into quantum mechanics & cosmology', subs: '3.2M' },
    { name: 'Looking Glass Universe', handle: '@LookingGlassUniverse', url: 'https://www.youtube.com/@LookingGlassUniverse', avatar: '🔭', desc: 'Quantum physics explained clearly by a PhD student', subs: '400K' },
    { name: 'Fermilab', handle: '@fermilab', url: 'https://www.youtube.com/@fermilab', avatar: '⚛️', desc: 'Official particle physics & quantum field theory talks', subs: '900K' },
    { name: 'Sabine Hossenfelder', handle: '@SabineHossenfelder', url: 'https://www.youtube.com/@SabineHossenfelder', avatar: '🧬', desc: 'Theoretical physics & quantum foundations commentary', subs: '1.3M' },
  ],
  3: [
    { name: 'Organic Chemistry Tutor', handle: '@TheOrganicChemistryTutor', url: 'https://www.youtube.com/@TheOrganicChemistryTutor', avatar: '🧪', desc: 'Comprehensive orgo lessons, reactions & mechanisms', subs: '7.2M' },
    { name: 'Khan Academy', handle: '@khanacademy', url: 'https://www.youtube.com/@khanacademy', avatar: '🟢', desc: 'Free organic chemistry fundamentals & problem sets', subs: '8.4M' },
    { name: 'NileRed', handle: '@NileRed', url: 'https://www.youtube.com/@NileRed', avatar: '🔴', desc: 'Real lab chemistry experiments & reaction demos', subs: '4.6M' },
    { name: 'Professor Dave Explains', handle: '@ProfessorDaveExplains', url: 'https://www.youtube.com/@ProfessorDaveExplains', avatar: '🧫', desc: 'Clear, concise organic chemistry lectures & quizzes', subs: '3.1M' },
  ],
  4: [
    { name: 'Abdul Bari', handle: '@abdul_bari', url: 'https://www.youtube.com/@abdul_bari', avatar: '🧠', desc: 'Best DSA lectures — algorithms & data structures in depth', subs: '1.8M' },
    { name: 'William Fiset', handle: '@WilliamFiset', url: 'https://www.youtube.com/@WilliamFiset', avatar: '📊', desc: 'Graph theory, trees & competitive programming', subs: '350K' },
    { name: 'NeetCode', handle: '@NeetCode', url: 'https://www.youtube.com/@NeetCode', avatar: '🎯', desc: 'LeetCode patterns, system design & coding interviews', subs: '700K' },
    { name: 'Striver', handle: '@takeUforward', url: 'https://www.youtube.com/@takeUforward', avatar: '🚀', desc: 'SDE Sheet, DSA roadmap & placement preparation', subs: '620K' },
  ],
  5: [
    { name: 'Neso Academy', handle: '@nesoacademy', url: 'https://www.youtube.com/@nesoacademy', avatar: '🖥️', desc: 'OS, DBMS, CN & all CSE core subjects covered', subs: '2.4M' },
    { name: 'Gate Smashers', handle: '@GateSmashers', url: 'https://www.youtube.com/@GateSmashers', avatar: '🔑', desc: 'GATE-focused OS, DBMS, TOC & compiler design', subs: '1.5M' },
    { name: "Jenny's Lectures", handle: '@JennyslecturesDSA', url: 'https://www.youtube.com/@JennyslecturesDSACS', avatar: '👩‍💻', desc: 'Data structures, algorithms & programming fundamentals', subs: '1.3M' },
    { name: 'Knowledge Gate', handle: '@KnowledgeGate1', url: 'https://www.youtube.com/@KnowledgeGate1', avatar: '📡', desc: 'Computer networks, DBMS & system software', subs: '800K' },
  ],
  6: [
    { name: 'Traversy Media', handle: '@TraversyMedia', url: 'https://www.youtube.com/@TraversyMedia', avatar: '🌐', desc: 'Full-stack web dev — HTML, CSS, JS, React, Node & more', subs: '2.2M' },
    { name: 'Fireship', handle: '@Fireship', url: 'https://www.youtube.com/@Fireship', avatar: '🔥', desc: 'Fast, modern web & app dev tutorials in 100 seconds', subs: '3.1M' },
    { name: 'Kevin Powell', handle: '@KevinPowell', url: 'https://www.youtube.com/@KevinPowell', avatar: '🎨', desc: 'CSS mastery — layouts, animations & modern techniques', subs: '1.0M' },
    { name: 'Theo - t3.gg', handle: '@t3dotgg', url: 'https://www.youtube.com/@t3dotgg', avatar: '⚡', desc: 'TypeScript, React, Next.js & modern web ecosystem', subs: '420K' },
  ],
  7: [
    { name: 'TechWorld with Nana', handle: '@TechWorldwithNana', url: 'https://www.youtube.com/@TechWorldwithNana', avatar: '☁️', desc: 'DevOps, Kubernetes, Docker & CI/CD pipelines', subs: '950K' },
    { name: 'NetworkChuck', handle: '@NetworkChuck', url: 'https://www.youtube.com/@NetworkChuck', avatar: '🔒', desc: 'Networking, cybersecurity, Linux & cloud fundamentals', subs: '3.3M' },
    { name: 'Kunal Kushwaha', handle: '@KunalKushwaha', url: 'https://www.youtube.com/@KunalKushwaha', avatar: '🐳', desc: 'Open source, DevOps & cloud-native development', subs: '490K' },
    { name: 'Hussein Nasser', handle: '@HusseinNasser2', url: 'https://www.youtube.com/@HusseinNasser2', avatar: '🏗️', desc: 'Backend engineering, databases & system design', subs: '460K' },
  ],
};

const TAG_STYLES = {
  'Core CSE': { bg: 'rgba(168,85,247,0.12)', color: '#a855f7', border: 'rgba(168,85,247,0.3)' },
  'Science':  { bg: 'rgba(6,182,212,0.12)',  color: '#06b6d4', border: 'rgba(6,182,212,0.3)' },
  'Web Dev':  { bg: 'rgba(16,185,129,0.12)', color: '#10b981', border: 'rgba(16,185,129,0.3)' },
  'DevOps':   { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: 'rgba(245,158,11,0.3)' },
};

const COURSES = [
  { id: 1, title: 'Advanced Mathematics',         instructor: 'Dr. Sarah Johnson',   nextLesson: 'Calculus Integration',  emoji: '📐', tag: 'Science',  gradFrom: '#0f766e', gradTo: '#0891b2' },
  { id: 2, title: 'Quantum Physics',              instructor: 'Prof. Michael Chen',  nextLesson: 'Wave-Particle Duality', emoji: '⚛️', tag: 'Science',  gradFrom: '#0e7490', gradTo: '#1d4ed8' },
  { id: 3, title: 'Organic Chemistry',            instructor: 'Dr. Emily Rodriguez', nextLesson: 'Reaction Mechanisms',   emoji: '🧪', tag: 'Science',  gradFrom: '#047857', gradTo: '#0f766e' },
  { id: 4, title: 'Data Structures & Algorithms', instructor: 'Dr. Robert Kumar',    nextLesson: 'Binary Trees & BST',    emoji: '🧮', tag: 'Core CSE', gradFrom: '#0f766e', gradTo: '#065f46' },
  { id: 5, title: 'Operating Systems',            instructor: 'Prof. Ananya Sharma', nextLesson: 'Process Scheduling',    emoji: '🖥️', tag: 'Core CSE', gradFrom: '#0d9488', gradTo: '#0891b2' },
  { id: 6, title: 'Full Stack Web Dev',           instructor: 'Dr. Arjun Mehta',     nextLesson: 'REST API Design',       emoji: '🌐', tag: 'Web Dev',  gradFrom: '#059669', gradTo: '#0d9488' },
  { id: 7, title: 'DevOps & Cloud',               instructor: 'Prof. Priya Nair',    nextLesson: 'Docker Containers',     emoji: '☁️', tag: 'DevOps',   gradFrom: '#0891b2', gradTo: '#0f766e' },
];

/* ── Channel Modal (dark) ── */
const ChannelModal = ({ course, onClose }) => {
  const channels = youtubeChannels[course.id] || [];
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: '#111827', maxHeight: '88vh', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.08)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative p-6 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition"
            style={{ color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.07)' }}
          >✕</button>
          <div className="flex items-center space-x-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${course.gradFrom}, ${course.gradTo})` }}
            >{course.emoji}</div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>📺 YouTube Channels</p>
              <h2 className="text-lg font-bold" style={{ color: 'white' }}>{course.title}</h2>
            </div>
          </div>
          <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.35)' }}>Select a channel to open it on YouTube →</p>
        </div>

        {/* Channels */}
        <div className="p-4 space-y-2">
          {channels.map((ch, i) => (
            <a
              key={i}
              href={ch.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 p-3.5 rounded-xl group"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', transition: 'all 0.15s', textDecoration: 'none' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(168,85,247,0.1)'; e.currentTarget.style.border = '1px solid rgba(168,85,247,0.3)'; e.currentTarget.style.transform = 'translateX(4px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.border = '1px solid rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'translateX(0)'; }}
            >
              <div className="w-11 h-11 rounded-lg flex items-center justify-center text-xl flex-shrink-0" style={{ background: 'rgba(255,255,255,0.08)' }}>{ch.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="font-semibold text-sm truncate" style={{ color: 'rgba(255,255,255,0.85)' }}>{ch.name}</p>
                  <span className="text-xs flex-shrink-0" style={{ color: 'rgba(255,255,255,0.35)' }}>{ch.subs}</span>
                </div>
                <p className="text-xs truncate mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{ch.desc}</p>
                <p className="text-xs mt-0.5" style={{ color: '#a855f7' }}>{ch.handle}</p>
              </div>
              <div className="flex-shrink-0 opacity-40 group-hover:opacity-100 transition-opacity">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#FF0000">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </div>
            </a>
          ))}
        </div>
        <p className="text-center text-xs pb-4" style={{ color: 'rgba(255,255,255,0.2)' }}>Opens in a new tab</p>
      </div>
    </div>
  );
};

export default function MyCourses() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [filter, setFilter] = useState('All');

  const tags = ['All', 'Core CSE', 'Science', 'Web Dev', 'DevOps'];
  const filtered = filter === 'All' ? COURSES : COURSES.filter(c => c.tag === filter);

  return (
    <div style={{ fontFamily: "'Inter',sans-serif", color: 'white' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .course-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .course-card:hover { transform: translateY(-5px); box-shadow: 0 16px 40px rgba(168,85,247,0.2) !important; }
        .view-btn:hover { opacity: 0.88 !important; transform: translateY(-1px); }
        .mc-pill:hover { transform: scale(1.03); }
      `}</style>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#1e0a3c 0%,#0f1f3d 50%,#0d1117 100%)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: 20, padding: '28px 32px', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle,rgba(168,85,247,0.2) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#a855f7,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>🎓</div>
            <div>
              <p style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#a855f7', marginBottom: 4 }}>Learning Hub</p>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>My Courses</h1>
            </div>
          </div>
          <div style={{ background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.25)', borderRadius: 12, padding: '10px 18px', textAlign: 'center' }}>
            <p style={{ fontSize: '1.4rem', fontWeight: 800, color: '#a855f7', lineHeight: 1 }}>{COURSES.length}</p>
            <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>Total Courses</p>
          </div>
        </div>
      </div>

      {/* Filter Pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20, alignItems: 'center' }}>
        {tags.map(tag => {
          const active = filter === tag;
          const s = TAG_STYLES[tag];
          return (
            <button
              key={tag}
              onClick={() => setFilter(tag)}
              className="mc-pill"
              style={{
                padding: '7px 16px', borderRadius: 100, fontSize: '0.8rem', fontWeight: 600,
                transition: 'all 0.15s', border: '1px solid',
                background: active && s ? s.bg : active ? 'rgba(168,85,247,0.1)' : 'rgba(255,255,255,0.04)',
                color: active && s ? s.color : active ? '#a855f7' : 'rgba(255,255,255,0.45)',
                borderColor: active && s ? s.border : active ? 'rgba(168,85,247,0.4)' : 'rgba(255,255,255,0.08)',
              }}
            >{tag}</button>
          );
        })}
        <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>
          {filtered.length} course{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Course Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16 }}>
        {filtered.map((course) => {
          const ts = TAG_STYLES[course.tag] || TAG_STYLES['Core CSE'];
          return (
            <div
              key={course.id}
              className="course-card"
              style={{ background: '#111827', borderRadius: 18, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              {/* Banner */}
              <div
                style={{ height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative', background: `linear-gradient(135deg,${course.gradFrom},${course.gradTo})` }}
              >
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 80%,rgba(255,255,255,0.12) 0%,transparent 50%),radial-gradient(circle at 80% 20%,rgba(255,255,255,0.08) 0%,transparent 50%)' }} />
                <span style={{ fontSize: '3.2rem', position: 'relative', zIndex: 1, filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))' }}>{course.emoji}</span>
                <span
                  style={{ position: 'absolute', top: 10, right: 10, padding: '3px 9px', borderRadius: 100, fontSize: '0.68rem', fontWeight: 700, background: ts.bg, color: ts.color, border: `1px solid ${ts.border}` }}
                >{course.tag}</span>
              </div>

              {/* Body */}
              <div style={{ padding: '14px 16px' }}>
                <h3 style={{ fontWeight: 700, fontSize: '0.875rem', color: 'rgba(255,255,255,0.9)', marginBottom: 3, lineHeight: 1.3 }}>{course.title}</h3>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginBottom: 12 }}>by {course.instructor}</p>

                {/* Next Lesson */}
                <div style={{ marginBottom: 14, padding: '9px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)', marginBottom: 3 }}>Up next</p>
                  <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>{course.nextLesson}</p>
                </div>

                {/* View Button */}
                <button
                  onClick={() => setSelectedCourse(course)}
                  className="view-btn"
                  style={{ width: '100%', padding: '9px 14px', borderRadius: 10, fontSize: '0.78rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'white', border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#a855f7,#ec4899)', boxShadow: '0 4px 14px rgba(168,85,247,0.35)', transition: 'all 0.2s' }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  <span>View YouTube Channels</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {selectedCourse && (
        <ChannelModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />
      )}
    </div>
  );
}