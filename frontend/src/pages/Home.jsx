import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'admin': return '/admin';
      case 'educator': return '/educator';
      case 'student': return '/student';
      default: return '/login';
    }
  };

  const stats = [
    { icon: '⚡', value: '50K+',  label: 'Active Students' },
    { icon: '⚡', value: '10M+',  label: 'Lessons Completed' },
    { icon: '⚡', value: '98%',   label: 'Satisfaction Rate' },
  ];

  const features = [
    { emoji: '🧠', title: 'AI-Powered Learning',   desc: 'Personalized paths and intelligent tutoring tailored exactly to your pace and goals.' },
    { emoji: '💬', title: 'Smart AI Assistant',     desc: 'Upload notes, chat with AI, and get instant summaries and auto-generated quizzes.' },
    { emoji: '📊', title: 'Progress Tracking',      desc: 'Beautiful analytics and performance dashboards so you always know where you stand.' },
    { emoji: '📚', title: 'Rich Content Library',   desc: 'Thousands of lessons, exercises, and materials crafted by expert educators.' },
    { emoji: '🛡️', title: 'Secure & Reliable',      desc: 'Enterprise-grade security keeps your data safe and your learning uninterrupted.' },
    { emoji: '🎯', title: 'Role-Based Dashboards',  desc: 'Tailored views for students, educators, and admins — everyone gets exactly what they need.' },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .sb {
          font-family: 'Sora', sans-serif;
          background: #F7F8FA;
          color: #0D1117;
          overflow-x: hidden;
        }

        /* ── NAVBAR ── */
        .sb-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 999;
          height: 68px;
          background: rgba(255,255,255,0.96);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid #e8f5f0;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 80px;
          box-shadow: 0 2px 16px rgba(26,122,110,0.06);
        }
        .sb-nav-logo {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none; font-size: 1.1rem; font-weight: 800;
          color: #1a7a6e; letter-spacing: -0.02em;
        }
        .sb-nav-logo-mark {
          width: 36px; height: 36px; border-radius: 10px;
          background: #1a7a6e;
          display: flex; align-items: center; justify-content: center;
          color: white; flex-shrink: 0;
        }
        .sb-nav-links {
          display: flex; align-items: center; gap: 6px;
        }
        .sb-nav-link {
          padding: 8px 18px; border-radius: 100px;
          font-size: 0.875rem; font-weight: 600; color: #6b7280;
          text-decoration: none; transition: all 0.18s;
        }
        .sb-nav-link:hover { background: #f0faf8; color: #1a7a6e; }
        .sb-nav-btn-login {
          padding: 9px 22px; border-radius: 100px;
          font-size: 0.875rem; font-weight: 700;
          color: #1a7a6e; text-decoration: none;
          border: 2px solid #1a7a6e; transition: all 0.2s;
        }
        .sb-nav-btn-login:hover { background: #1a7a6e; color: white; }
        .sb-nav-btn-signup {
          padding: 9px 22px; border-radius: 100px;
          font-size: 0.875rem; font-weight: 700;
          background: #1a7a6e; color: white;
          text-decoration: none; transition: all 0.2s;
          box-shadow: 0 4px 14px rgba(26,122,110,0.35);
        }
        .sb-nav-btn-signup:hover { background: #155f55; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(26,122,110,0.45); }

        @media (max-width: 768px) {
          .sb-nav { padding: 0 20px; }
          .sb-nav-link { display: none; }
        }

        /* ── HERO ── */
        .sb-hero {
          min-height: 100vh;
          background: #FFFFFF;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          padding: 100px 80px 60px;
          position: relative;
          overflow: hidden;
          gap: 40px;
        }

        /* subtle grid lines like GlobalTalk */
        .sb-hero::before {
          content: '';
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px);
          background-size: 80px 80px;
          pointer-events: none; z-index: 0;
        }

        /* LEFT */
        .sb-hero-left {
          position: relative; z-index: 2;
          animation: fadeUp 0.6s ease both;
        }

        .sb-hero-tag {
          font-size: 0.72rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.18em;
          color: #1a7a6e;
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 20px;
        }
        .sb-hero-tag::before {
          content: '';
          display: block; width: 28px; height: 2px;
          background: #1a7a6e; border-radius: 2px;
        }

        .sb-hero-h1 {
          font-size: clamp(2.8rem, 5vw, 5rem);
          font-weight: 800;
          line-height: 1.06;
          letter-spacing: -0.03em;
          color: #0D1117;
          margin-bottom: 20px;
        }
        .sb-hero-h1 .teal { color: #1a7a6e; }

        .sb-hero-p {
          font-size: 1rem; color: #6b7280;
          line-height: 1.75; max-width: 420px;
          font-weight: 400; margin-bottom: 36px;
        }

        /* buttons */
        .sb-hero-btns { display: flex; align-items: center; gap: 14px; margin-bottom: 52px; flex-wrap: wrap; }

        .sb-btn-signin {
          font-size: 0.9rem; font-weight: 600; color: #0D1117;
          text-decoration: none; display: flex; align-items: center; gap: 6px;
          transition: gap 0.2s;
        }
        .sb-btn-signin:hover { gap: 10px; }
        .sb-btn-signin::after { content: '+'; font-size: 1rem; font-weight: 800; }

        .sb-btn-learn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 26px; border-radius: 100px;
          background: #1a7a6e; color: white;
          font-size: 0.9rem; font-weight: 700;
          text-decoration: none; transition: all 0.22s;
          box-shadow: 0 6px 20px rgba(26,122,110,0.35);
        }
        .sb-btn-learn:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(26,122,110,0.45); background: #155f55; }
        .sb-btn-learn::after { content: '+'; font-size: 1.1rem; font-weight: 900; }

        /* stats row */
        .sb-hero-stats { display: flex; gap: 40px; flex-wrap: wrap; }
        .sb-hero-stat { display: flex; flex-direction: column; }
        .sb-hero-stat-val {
          font-size: 2.2rem; font-weight: 800; letter-spacing: -0.04em;
          color: #0D1117; line-height: 1;
          display: flex; align-items: center; gap: 4px;
        }
        .sb-hero-stat-val .bolt { font-size: 1.4rem; color: #1a7a6e; }
        .sb-hero-stat-label { font-size: 0.78rem; color: #9ca3af; font-weight: 500; margin-top: 4px; }

        /* RIGHT — 3D character area */
        .sb-hero-right {
          position: relative; z-index: 2;
          display: flex; align-items: flex-end; justify-content: center;
          min-height: 520px;
          animation: fadeUp 0.6s 0.15s ease both;
        }

        /* big soft circle behind character */
        .sb-char-ring {
          position: absolute;
          width: 460px; height: 460px; border-radius: 50%;
          background: linear-gradient(135deg, #e8f7f5 0%, #f0faf8 100%);
          bottom: 0; left: 50%; transform: translateX(-50%);
          z-index: 0;
        }
        .sb-char-ring::before {
          content: '';
          position: absolute; inset: -14px; border-radius: 50%;
          border: 1.5px dashed rgba(26,122,110,0.2);
        }

        /* character image */
        .sb-char-img {
          position: relative; z-index: 2;
          width: 420px; height: auto;
          object-fit: contain;
          filter: drop-shadow(0 24px 48px rgba(0,0,0,0.12));
          animation: charFloat 5s ease-in-out infinite;
        }
        @keyframes charFloat {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-14px); }
        }

        /* floating pill badges */
        .sb-float-pill {
          position: absolute; z-index: 3;
          background: white; border-radius: 100px;
          padding: 10px 18px;
          box-shadow: 0 8px 28px rgba(0,0,0,0.10);
          display: flex; align-items: center; gap: 10px;
          font-size: 0.8rem; font-weight: 700; color: #0D1117;
          white-space: nowrap;
          animation: pillFloat 4s ease-in-out infinite;
        }
        .sb-float-pill-icon {
          width: 32px; height: 32px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem; flex-shrink: 0;
        }
        .sb-pill-1 { top: 60px; left: -10px; animation-delay: 0s; }
        .sb-pill-2 { top: 50%; right: -20px; transform: translateY(-50%); animation-delay: 1.2s; }
        .sb-pill-3 { bottom: 60px; left: 0px; animation-delay: 2.4s; }
        @keyframes pillFloat {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .sb-pill-2 { animation-name: pillFloat2; }
        @keyframes pillFloat2 {
          0%,100% { transform: translateY(-50%); }
          50% { transform: translateY(calc(-50% - 8px)); }
        }

        .sb-float-pill-sub { font-size: 0.68rem; color: #9ca3af; font-weight: 500; margin-top: 1px; }

        /* decorative dots */
        .sb-deco-dot {
          position: absolute; border-radius: 50%; z-index: 1;
          animation: dotBounce 3s ease-in-out infinite;
        }
        @keyframes dotBounce {
          0%,100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-10px) scale(1.1); }
        }

        /* ── FEATURES ── */
        .sb-features {
          padding: 100px 80px;
          background: #F7F8FA;
        }
        .sb-features-top {
          display: flex; align-items: flex-end; justify-content: space-between;
          margin-bottom: 56px; gap: 40px;
        }
        .sb-features-tag {
          font-size: 0.72rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.15em; color: #1a7a6e;
          display: flex; align-items: center; gap: 8px; margin-bottom: 12px;
        }
        .sb-features-tag::before {
          content: ''; display: block; width: 24px; height: 2px;
          background: #1a7a6e; border-radius: 2px;
        }
        .sb-features-h2 {
          font-size: clamp(1.8rem, 3vw, 2.8rem);
          font-weight: 800; letter-spacing: -0.03em; color: #0D1117; line-height: 1.1;
        }
        .sb-features-sub {
          font-size: 0.95rem; color: #9ca3af; max-width: 300px;
          line-height: 1.7; font-weight: 400; flex-shrink: 0;
        }

        .sb-feat-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;
        }
        .sb-feat-card {
          background: white; border-radius: 20px; padding: 32px 28px;
          border: 1.5px solid #F0F0F0;
          transition: all 0.28s; cursor: default;
        }
        .sb-feat-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 48px rgba(0,0,0,0.07);
          border-color: #d1faf4;
        }
        .sb-feat-emoji-wrap {
          width: 52px; height: 52px; border-radius: 14px;
          background: #f0faf8; display: flex; align-items: center; justify-content: center;
          font-size: 1.6rem; margin-bottom: 18px;
          transition: transform 0.3s;
        }
        .sb-feat-card:hover .sb-feat-emoji-wrap { transform: scale(1.1) rotate(-5deg); }
        .sb-feat-title { font-size: 1rem; font-weight: 700; color: #0D1117; margin-bottom: 8px; }
        .sb-feat-desc { font-size: 0.855rem; color: #9ca3af; line-height: 1.65; font-weight: 400; }

        /* ── CTA ── */
        .sb-cta {
          margin: 0 80px 100px;
          border-radius: 28px;
          background: #0D1117;
          padding: 80px 72px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 48px; position: relative; overflow: hidden;
        }
        .sb-cta::before {
          content: '';
          position: absolute; width: 400px; height: 400px; border-radius: 50%;
          background: radial-gradient(circle, rgba(26,122,110,0.35) 0%, transparent 70%);
          right: -80px; top: -80px; pointer-events: none;
        }
        .sb-cta::after {
          content: '';
          position: absolute; width: 250px; height: 250px; border-radius: 50%;
          background: radial-gradient(circle, rgba(26,122,110,0.2) 0%, transparent 70%);
          left: -40px; bottom: -80px; pointer-events: none;
        }
        .sb-cta-left { position: relative; z-index: 1; }
        .sb-cta-tag {
          font-size: 0.72rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.15em; color: #4ecca3;
          display: flex; align-items: center; gap: 8px; margin-bottom: 16px;
        }
        .sb-cta-tag::before {
          content: ''; display: block; width: 24px; height: 2px;
          background: #4ecca3; border-radius: 2px;
        }
        .sb-cta-h2 {
          font-size: clamp(1.8rem, 3vw, 2.8rem);
          font-weight: 800; color: white; letter-spacing: -0.03em;
          line-height: 1.1; max-width: 500px;
        }
        .sb-cta-h2 span { color: #4ecca3; }
        .sb-cta-p { font-size: 0.95rem; color: rgba(255,255,255,0.5); margin-top: 14px; line-height: 1.7; }
        .sb-cta-right { flex-shrink: 0; position: relative; z-index: 1; text-align: right; }
        .sb-btn-cta {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 16px 34px; border-radius: 100px;
          background: #1a7a6e; color: white;
          font-size: 1rem; font-weight: 700; text-decoration: none;
          transition: all 0.25s;
          box-shadow: 0 8px 24px rgba(26,122,110,0.4);
          white-space: nowrap;
        }
        .sb-btn-cta:hover { transform: translateY(-3px); box-shadow: 0 14px 36px rgba(26,122,110,0.55); background: #155f55; }
        .sb-cta-note { font-size: 0.78rem; color: rgba(255,255,255,0.3); margin-top: 10px; }

        /* ── FOOTER ── */
        .sb-footer {
          background: #0D1117; padding: 32px 80px;
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 16px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .sb-footer-logo {
          display: flex; align-items: center; gap: 9px;
          font-size: 1rem; font-weight: 800; color: white; text-decoration: none;
          letter-spacing: -0.02em;
        }
        .sb-footer-logo-mark {
          width: 30px; height: 30px; border-radius: 9px;
          background: #1a7a6e;
          display: flex; align-items: center; justify-content: center; color: white;
        }
        .sb-footer-copy { font-size: 0.8rem; color: rgba(255,255,255,0.25); }
        .sb-footer-links { display: flex; gap: 24px; }
        .sb-footer-link {
          font-size: 0.8rem; color: rgba(255,255,255,0.35);
          text-decoration: none; transition: color 0.15s;
        }
        .sb-footer-link:hover { color: rgba(255,255,255,0.85); }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 1024px) {
          .sb-hero { grid-template-columns: 1fr; padding: 110px 32px 60px; text-align: center; }
          .sb-hero-tag { justify-content: center; }
          .sb-hero-p { margin: 0 auto 36px; }
          .sb-hero-btns { justify-content: center; }
          .sb-hero-stats { justify-content: center; }
          .sb-hero-right { min-height: 360px; }
          .sb-char-ring { width: 320px; height: 320px; }
          .sb-char-img { width: 300px; }
          .sb-features { padding: 70px 32px; }
          .sb-features-top { flex-direction: column; align-items: flex-start; }
          .sb-feat-grid { grid-template-columns: 1fr 1fr; }
          .sb-cta { margin: 0 32px 80px; flex-direction: column; padding: 52px 36px; }
          .sb-cta-right { text-align: left; }
          .sb-footer { padding: 28px 32px; }
        }
        @media (max-width: 600px) {
          .sb-hero { padding: 100px 20px 50px; }
          .sb-feat-grid { grid-template-columns: 1fr; }
          .sb-cta { margin: 0 16px 60px; }
          .sb-footer { padding: 24px 20px; }
          .sb-char-img { width: 240px; }
          .sb-char-ring { width: 260px; height: 260px; }
        }
      `}</style>

      <div className="sb">

        {/* ── NAVBAR ── */}
        <nav className="sb-nav">
          <Link to="/" className="sb-nav-logo">
            <div className="sb-nav-logo-mark">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            Study Buddy
          </Link>
          <div className="sb-nav-links">
            {/* <a href="#features" className="sb-nav-link">Features</a>
            <a href="#" className="sb-nav-link">About</a> */}
            {user ? (
              <Link to={getDashboardLink()} className="sb-nav-btn-signup">Dashboard →</Link>
            ) : (
              <>
                <Link to="/login" className="sb-nav-btn-login">Login</Link>
                <Link to="/register" className="sb-nav-btn-signup">Sign Up</Link>
              </>
            )}
          </div>
        </nav>

        {/* ── HERO ── */}
        <section className="sb-hero">

          {/* LEFT */}
          <div className="sb-hero-left">
            <div className="sb-hero-tag">AI-Powered E-Learning Platform</div>

            <h1 className="sb-hero-h1">
              Learn, grow and<br />
              achieve more with<br />
              <span className="teal">StudyBuddy.</span>
            </h1>

            <p className="sb-hero-p">
              Your personal AI tutor that creates custom lessons, tracks your progress, generates quizzes and helps you score better — every single day.
            </p>

            <div className="sb-hero-btns">
              {user ? (
                <Link to={getDashboardLink()} className="sb-btn-learn">Go to Dashboard</Link>
              ) : (
                <>
                  <Link to="/login" className="sb-btn-signin">Sign In</Link>
                  <Link to="/register" className="sb-btn-learn">Get Started</Link>
                </>
              )}
            </div>

            <div className="sb-hero-stats">
              {stats.map((s, i) => (
                <div className="sb-hero-stat" key={i}>
                  <span className="sb-hero-stat-val">
                    <span className="bolt">{s.icon}</span>{s.value}
                  </span>
                  <span className="sb-hero-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — character */}
          <div className="sb-hero-right">
            <div className="sb-char-ring" />

            {/* Decorative bouncing dots */}
            <div className="sb-deco-dot" style={{ width:14, height:14, background:'#FFC75F', top:'18%', left:'12%', animationDelay:'0s' }} />
            <div className="sb-deco-dot" style={{ width:10, height:10, background:'#1a7a6e', top:'30%', right:'8%', animationDelay:'1s' }} />
            <div className="sb-deco-dot" style={{ width:18, height:18, background:'#FF6B6B', bottom:'22%', right:'14%', animationDelay:'1.8s' }} />

            {/* Hero Visual — Studying Girl Illustration */}
            <div style={{
              position: 'relative', zIndex: 2,
              width: 440, height: 440,
              borderRadius: '50%',
              background: 'linear-gradient(145deg, #e8f5f0 0%, #f5f0ff 50%, #fff8e8 100%)',
              border: '5px solid white',
              boxShadow: '0 32px 80px rgba(26,122,110,0.15), 0 8px 24px rgba(0,0,0,0.06)',
              overflow: 'hidden',
              display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
              animation: 'charFloat 5s ease-in-out infinite',
              flexShrink: 0,
            }}>
              <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">

                {/* === BACKGROUND === */}
                <circle cx="200" cy="200" r="200" fill="url(#bgGrad)"/>
                <defs>
                  <radialGradient id="bgGrad" cx="50%" cy="40%">
                    <stop offset="0%" stopColor="#f0fdf9"/>
                    <stop offset="100%" stopColor="#e8f0ff"/>
                  </radialGradient>
                </defs>

                {/* === DESK === */}
                <rect x="0" y="292" width="400" height="16" rx="6" fill="#D4956A"/>
                <rect x="0" y="305" width="400" height="95" rx="0" fill="#B87848"/>

                {/* === BOOKS STACK LEFT === */}
                <rect x="18" y="258" width="72" height="14" rx="4" fill="#EF4444"/>
                <rect x="16" y="246" width="76" height="14" rx="4" fill="#3B82F6"/>
                <rect x="20" y="235" width="68" height="13" rx="4" fill="#10B981"/>
                {/* book spines */}
                <rect x="18" y="258" width="5" height="14" rx="2" fill="#DC2626"/>
                <rect x="16" y="246" width="5" height="14" rx="2" fill="#2563EB"/>
                <rect x="20" y="235" width="5" height="13" rx="2" fill="#059669"/>

                {/* === OPEN NOTEBOOK === */}
                <path d="M85 232 Q200 218 200 292 Q200 218 315 232 L316 293 Q200 279 200 293 Q200 279 84 293Z" fill="#fffef5"/>
                <path d="M85 232 Q200 218 200 293" fill="none" stroke="#e5e7eb" strokeWidth="1.5"/>
                <path d="M315 232 Q200 218 200 293" fill="none" stroke="#e5e7eb" strokeWidth="1.5"/>
                {/* spine shadow */}
                <rect x="197" y="218" width="6" height="75" rx="3" fill="#d1d5db"/>
                {/* notebook lines left */}
                <line x1="100" y1="244" x2="190" y2="241" stroke="#c7d2fe" strokeWidth="1.8" opacity="0.8"/>
                <line x1="99" y1="254" x2="190" y2="251" stroke="#c7d2fe" strokeWidth="1.8" opacity="0.8"/>
                <line x1="98" y1="264" x2="190" y2="261" stroke="#c7d2fe" strokeWidth="1.8" opacity="0.7"/>
                <line x1="98" y1="274" x2="188" y2="271" stroke="#c7d2fe" strokeWidth="1.8" opacity="0.6"/>
                <line x1="98" y1="284" x2="186" y2="281" stroke="#c7d2fe" strokeWidth="1.5" opacity="0.5"/>
                {/* notebook lines right */}
                <line x1="210" y1="241" x2="300" y2="244" stroke="#c7d2fe" strokeWidth="1.8" opacity="0.8"/>
                <line x1="210" y1="251" x2="300" y2="254" stroke="#c7d2fe" strokeWidth="1.8" opacity="0.8"/>
                <line x1="210" y1="261" x2="300" y2="264" stroke="#c7d2fe" strokeWidth="1.8" opacity="0.7"/>
                <line x1="210" y1="271" x2="298" y2="274" stroke="#c7d2fe" strokeWidth="1.8" opacity="0.6"/>
                <line x1="210" y1="281" x2="295" y2="284" stroke="#c7d2fe" strokeWidth="1.5" opacity="0.5"/>

                {/* === PENCIL CUP RIGHT === */}
                <rect x="316" y="250" width="50" height="44" rx="10" fill="#60A5FA"/>
                <rect x="316" y="250" width="50" height="10" rx="5" fill="#3B82F6"/>
                {/* pencils in cup */}
                <rect x="326" y="220" width="7" height="34" rx="3" fill="#FBBF24"/>
                <polygon points="326,253 329,263 333,253" fill="#EF4444"/>
                <rect x="337" y="216" width="7" height="36" rx="3" fill="#F87171"/>
                <polygon points="337,251 340,262 344,251" fill="#FBBF24"/>
                <rect x="348" y="218" width="7" height="34" rx="3" fill="#34D399"/>
                <polygon points="348,251 351,262 355,251" fill="#059669"/>

                {/* === BODY === */}
                {/* hoodie/jacket */}
                <path d="M118 222 Q100 235 96 265 L304 265 Q300 235 282 222 Q255 208 200 206 Q145 208 118 222Z" fill="#3A7A6E"/>
                {/* inner shirt */}
                <path d="M160 210 Q200 230 240 210 Q224 206 200 205 Q176 206 160 210Z" fill="#C084A0"/>
                <path d="M160 210 L165 240 Q183 248 200 248 Q217 248 235 240 L240 210 Q220 224 200 224 Q180 224 160 210Z" fill="#C084A0"/>
                {/* jacket details */}
                <path d="M118 222 Q130 215 145 218 Q160 210 165 240 Q145 250 130 255 Q112 250 108 238Z" fill="#2d6058"/>
                <path d="M282 222 Q270 215 255 218 Q240 210 235 240 Q255 250 270 255 Q288 250 292 238Z" fill="#2d6058"/>
                {/* pocket left */}
                <rect x="112" y="242" width="26" height="18" rx="6" fill="#246056"/>
                {/* pocket right */}
                <rect x="262" y="242" width="26" height="18" rx="6" fill="#246056"/>

                {/* === NECK === */}
                <rect x="184" y="196" width="32" height="16" rx="10" fill="#FDDCB5"/>

                {/* === HEAD === */}
                <ellipse cx="200" cy="158" rx="64" ry="68" fill="#FDDCB5"/>

                {/* === EARS === */}
                <ellipse cx="137" cy="164" rx="11" ry="15" fill="#F5C89A"/>
                <ellipse cx="137" cy="164" rx="7" ry="10" fill="#FDDCB5"/>
                <ellipse cx="263" cy="164" rx="11" ry="15" fill="#F5C89A"/>
                <ellipse cx="263" cy="164" rx="7" ry="10" fill="#FDDCB5"/>

                {/* === HAIR === */}
                {/* main hair cap - orange */}
                <path d="M137 145 Q134 80 158 56 Q176 38 200 36 Q224 38 242 56 Q266 80 263 145 Q252 112 234 103 Q218 94 200 93 Q182 94 166 103 Q148 112 137 145Z" fill="#E8821A"/>
                {/* left side hair */}
                <path d="M137 145 Q128 165 130 190 Q132 208 137 218 Q141 202 141 182 Q141 162 145 148Z" fill="#E8821A"/>
                {/* right side shorter */}
                <path d="M263 145 Q272 165 270 190 Q268 208 263 218 Q259 202 259 182 Q259 162 255 148Z" fill="#E8821A"/>
                {/* hair shine */}
                <path d="M168 46 Q196 36 218 42 Q208 58 192 54 Q178 52 168 46Z" fill="#F4A83A" opacity="0.7"/>
                {/* hair strands */}
                <path d="M144 132 Q148 148 146 164" stroke="#C86010" strokeWidth="2" fill="none" opacity="0.4"/>
                <path d="M152 118 Q154 138 152 155" stroke="#C86010" strokeWidth="2" fill="none" opacity="0.35"/>

                {/* === HEADBAND === */}
                <path d="M137 132 Q168 108 200 106 Q232 108 263 132" stroke="#1B4D47" strokeWidth="15" strokeLinecap="round" fill="none"/>
                <path d="M137 132 Q168 108 200 106 Q232 108 263 132" stroke="#2d7a70" strokeWidth="9" strokeLinecap="round" fill="none"/>
                {/* headband shine */}
                <path d="M155 118 Q185 106 215 116" stroke="rgba(255,255,255,0.25)" strokeWidth="3" strokeLinecap="round" fill="none"/>

                {/* === PONYTAIL === */}
                <ellipse cx="252" cy="112" rx="16" ry="12" fill="#E8821A"/>
                <path d="M252 112 Q294 94 306 122 Q314 152 296 168 Q280 178 268 168 Q286 158 288 138 Q286 118 268 116Z" fill="#E8821A"/>
                {/* ponytail tip */}
                <path d="M268 168 Q278 184 264 190 Q254 186 260 175Z" fill="#C86010"/>
                {/* ponytail shine */}
                <path d="M264 100 Q286 93 298 104" stroke="#F4A83A" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.5"/>

                {/* === EYES — big cute wide open === */}
                {/* eye whites */}
                <ellipse cx="177" cy="162" rx="17" ry="18" fill="white"/>
                <ellipse cx="223" cy="162" rx="17" ry="18" fill="white"/>
                {/* eye border */}
                <ellipse cx="177" cy="162" rx="17" ry="18" fill="none" stroke="#1a1a2e" strokeWidth="2"/>
                <ellipse cx="223" cy="162" rx="17" ry="18" fill="none" stroke="#1a1a2e" strokeWidth="2"/>
                {/* iris */}
                <circle cx="178" cy="164" r="12" fill="#4A6FA5"/>
                <circle cx="224" cy="164" r="12" fill="#4A6FA5"/>
                {/* pupil */}
                <circle cx="178" cy="164" r="7" fill="#111827"/>
                <circle cx="224" cy="164" r="7" fill="#111827"/>
                {/* main sparkle */}
                <circle cx="183" cy="158" r="4.5" fill="white"/>
                <circle cx="229" cy="158" r="4.5" fill="white"/>
                {/* small sparkle */}
                <circle cx="173" cy="168" r="2" fill="white" opacity="0.7"/>
                <circle cx="219" cy="168" r="2" fill="white" opacity="0.7"/>
                {/* eyelashes top */}
                <path d="M161 151 Q164 144 168 150" stroke="#111827" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                <path d="M168 148 Q172 140 177 146" stroke="#111827" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                <path d="M207 146 Q212 139 217 145" stroke="#111827" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                <path d="M215 148 Q220 141 225 147" stroke="#111827" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                <path d="M225 151 Q229 145 233 150" stroke="#111827" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                {/* eyebrows - arched, expressive */}
                <path d="M159 143 Q177 133 194 139" stroke="#C86010" strokeWidth="4" strokeLinecap="round" fill="none"/>
                <path d="M206 139 Q223 133 241 143" stroke="#C86010" strokeWidth="4" strokeLinecap="round" fill="none"/>

                {/* === NOSE === */}
                <path d="M194 176 Q200 183 206 176" stroke="#E09060" strokeWidth="2.2" fill="none" strokeLinecap="round"/>

                {/* === SMILE — big happy open smile === */}
                <path d="M172 192 Q186 210 200 213 Q214 210 228 192" stroke="#D4504A" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
                {/* teeth */}
                <path d="M178 196 Q200 212 222 196 Q200 210 178 196Z" fill="white" opacity="0.9"/>
                {/* lip */}
                <path d="M172 192 Q200 188 228 192" stroke="#E06060" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5"/>

                {/* === BLUSH === */}
                <ellipse cx="152" cy="186" rx="18" ry="10" fill="#FFB3B3" opacity="0.45"/>
                <ellipse cx="248" cy="186" rx="18" ry="10" fill="#FFB3B3" opacity="0.45"/>

                {/* === ARMS === */}
                {/* left arm - writing */}
                <path d="M116 232 Q88 248 76 272 Q74 283 86 285 Q98 282 102 268 Q108 250 126 240Z" fill="#3A7A6E"/>
                <ellipse cx="80" cy="284" rx="17" ry="12" fill="#FDDCB5"/>
                {/* pencil */}
                <g transform="rotate(22 72 295)">
                  <rect x="66" y="265" width="10" height="52" rx="5" fill="#FBBF24"/>
                  <rect x="66" y="265" width="10" height="12" rx="4" fill="#FFCCCC"/>
                  <polygon points="66,316 71,330 76,316" fill="#EF4444"/>
                  <line x1="66" y1="277" x2="76" y2="277" stroke="#F59E0B" strokeWidth="1.5"/>
                </g>
                {/* right arm - on book */}
                <path d="M284 232 Q312 248 318 268 Q316 280 304 278 Q292 272 288 256Z" fill="#3A7A6E"/>
                <ellipse cx="308" cy="280" rx="20" ry="13" fill="#FDDCB5"/>

                {/* === FLOATING ELEMENTS === */}
                {/* A+ grade */}
                <circle cx="72" cy="100" r="22" fill="white" opacity="0.9"/>
                <circle cx="72" cy="100" r="22" fill="none" stroke="#10B981" strokeWidth="2"/>
                <text x="58" y="107" fontSize="16" fill="#10B981" fontWeight="bold" fontFamily="Sora,sans-serif">A+</text>

                {/* lightbulb idea */}
                <circle cx="316" cy="86" r="22" fill="white" opacity="0.9"/>
                <circle cx="316" cy="86" r="22" fill="none" stroke="#FBBF24" strokeWidth="2"/>
                <text x="305" y="94" fontSize="20" fill="#FBBF24">💡</text>

                {/* star sparkles */}
                <text x="52" y="148" fontSize="20" fill="#FBBF24" opacity="0.9">✦</text>
                <text x="326" y="148" fontSize="16" fill="#a78bfa" opacity="0.9">✦</text>
                <text x="340" y="198" fontSize="12" fill="#FF6B6B" opacity="0.8">★</text>
                <text x="32" y="215" fontSize="12" fill="#6BCB77" opacity="0.75">★</text>
                <text x="340" y="250" fontSize="10" fill="#60A5FA" opacity="0.7">✦</text>
              </svg>
            </div>

            {/* Floating pill badges */}
            <div className="sb-float-pill sb-pill-1">
              <div className="sb-float-pill-icon" style={{ background:'#f0faf8' }}>🏆</div>
              <div>
                <div>Top Rated</div>
                <div className="sb-float-pill-sub">4.9 ★ · 12k reviews</div>
              </div>
            </div>

            <div className="sb-float-pill sb-pill-2">
              <div className="sb-float-pill-icon" style={{ background:'#fff8ed' }}>⚡</div>
              <div>
                <div>98% Pass Rate</div>
                <div className="sb-float-pill-sub">All subjects</div>
              </div>
            </div>

            <div className="sb-float-pill sb-pill-3">
              <div className="sb-float-pill-icon" style={{ background:'#f0f0ff' }}>🤖</div>
              <div>
                <div>AI Tutoring</div>
                <div className="sb-float-pill-sub">Available 24/7</div>
              </div>
            </div>
          </div>

        </section>

        {/* ── FEATURES ── */}
        <section className="sb-features">
          <div className="sb-features-top">
            <div>
              <div className="sb-features-tag">Platform Features</div>
              <h2 className="sb-features-h2">Everything you need<br />to succeed</h2>
            </div>
            <p className="sb-features-sub">A complete toolkit for modern education — AI, analytics, and rich content all in one place.</p>
          </div>

          <div className="sb-feat-grid">
            {features.map((f, i) => (
              <div className="sb-feat-card" key={i}>
                <div className="sb-feat-emoji-wrap">{f.emoji}</div>
                <div className="sb-feat-title">{f.title}</div>
                <p className="sb-feat-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <div className="sb-cta">
          <div className="sb-cta-left">
            <div className="sb-cta-tag">Get Started Today</div>
            <h2 className="sb-cta-h2">
              Ready to <span>transform</span><br />your learning?
            </h2>
            <p className="sb-cta-p">Join 50,000+ students already accelerating with StudyBuddy. Free to start.</p>
          </div>
          {!user && (
            <div className="sb-cta-right">
              <Link to="/register" className="sb-btn-cta">
                Sign Up Free →
              </Link>
              <p className="sb-cta-note">No credit card required</p>
            </div>
          )}
        </div>

        {/* ── FOOTER ── */}
        <footer className="sb-footer">
          <Link to="/" className="sb-footer-logo">
            <div className="sb-footer-logo-mark">
              <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            StudyBuddy
          </Link>
          <span className="sb-footer-copy">© 2024 Study Buddy. All rights reserved.</span>
          <div className="sb-footer-links">
            <a href="#" className="sb-footer-link">Privacy</a>
            <a href="#" className="sb-footer-link">Terms</a>
            <a href="#" className="sb-footer-link">Contact</a>
          </div>
        </footer>

      </div>
    </>
  );
};

export default Home;