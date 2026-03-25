import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const result = await register(formData);
      if (result.success) {
        navigate('/login');
      } else {
        setError(result.error || 'Registration failed. Please try again.');
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

  const roles = [
    {
      value: 'student',
      label: 'Student',
      description: 'Access personalized learning and AI tutoring',
      icon: (
        <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      value: 'educator',
      label: 'Educator',
      description: 'Create content and manage student progress',
      icon: (
        <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },

  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* Hide global purple navbar on this page */
        nav:not(.rg-nav) { display: none !important; }

        .rg-page {
          font-family: 'Nunito', sans-serif;
          min-height: 100vh;
          background: #F7F8FA;
          display: flex; align-items: center; justify-content: center;
          padding: 100px 20px 40px;
          position: relative; overflow: hidden;
        }

        /* Soft background blobs */
        .rg-page::before {
          content: '';
          position: fixed; inset: 0;
          background:
            radial-gradient(ellipse 600px 500px at 10% 20%, rgba(26,122,110,0.06) 0%, transparent 70%),
            radial-gradient(ellipse 500px 400px at 90% 80%, rgba(26,122,110,0.05) 0%, transparent 70%);
          pointer-events: none; z-index: 0;
        }

        /* ── NAVBAR ── */
        .rg-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 999;
          height: 68px;
          background: rgba(255,255,255,0.96);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid #e8f5f0;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 80px;
          box-shadow: 0 2px 16px rgba(26,122,110,0.06);
        }
        .rg-nav-logo {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none; font-size: 1.1rem; font-weight: 800;
          color: #1a7a6e; letter-spacing: -0.02em;
        }
        .rg-nav-logo-mark {
          width: 36px; height: 36px; border-radius: 10px;
          background: #1a7a6e;
          display: flex; align-items: center; justify-content: center;
          color: white; flex-shrink: 0;
        }
        .rg-nav-links { display: flex; align-items: center; gap: 6px; }
        .rg-nav-link {
          padding: 8px 18px; border-radius: 100px;
          font-size: 0.875rem; font-weight: 600; color: #6b7280;
          text-decoration: none; transition: all 0.18s;
        }
        .rg-nav-link:hover { background: #f0faf8; color: #1a7a6e; }
        .rg-nav-btn-login {
          padding: 9px 22px; border-radius: 100px;
          font-size: 0.875rem; font-weight: 700;
          color: #1a7a6e; text-decoration: none;
          border: 2px solid #1a7a6e; transition: all 0.2s;
        }
        .rg-nav-btn-login:hover { background: #1a7a6e; color: white; }
        @media (max-width: 768px) {
          .rg-nav { padding: 0 20px; }
          .rg-nav-link { display: none; }
        }

        /* Card */
        .rg-card {
          background: white;
          border: 1px solid #e8f5f0;
          border-radius: 24px;
          padding: 40px;
          width: 100%; max-width: 640px;
          position: relative; z-index: 2;
          animation: rgFadeUp 0.6s ease both;
          box-shadow: 0 8px 32px rgba(26,122,110,0.08), 0 2px 8px rgba(0,0,0,0.04);
        }
        @keyframes rgFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Header */
        .rg-header { text-align: center; margin-bottom: 32px; }
        .rg-icon-wrap {
          width: 60px; height: 60px; border-radius: 16px;
          background: #1a7a6e;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 16px;
          box-shadow: 0 8px 24px rgba(26,122,110,0.3);
        }
        .rg-title {
          font-size: 1.8rem; font-weight: 900;
          color: #1e1b4b; letter-spacing: -0.03em; margin-bottom: 6px;
        }
        .rg-subtitle { font-size: 0.9rem; color: #6b7280; font-weight: 500; }

        /* Error */
        .rg-error {
          background: rgba(254, 226, 226, 0.8);
          border: 1px solid rgba(252, 165, 165, 0.6);
          color: #dc2626;
          padding: 12px 16px; border-radius: 10px;
          font-size: 0.875rem; margin-bottom: 20px; font-weight: 600;
        }

        /* Role cards */
        .rg-roles-label {
          font-size: 0.82rem; font-weight: 700;
          color: #6b7280;
          text-transform: uppercase; letter-spacing: 0.08em;
          margin-bottom: 12px; display: block;
        }
        .rg-roles-grid {
          display: grid; grid-template-columns: repeat(2, 1fr);
          gap: 12px; margin-bottom: 24px;
        }
        .rg-role-card {
          border: 1.5px solid #e5e7eb;
          border-radius: 14px; padding: 16px 12px;
          text-align: center; cursor: pointer;
          transition: all 0.2s;
          background: rgba(255,255,255,0.6);
        }
        .rg-role-card:hover {
          border-color: #1a7a6e;
          background: rgba(26,122,110,0.05);
          transform: translateY(-2px);
          box-shadow: 0 4px 14px rgba(102,126,234,0.15);
        }
        .rg-role-card.active {
          border-color: #1a7a6e;
          background: rgba(26,122,110,0.08);
          box-shadow: 0 0 0 3px rgba(26,122,110,0.15);
          transform: translateY(-2px);
        }
        .rg-role-icon {
          display: flex; justify-content: center; margin-bottom: 8px;
          color: #9ca3af; transition: color 0.2s;
        }
        .rg-role-card:hover .rg-role-icon,
        .rg-role-card.active .rg-role-icon { color: #1a7a6e; }
        .rg-role-name {
          font-size: 0.875rem; font-weight: 800; color: #1e1b4b; margin-bottom: 4px;
        }
        .rg-role-desc {
          font-size: 0.72rem; color: #9ca3af; line-height: 1.4; font-weight: 500;
        }

        /* Form fields */
        .rg-field { margin-bottom: 18px; }
        .rg-label {
          display: block; font-size: 0.82rem; font-weight: 700;
          color: #4b5563;
          text-transform: uppercase; letter-spacing: 0.07em;
          margin-bottom: 8px;
        }
        .rg-input {
          width: 100%; padding: 13px 16px;
          background: rgba(255,255,255,0.8);
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          color: #1e1b4b; font-size: 0.95rem; font-weight: 500;
          font-family: 'Nunito', sans-serif;
          outline: none; transition: all 0.2s;
        }
        .rg-input::placeholder { color: #d1d5db; }
        .rg-input:focus {
          border-color: #1a7a6e;
          background: rgba(26,122,110,0.04);
          box-shadow: 0 0 0 3px rgba(26,122,110,0.1);
        }

        .rg-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

        /* Checkbox */
        .rg-check-row {
          display: flex; align-items: center; gap: 10px; margin-bottom: 24px;
        }
        .rg-checkbox {
          width: 18px; height: 18px; border-radius: 5px;
          accent-color: #667eea; cursor: pointer; flex-shrink: 0;
        }
        .rg-check-label { font-size: 0.875rem; color: #6b7280; font-weight: 500; }
        .rg-check-label a { color: #1a7a6e; text-decoration: none; font-weight: 700; }
        .rg-check-label a:hover { color: #155f55; }

        /* Submit */
        .rg-submit {
          width: 100%; padding: 15px;
          background: #1a7a6e;
          color: white; font-size: 1rem; font-weight: 800;
          border: none; border-radius: 14px; cursor: pointer;
          transition: all 0.25s; font-family: 'Nunito', sans-serif;
          box-shadow: 0 8px 24px rgba(26,122,110,0.3);
          letter-spacing: -0.01em;
        }
        .rg-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(26,122,110,0.45); background: #155f55;
        }
        .rg-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        .rg-spinner { display: inline-flex; align-items: center; gap: 10px; }
        .rg-spin {
          width: 18px; height: 18px; border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: white;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Sign in */
        .rg-signin {
          text-align: center; margin-top: 20px;
          font-size: 0.875rem; color: #9ca3af; font-weight: 500;
        }
        .rg-signin a { color: #1a7a6e; font-weight: 700; text-decoration: none; }
        .rg-signin a:hover { color: #155f55; }

        @media (max-width: 560px) {
          .rg-card { padding: 28px 20px; }
          .rg-roles-grid { grid-template-columns: 1fr; }
          .rg-two-col { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="rg-page">

        {/* Teal Navbar */}
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
            <p className="rg-subtitle">Join StudyBuddy and start your learning journey</p>
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

          <p className="rg-signin">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>

        </div>
      </div>
    </>
  );
};

export default Register;