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
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* Hide global purple navbar */
        nav:not(.lg-nav) { display: none !important; }

        .lg-page {
          font-family: 'Nunito', sans-serif;
          min-height: 100vh;
          background: #F7F8FA;
          display: flex; align-items: center; justify-content: center;
          padding: 100px 20px 40px;
          position: relative; overflow: hidden;
        }

        /* Soft background blobs */
        .lg-page::before {
          content: '';
          position: fixed; inset: 0;
          background:
            radial-gradient(ellipse 600px 500px at 10% 20%, rgba(26,122,110,0.06) 0%, transparent 70%),
            radial-gradient(ellipse 500px 400px at 90% 80%, rgba(26,122,110,0.05) 0%, transparent 70%);
          pointer-events: none; z-index: 0;
        }

        /* ── NAVBAR ── */
        .lg-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 999;
          height: 68px;
          background: rgba(255,255,255,0.96);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid #e8f5f0;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 80px;
          box-shadow: 0 2px 16px rgba(26,122,110,0.06);
        }
        .lg-nav-logo {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none; font-size: 1.1rem; font-weight: 800;
          color: #1a7a6e; letter-spacing: -0.02em;
        }
        .lg-nav-logo-mark {
          width: 36px; height: 36px; border-radius: 10px;
          background: #1a7a6e;
          display: flex; align-items: center; justify-content: center;
          color: white; flex-shrink: 0;
        }
        .lg-nav-links { display: flex; align-items: center; gap: 6px; }
        .lg-nav-link {
          padding: 8px 18px; border-radius: 100px;
          font-size: 0.875rem; font-weight: 600; color: #6b7280;
          text-decoration: none; transition: all 0.18s;
        }
        .lg-nav-link:hover { background: #f0faf8; color: #1a7a6e; }
        .lg-nav-btn-signup {
          padding: 9px 22px; border-radius: 100px;
          font-size: 0.875rem; font-weight: 700;
          background: #1a7a6e; color: white;
          text-decoration: none; transition: all 0.2s;
          box-shadow: 0 4px 14px rgba(26,122,110,0.3);
        }
        .lg-nav-btn-signup:hover { background: #155f55; transform: translateY(-1px); }
        @media (max-width: 768px) {
          .lg-nav { padding: 0 20px; }
          .lg-nav-link { display: none; }
        }

        /* ── CARD ── */
        .lg-card {
          background: white;
          border: 1px solid #e8f5f0;
          border-radius: 24px;
          padding: 44px 40px;
          width: 100%; max-width: 480px;
          position: relative; z-index: 2;
          animation: lgFadeUp 0.6s ease both;
          box-shadow: 0 8px 32px rgba(26,122,110,0.08), 0 2px 8px rgba(0,0,0,0.04);
        }
        @keyframes lgFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Header */
        .lg-header { text-align: center; margin-bottom: 32px; }
        .lg-icon-wrap {
          width: 60px; height: 60px; border-radius: 16px;
          background: #1a7a6e;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 16px;
          box-shadow: 0 8px 24px rgba(26,122,110,0.3);
        }
        .lg-title {
          font-size: 1.8rem; font-weight: 900;
          color: #0D1117; letter-spacing: -0.03em; margin-bottom: 6px;
        }
        .lg-subtitle { font-size: 0.9rem; color: #6b7280; font-weight: 500; }

        /* Error */
        .lg-error {
          background: rgba(254,226,226,0.8);
          border: 1px solid rgba(252,165,165,0.6);
          color: #dc2626;
          padding: 12px 16px; border-radius: 10px;
          font-size: 0.875rem; margin-bottom: 20px; font-weight: 600;
        }

        /* Fields */
        .lg-field { margin-bottom: 18px; }
        .lg-label {
          display: block; font-size: 0.82rem; font-weight: 700;
          color: #4b5563;
          text-transform: uppercase; letter-spacing: 0.07em;
          margin-bottom: 8px;
        }
        .lg-input {
          width: 100%; padding: 13px 16px;
          background: white;
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          color: #0D1117; font-size: 0.95rem; font-weight: 500;
          font-family: 'Nunito', sans-serif;
          outline: none; transition: all 0.2s;
        }
        .lg-input::placeholder { color: #d1d5db; }
        .lg-input:focus {
          border-color: #1a7a6e;
          background: rgba(26,122,110,0.04);
          box-shadow: 0 0 0 3px rgba(26,122,110,0.1);
        }

        /* Remember / Forgot row */
        .lg-row {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 24px;
        }
        .lg-remember {
          display: flex; align-items: center; gap: 8px;
          font-size: 0.875rem; color: #6b7280; font-weight: 500;
        }
        .lg-checkbox {
          width: 16px; height: 16px; accent-color: #1a7a6e; cursor: pointer;
        }
        .lg-forgot {
          font-size: 0.875rem; font-weight: 700;
          color: #1a7a6e; text-decoration: none; transition: color 0.15s;
        }
        .lg-forgot:hover { color: #155f55; }

        /* Submit */
        .lg-submit {
          width: 100%; padding: 15px;
          background: #1a7a6e;
          color: white; font-size: 1rem; font-weight: 800;
          border: none; border-radius: 14px; cursor: pointer;
          transition: all 0.25s; font-family: 'Nunito', sans-serif;
          box-shadow: 0 8px 24px rgba(26,122,110,0.3);
          letter-spacing: -0.01em; margin-bottom: 28px;
        }
        .lg-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(26,122,110,0.45);
          background: #155f55;
        }
        .lg-submit:disabled { opacity: 0.6; cursor: not-allowed; }

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
        .lg-divider-line { flex: 1; height: 1px; background: #e5e7eb; }
        .lg-divider-text { font-size: 0.78rem; color: #9ca3af; font-weight: 600; white-space: nowrap; }

        /* Demo credentials */
        .lg-demo {
          background: #f0faf8; border: 1px solid #d1faf4;
          border-radius: 12px; padding: 16px;
          margin-bottom: 24px;
        }
        .lg-demo-title {
          font-size: 0.78rem; font-weight: 800; color: #1a7a6e;
          text-transform: uppercase; letter-spacing: 0.08em;
          margin-bottom: 10px;
        }
        .lg-demo-row {
          font-size: 0.82rem; color: #4b5563; font-weight: 500;
          margin-bottom: 4px; display: flex; gap: 6px;
        }
        .lg-demo-row:last-child { margin-bottom: 0; }
        .lg-demo-row strong { color: #1a7a6e; font-weight: 800; min-width: 70px; }

        /* Sign up */
        .lg-signup {
          text-align: center;
          font-size: 0.875rem; color: #9ca3af; font-weight: 500;
        }
        .lg-signup a { color: #1a7a6e; font-weight: 700; text-decoration: none; }
        .lg-signup a:hover { color: #155f55; }

        @media (max-width: 560px) {
          .lg-card { padding: 32px 20px; }
        }
      `}</style>

      <div className="lg-page">

        {/* Navbar */}
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

        {/* Card */}
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

          {/* Demo credentials */}
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