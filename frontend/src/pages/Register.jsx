import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signInWithGoogle, signInWithGitHub } from '../firebase';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, socialLogin } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true); setError('');
    try {
      const result = await signInWithGoogle();
      const user = result.user;
      await socialLogin({ id: user.uid, name: user.displayName, email: user.email, role: formData.role });
      navigate(`/${formData.role}`);
    } catch (err) {
      setError(err.message || 'Google authentication failed');
    } finally { setLoading(false); }
  };

  const handleGitHubLogin = async () => {
    setLoading(true); setError('');
    try {
      const result = await signInWithGitHub();
      const user = result.user;
      await socialLogin({ id: user.uid, name: user.displayName, email: user.email, role: formData.role });
      navigate(`/${formData.role}`);
    } catch (err) {
      setError(err.message || 'GitHub authentication failed');
    } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return; }
    if (formData.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const result = await register(formData);
      if (result.success) navigate('/login');
      else setError(result.error || 'Registration failed. Please try again.');
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally { setLoading(false); }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const roles = [
    {
      value: 'student', label: 'Student',
      description: 'Access personalized learning and AI tutoring',
      icon: (<svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>)
    },
    {
      value: 'educator', label: 'Educator',
      description: 'Create content and manage student progress',
      icon: (<svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>)
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        nav:not(.rg-nav) { display: none !important; }

        .rg-page {
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
          background: #0d1117;
          display: flex; align-items: center; justify-content: center;
          padding: 100px 20px 40px;
          position: relative; overflow: hidden;
        }
        .rg-page::before {
          content: '';
          position: fixed; inset: 0;
          background:
            radial-gradient(ellipse 700px 600px at 10% 20%, rgba(168,85,247,0.08) 0%, transparent 70%),
            radial-gradient(ellipse 600px 500px at 90% 80%, rgba(6,182,212,0.06) 0%, transparent 70%);
          pointer-events: none; z-index: 0;
        }

        .rg-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 999;
          height: 64px;
          background: rgba(13,27,46,0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 80px;
        }
        .rg-nav-logo {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none; font-size: 1.1rem; font-weight: 800;
          color: white; letter-spacing: -0.02em;
        }
        .rg-nav-logo-mark {
          width: 36px; height: 36px; border-radius: 10px;
          background: linear-gradient(135deg,#a855f7,#ec4899);
          display: flex; align-items: center; justify-content: center;
          color: white; flex-shrink: 0;
        }
        .rg-nav-links { display: flex; align-items: center; gap: 6px; }
        .rg-nav-link {
          padding: 8px 18px; border-radius: 100px;
          font-size: 0.875rem; font-weight: 600; color: rgba(255,255,255,0.5);
          text-decoration: none; transition: all 0.18s;
        }
        .rg-nav-link:hover { background: rgba(255,255,255,0.06); color: white; }
        .rg-nav-btn-login {
          padding: 9px 22px; border-radius: 100px;
          font-size: 0.875rem; font-weight: 700;
          color: white; text-decoration: none;
          border: 1.5px solid rgba(168,85,247,0.5); transition: all 0.2s;
        }
        .rg-nav-btn-login:hover { background: rgba(168,85,247,0.15); border-color: #a855f7; }
        @media (max-width: 768px) {
          .rg-nav { padding: 0 20px; }
          .rg-nav-link { display: none; }
        }

        .rg-card {
          background: #111827;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 24px;
          padding: 40px;
          width: 100%; max-width: 640px;
          position: relative; z-index: 2;
          animation: rgFadeUp 0.5s ease both;
          box-shadow: 0 24px 64px rgba(0,0,0,0.4);
        }
        @keyframes rgFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .rg-header { text-align: center; margin-bottom: 32px; }
        .rg-icon-wrap {
          width: 60px; height: 60px; border-radius: 16px;
          background: linear-gradient(135deg,#a855f7,#ec4899);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 16px;
          box-shadow: 0 8px 24px rgba(168,85,247,0.4);
        }
        .rg-title {
          font-size: 1.8rem; font-weight: 900;
          color: #ffffff; letter-spacing: -0.03em; margin-bottom: 6px;
        }
        .rg-subtitle { font-size: 0.9rem; color: rgba(255,255,255,0.4); font-weight: 500; }

        .rg-error {
          background: rgba(239,68,68,0.12);
          border: 1px solid rgba(239,68,68,0.3);
          color: #f87171;
          padding: 12px 16px; border-radius: 10px;
          font-size: 0.875rem; margin-bottom: 20px; font-weight: 600;
        }

        .rg-roles-label {
          font-size: 0.78rem; font-weight: 700;
          color: rgba(255,255,255,0.35);
          text-transform: uppercase; letter-spacing: 0.1em;
          margin-bottom: 12px; display: block;
        }
        .rg-roles-grid {
          display: grid; grid-template-columns: repeat(2, 1fr);
          gap: 12px; margin-bottom: 24px;
        }
        .rg-role-card {
          border: 1.5px solid rgba(255,255,255,0.08);
          border-radius: 14px; padding: 16px 12px;
          text-align: center; cursor: pointer;
          transition: all 0.2s;
          background: rgba(255,255,255,0.03);
        }
        .rg-role-card:hover {
          border-color: rgba(168,85,247,0.4);
          background: rgba(168,85,247,0.06);
          transform: translateY(-2px);
        }
        .rg-role-card.active {
          border-color: #a855f7;
          background: rgba(168,85,247,0.1);
          box-shadow: 0 0 0 3px rgba(168,85,247,0.15);
          transform: translateY(-2px);
        }
        .rg-role-icon {
          display: flex; justify-content: center; margin-bottom: 8px;
          color: rgba(255,255,255,0.25); transition: color 0.2s;
        }
        .rg-role-card:hover .rg-role-icon,
        .rg-role-card.active .rg-role-icon { color: #a855f7; }
        .rg-role-name {
          font-size: 0.875rem; font-weight: 800; color: white; margin-bottom: 4px;
        }
        .rg-role-desc {
          font-size: 0.72rem; color: rgba(255,255,255,0.35); line-height: 1.4; font-weight: 500;
        }

        .rg-field { margin-bottom: 18px; }
        .rg-label {
          display: block; font-size: 0.78rem; font-weight: 700;
          color: rgba(255,255,255,0.4);
          text-transform: uppercase; letter-spacing: 0.1em;
          margin-bottom: 8px;
        }
        .rg-input {
          width: 100%; padding: 13px 16px;
          background: #1e293b;
          border: 1.5px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          color: #ffffff; font-size: 0.95rem; font-weight: 500;
          font-family: 'Inter', sans-serif;
          outline: none; transition: all 0.2s;
        }
        .rg-input::placeholder { color: rgba(255,255,255,0.2); }
        .rg-input:focus {
          border-color: rgba(168,85,247,0.6);
          background: rgba(168,85,247,0.06);
          box-shadow: 0 0 0 3px rgba(168,85,247,0.12);
        }
        .rg-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

        .rg-check-row {
          display: flex; align-items: center; gap: 10px; margin-bottom: 24px;
        }
        .rg-checkbox {
          width: 18px; height: 18px; border-radius: 5px;
          accent-color: #a855f7; cursor: pointer; flex-shrink: 0;
        }
        .rg-check-label { font-size: 0.875rem; color: rgba(255,255,255,0.4); font-weight: 500; }
        .rg-check-label a { color: #a855f7; text-decoration: none; font-weight: 700; }
        .rg-check-label a:hover { color: #ec4899; }

        .rg-submit {
          width: 100%; padding: 15px;
          background: linear-gradient(135deg,#a855f7,#ec4899);
          color: white; font-size: 1rem; font-weight: 800;
          border: none; border-radius: 14px; cursor: pointer;
          transition: all 0.25s; font-family: 'Inter', sans-serif;
          box-shadow: 0 8px 24px rgba(168,85,247,0.4);
          letter-spacing: -0.01em;
        }
        .rg-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 14px 36px rgba(168,85,247,0.55); opacity: 0.92;
        }
        .rg-submit:disabled { opacity: 0.5; cursor: not-allowed; }

        .rg-spinner { display: inline-flex; align-items: center; gap: 10px; }
        .rg-spin {
          width: 18px; height: 18px; border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: white;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .rg-divider {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 20px; margin-top: 24px;
        }
        .rg-divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.08); }
        .rg-divider-text { font-size: 0.78rem; color: rgba(255,255,255,0.3); font-weight: 600; white-space: nowrap; }

        .rg-social-buttons { display: flex; gap: 12px; margin-bottom: 24px; }
        .rg-social-btn {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 10px;
          padding: 12px; background: #1e293b; border: 1.5px solid rgba(255,255,255,0.1);
          border-radius: 14px; font-size: 0.9rem; font-weight: 700; color: rgba(255,255,255,0.7);
          cursor: pointer; transition: all 0.2s; font-family: 'Inter', sans-serif;
        }
        .rg-social-btn:hover:not(:disabled) {
          border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.06);
          transform: translateY(-1px);
        }
        .rg-social-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .rg-signin {
          text-align: center; margin-top: 20px;
          font-size: 0.875rem; color: rgba(255,255,255,0.35); font-weight: 500;
        }
        .rg-signin a { color: #a855f7; font-weight: 700; text-decoration: none; }
        .rg-signin a:hover { color: #ec4899; }

        @media (max-width: 560px) {
          .rg-card { padding: 28px 20px; }
          .rg-roles-grid { grid-template-columns: 1fr; }
          .rg-two-col { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="rg-page">
        <nav className="rg-nav">
          <Link to="/" className="rg-nav-logo">
            <div className="rg-nav-logo-mark">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            Study Buddy
          </Link>
          <div className="rg-nav-links">
            <Link to="/" className="rg-nav-link">Home</Link>
            <Link to="/login" className="rg-nav-btn-login">Login</Link>
          </div>
        </nav>

        <div className="rg-card">
          <div className="rg-header">
            <div className="rg-icon-wrap">
              <svg width="28" height="28" fill="none" stroke="white" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className="rg-title">Create Your Account</h2>
            <p className="rg-subtitle">Join StudyBuddy and start your AI-powered learning journey</p>
          </div>

          {error && <div className="rg-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <span className="rg-roles-label">Select Your Role</span>
            <div className="rg-roles-grid">
              {roles.map((role) => (
                <div
                  key={role.value}
                  onClick={() => setFormData({ ...formData, role: role.value })}
                  className={`rg-role-card ${formData.role === role.value ? 'active' : ''}`}
                >
                  <div className="rg-role-icon">{role.icon}</div>
                  <div className="rg-role-name">{role.label}</div>
                  <p className="rg-role-desc">{role.description}</p>
                </div>
              ))}
            </div>

            <div className="rg-field">
              <label htmlFor="name" className="rg-label">Full Name</label>
              <input id="name" name="name" type="text" required
                value={formData.name} onChange={handleChange}
                className="rg-input" placeholder="John Doe" />
            </div>

            <div className="rg-field">
              <label htmlFor="email" className="rg-label">Email Address</label>
              <input id="email" name="email" type="email" required
                value={formData.email} onChange={handleChange}
                className="rg-input" placeholder="you@example.com" />
            </div>

            <div className="rg-two-col rg-field">
              <div>
                <label htmlFor="password" className="rg-label">Password</label>
                <input id="password" name="password" type="password" required
                  value={formData.password} onChange={handleChange}
                  className="rg-input" placeholder="••••••••" />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="rg-label">Confirm Password</label>
                <input id="confirmPassword" name="confirmPassword" type="password" required
                  value={formData.confirmPassword} onChange={handleChange}
                  className="rg-input" placeholder="••••••••" />
              </div>
            </div>

            <div className="rg-check-row">
              <input id="terms" name="terms" type="checkbox" required className="rg-checkbox" />
              <label htmlFor="terms" className="rg-check-label">
                I agree to the <a href="#">Terms and Conditions</a>
              </label>
            </div>

            <button type="submit" disabled={loading} className="rg-submit">
              {loading ? (
                <span className="rg-spinner">
                  <span className="rg-spin" />
                  Creating account...
                </span>
              ) : 'Create Account →'}
            </button>
          </form>

          <div className="rg-divider">
            <div className="rg-divider-line" />
            <span className="rg-divider-text">Or continue with</span>
            <div className="rg-divider-line" />
          </div>

          <div className="rg-social-buttons">
            <button type="button" onClick={handleGoogleLogin} className="rg-social-btn" disabled={loading}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button type="button" onClick={handleGitHubLogin} className="rg-social-btn" disabled={loading}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
              GitHub
            </button>
          </div>

          <p className="rg-signin">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;