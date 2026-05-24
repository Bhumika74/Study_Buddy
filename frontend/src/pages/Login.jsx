import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user.role === 'admin') navigate('/admin');
        else if (user.role === 'educator') navigate('/educator');
        else navigate('/student');
      } else {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        nav:not(.lg-nav) { display: none !important; }

        .lg-page {
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
          background: #0d1117;
          display: flex; align-items: center; justify-content: center;
          padding: 100px 20px 40px;
          position: relative; overflow: hidden;
        }
        .lg-page::before {
          content: '';
          position: fixed; inset: 0;
          background:
            radial-gradient(ellipse 700px 600px at 10% 20%, rgba(168,85,247,0.08) 0%, transparent 70%),
            radial-gradient(ellipse 600px 500px at 90% 80%, rgba(6,182,212,0.06) 0%, transparent 70%);
          pointer-events: none; z-index: 0;
        }

        /* Navbar */
        .lg-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 999;
          height: 64px;
          background: rgba(13,27,46,0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 80px;
        }
        .lg-nav-logo {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none; font-size: 1.1rem; font-weight: 800;
          color: white; letter-spacing: -0.02em;
        }
        .lg-nav-logo-mark {
          width: 36px; height: 36px; border-radius: 10px;
          background: linear-gradient(135deg,#a855f7,#ec4899);
          display: flex; align-items: center; justify-content: center;
          color: white; flex-shrink: 0;
        }
        .lg-nav-links { display: flex; align-items: center; gap: 6px; }
        .lg-nav-link {
          padding: 8px 18px; border-radius: 100px;
          font-size: 0.875rem; font-weight: 600; color: rgba(255,255,255,0.5);
          text-decoration: none; transition: all 0.18s;
        }
        .lg-nav-link:hover { background: rgba(255,255,255,0.06); color: white; }
        .lg-nav-btn-signup {
          padding: 9px 22px; border-radius: 100px;
          font-size: 0.875rem; font-weight: 700;
          background: linear-gradient(135deg,#a855f7,#ec4899); color: white;
          text-decoration: none; transition: all 0.2s;
          box-shadow: 0 4px 14px rgba(168,85,247,0.4);
        }
        .lg-nav-btn-signup:hover { opacity: 0.88; transform: translateY(-1px); }
        @media (max-width: 768px) {
          .lg-nav { padding: 0 20px; }
          .lg-nav-link { display: none; }
        }

        /* Card */
        .lg-card {
          background: #111827;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 24px;
          padding: 44px 40px;
          width: 100%; max-width: 480px;
          position: relative; z-index: 2;
          animation: lgFadeUp 0.5s ease both;
          box-shadow: 0 24px 64px rgba(0,0,0,0.4);
        }
        @keyframes lgFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Header */
        .lg-header { text-align: center; margin-bottom: 32px; }
        .lg-icon-wrap {
          width: 60px; height: 60px; border-radius: 16px;
          background: linear-gradient(135deg,#a855f7,#ec4899);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 16px;
          box-shadow: 0 8px 24px rgba(168,85,247,0.4);
        }
        .lg-title {
          font-size: 1.8rem; font-weight: 900;
          color: #ffffff; letter-spacing: -0.03em; margin-bottom: 6px;
        }
        .lg-subtitle { font-size: 0.9rem; color: rgba(255,255,255,0.4); font-weight: 500; }

        /* Error */
        .lg-error {
          background: rgba(239,68,68,0.12);
          border: 1px solid rgba(239,68,68,0.3);
          color: #f87171;
          padding: 12px 16px; border-radius: 10px;
          font-size: 0.875rem; margin-bottom: 20px; font-weight: 600;
        }

        /* Fields */
        .lg-field { margin-bottom: 18px; }
        .lg-label {
          display: block; font-size: 0.78rem; font-weight: 700;
          color: rgba(255,255,255,0.45);
          text-transform: uppercase; letter-spacing: 0.1em;
          margin-bottom: 8px;
        }
        .lg-input {
          width: 100%; padding: 13px 16px;
          background: #1e293b;
          border: 1.5px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          color: #ffffff; font-size: 0.95rem; font-weight: 500;
          font-family: 'Inter', sans-serif;
          outline: none; transition: all 0.2s;
        }
        .lg-input::placeholder { color: rgba(255,255,255,0.2); }
        .lg-input:focus {
          border-color: rgba(168,85,247,0.6);
          background: rgba(168,85,247,0.06);
          box-shadow: 0 0 0 3px rgba(168,85,247,0.12);
        }

        .lg-row {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 24px;
        }
        .lg-remember {
          display: flex; align-items: center; gap: 8px;
          font-size: 0.875rem; color: rgba(255,255,255,0.4); font-weight: 500;
        }
        .lg-checkbox { width: 16px; height: 16px; accent-color: #a855f7; cursor: pointer; }
        .lg-forgot {
          font-size: 0.875rem; font-weight: 700;
          color: #a855f7; text-decoration: none; transition: color 0.15s;
        }
        .lg-forgot:hover { color: #ec4899; }

        /* Submit */
        .lg-submit {
          width: 100%; padding: 15px;
          background: linear-gradient(135deg,#a855f7,#ec4899);
          color: white; font-size: 1rem; font-weight: 800;
          border: none; border-radius: 14px; cursor: pointer;
          transition: all 0.25s; font-family: 'Inter', sans-serif;
          box-shadow: 0 8px 24px rgba(168,85,247,0.4);
          letter-spacing: -0.01em; margin-bottom: 28px;
        }
        .lg-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 14px 36px rgba(168,85,247,0.55);
          opacity: 0.92;
        }
        .lg-submit:disabled { opacity: 0.5; cursor: not-allowed; }

        .lg-spinner { display: inline-flex; align-items: center; gap: 10px; }
        .lg-spin {
          width: 18px; height: 18px; border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: white;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Divider */
        .lg-divider {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 16px;
        }
        .lg-divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.08); }
        .lg-divider-text { font-size: 0.78rem; color: rgba(255,255,255,0.3); font-weight: 600; white-space: nowrap; }

        /* Demo credentials */
        .lg-demo {
          background: rgba(168,85,247,0.08);
          border: 1px solid rgba(168,85,247,0.2);
          border-radius: 12px; padding: 16px;
          margin-bottom: 24px;
        }
        .lg-demo-title {
          font-size: 0.78rem; font-weight: 800; color: #a855f7;
          text-transform: uppercase; letter-spacing: 0.08em;
          margin-bottom: 10px;
        }
        .lg-demo-row {
          font-size: 0.82rem; color: rgba(255,255,255,0.5); font-weight: 500;
          margin-bottom: 4px; display: flex; gap: 6px;
        }
        .lg-demo-row:last-child { margin-bottom: 0; }
        .lg-demo-row strong { color: #a855f7; font-weight: 800; min-width: 70px; }

        /* Sign up */
        .lg-signup {
          text-align: center;
          font-size: 0.875rem; color: rgba(255,255,255,0.35); font-weight: 500;
        }
        .lg-signup a { color: #a855f7; font-weight: 700; text-decoration: none; }
        .lg-signup a:hover { color: #ec4899; }

        @media (max-width: 560px) {
          .lg-card { padding: 32px 20px; }
        }
      `}</style>

      <div className="lg-page">
        <nav className="lg-nav">
          <Link to="/" className="lg-nav-logo">
            <div className="lg-nav-logo-mark">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            Study Buddy
          </Link>
          <div className="lg-nav-links">
            <Link to="/" className="lg-nav-link">Home</Link>
            <Link to="/register" className="lg-nav-btn-signup">Sign Up Free</Link>
          </div>
        </nav>

        <div className="lg-card">
          <div className="lg-header">
            <div className="lg-icon-wrap">
              <svg width="28" height="28" fill="none" stroke="white" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="lg-title">Welcome Back!</h2>
            <p className="lg-subtitle">Sign in to continue your learning journey</p>
          </div>

          {error && <div className="lg-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="lg-field">
              <label htmlFor="email" className="lg-label">Email Address</label>
              <input id="email" name="email" type="email" required
                value={formData.email} onChange={handleChange}
                className="lg-input" placeholder="you@example.com" />
            </div>

            <div className="lg-field">
              <label htmlFor="password" className="lg-label">Password</label>
              <input id="password" name="password" type="password" required
                value={formData.password} onChange={handleChange}
                className="lg-input" placeholder="••••••••" />
            </div>

            <div className="lg-row">
              <label className="lg-remember">
                <input type="checkbox" className="lg-checkbox" />
                Remember me
              </label>
              <a href="#" className="lg-forgot">Forgot password?</a>
            </div>

            <button type="submit" disabled={loading} className="lg-submit">
              {loading ? (
                <span className="lg-spinner">
                  <span className="lg-spin" />
                  Signing in...
                </span>
              ) : 'Sign In →'}
            </button>
          </form>

          <div className="lg-divider">
            <div className="lg-divider-line" />
            <span className="lg-divider-text">Demo Credentials</span>
            <div className="lg-divider-line" />
          </div>

          <div className="lg-demo">
            <div className="lg-demo-title">🔑 Try these accounts</div>
            <div className="lg-demo-row"><strong>Admin:</strong> admin@demo.com / password</div>
            <div className="lg-demo-row"><strong>Educator:</strong> educator@demo.com / password</div>
            <div className="lg-demo-row"><strong>Student:</strong> student@demo.com / password</div>
          </div>

          <p className="lg-signup">
            Don't have an account? <Link to="/register">Sign up for free</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;