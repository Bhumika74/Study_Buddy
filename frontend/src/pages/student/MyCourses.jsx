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
  'Core CSE': { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
  'Science':  { bg: '#ecfeff', color: '#0e7490', border: '#a5f3fc' },
  'Web Dev':  { bg: '#f0fdf4', color: '#065f46', border: '#a7f3d0' },
  'DevOps':   { bg: '#f0fdfa', color: '#0f766e', border: '#99f6e4' },
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

/* ── Channel Modal ── */
const ChannelModal = ({ course, onClose }) => {
  const channels = youtubeChannels[course.id] || [];
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl bg-white"
        style={{ maxHeight: '88vh', overflowY: 'auto', border: '1px solid #e5e7eb' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative p-6 pb-4" style={{ borderBottom: '1px solid #f3f4f6' }}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
          >✕</button>
          <div className="flex items-center space-x-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${course.gradFrom}, ${course.gradTo})` }}
            >{course.emoji}</div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-0.5 text-gray-400">📺 YouTube Channels</p>
              <h2 className="text-lg font-bold text-gray-800">{course.title}</h2>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Select a channel to open it on YouTube →</p>
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
              style={{ background: '#f9fafb', border: '1px solid #f3f4f6', transition: 'all 0.15s', textDecoration: 'none' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#f0fdfa'; e.currentTarget.style.border = '1px solid #99f6e4'; e.currentTarget.style.transform = 'translateX(4px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.border = '1px solid #f3f4f6'; e.currentTarget.style.transform = 'translateX(0)'; }}
            >
              <div className="w-11 h-11 rounded-lg flex items-center justify-center text-xl flex-shrink-0 bg-gray-100">{ch.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="font-semibold text-sm text-gray-800 truncate">{ch.name}</p>
                  <span className="text-xs text-gray-400 flex-shrink-0">{ch.subs}</span>
                </div>
                <p className="text-xs text-gray-500 truncate mt-0.5">{ch.desc}</p>
                <p className="text-xs text-teal-600 mt-0.5">{ch.handle}</p>
              </div>
              <div className="flex-shrink-0 opacity-40 group-hover:opacity-100 transition-opacity">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#FF0000">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </div>
            </a>
          ))}
        </div>
        <p className="text-center text-xs text-gray-300 pb-4">Opens in a new tab</p>
      </div>
    </div>
  );
};

/* ── Main Component ── */
export default function MyCourses() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [filter, setFilter] = useState('All');

  const tags = ['All', 'Core CSE', 'Science', 'Web Dev', 'DevOps'];
  const filtered = filter === 'All' ? COURSES : COURSES.filter(c => c.tag === filter);

  return (
    <div className="min-h-screen bg-gray-50 p-6" style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        .course-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .course-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.1) !important; }
        .view-btn:hover { background: #0d9488 !important; box-shadow: 0 4px 14px rgba(20,184,166,0.4) !important; }
      `}</style>

      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: 'linear-gradient(135deg,#0f766e,#0891b2)' }}
          >🎓</div>
          <div>
            <h1 className="text-xl font-bold text-gray-800 leading-none">Courses</h1>
            <p className="text-xs text-gray-400 mt-0.5">{COURSES.length} courses enrolled</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-teal-50 border border-teal-100">
          <span className="text-base">📚</span>
          <div>
            <p className="text-sm font-bold text-teal-700 leading-none">{COURSES.length}</p>
            <p className="text-xs text-teal-500">Total Courses</p>
          </div>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tags.map(tag => {
          const active = filter === tag;
          const s = TAG_STYLES[tag];
          return (
            <button
              key={tag}
              onClick={() => setFilter(tag)}
              className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-150"
              style={
                active && s
                  ? { background: s.bg, color: s.color, border: `1px solid ${s.border}` }
                  : active
                  ? { background: '#f0fdfa', color: '#0f766e', border: '1px solid #99f6e4' }
                  : { background: 'white', color: '#6b7280', border: '1px solid #e5e7eb' }
              }
            >{tag}</button>
          );
        })}
        <span className="ml-auto text-xs self-center text-gray-400">
          {filtered.length} course{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Course Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((course) => {
          const ts = TAG_STYLES[course.tag] || TAG_STYLES['Core CSE'];
          return (
            <div
              key={course.id}
              className="course-card bg-white rounded-2xl overflow-hidden border border-gray-100"
              style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
            >
              {/* Banner */}
              <div
                className="relative h-28 flex items-center justify-center overflow-hidden"
                style={{ background: `linear-gradient(135deg,${course.gradFrom},${course.gradTo})` }}
              >
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle at 20% 80%,rgba(255,255,255,0.12) 0%,transparent 50%),radial-gradient(circle at 80% 20%,rgba(255,255,255,0.08) 0%,transparent 50%)',
                }} />
                <span className="text-5xl relative z-10" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))' }}>{course.emoji}</span>
                <span
                  className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-xs font-semibold"
                  style={{ background: 'rgba(255,255,255,0.9)', color: ts.color, border: `1px solid ${ts.border}` }}
                >{course.tag}</span>
              </div>

              {/* Body */}
              <div className="p-4">
                <h3 className="font-bold text-sm text-gray-800 leading-snug mb-0.5">{course.title}</h3>
                <p className="text-xs text-gray-400 mb-4">by {course.instructor}</p>

                {/* Next Lesson */}
                <div className="mb-4 px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-100">
                  <p className="text-xs text-gray-400 mb-0.5">Up next</p>
                  <p className="text-xs font-semibold text-gray-700">{course.nextLesson}</p>
                </div>

                {/* Teal View Button */}
                <button
                  onClick={() => setSelectedCourse(course)}
                  className="view-btn w-full px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 text-white transition-all duration-200"
                  style={{ background: '#14b8a6', boxShadow: '0 2px 8px rgba(20,184,166,0.3)' }}
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