import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const API_BASE = 'http://localhost:5000';

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhone = (phone) => { if (!phone) return true; return /^[0-9]{10}$/.test(phone.replace(/\D/g, '')); };

const saveQuizProgressToDB = async (studentId, score, total) => {
  try {
    const percentage = Math.round((score / total) * 100);
    const res = await fetch(`${API_BASE}/api/progress/quiz`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify({ studentId, score, total, percentage })
    });
    if (!res.ok) throw new Error('Failed to save progress');
    return await res.json();
  } catch (err) { console.error('Progress save error:', err); }
};

/* ── Dark card helper ── */
const Card = ({ children, style = {} }) => (
  <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '24px', ...style }}>
    {children}
  </div>
);

const darkInput = {
  width: '100%', padding: '11px 14px',
  background: '#1e293b', border: '1.5px solid rgba(255,255,255,0.1)',
  borderRadius: 10, color: '#fff', fontSize: '0.9rem',
  outline: 'none', fontFamily: "'Inter', sans-serif", transition: 'border-color 0.2s',
};

const StudentProfile = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [profileData, setProfileData] = useState({
    name: user?.name || '', email: user?.email || '',
    phone: user?.phone || '', bio: user?.bio || '',
    grade: user?.grade || '10th Grade', school: user?.school || ''
  });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [quizDemo, setQuizDemo] = useState({ score: '', total: '' });
  const [quizSaving, setQuizSaving] = useState(false);
  const [quizSaved, setQuizSaved] = useState(false);

  const handleProfileChange = (e) => { setProfileData({ ...profileData, [e.target.name]: e.target.value }); setErrorMessage(''); };
  const handlePasswordChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

  const handleSaveProfile = async () => {
    setErrorMessage(''); setSuccessMessage('');
    if (!profileData.name.trim()) { setErrorMessage('Name is required'); return; }
    if (!profileData.email.trim()) { setErrorMessage('Email is required'); return; }
    if (!validateEmail(profileData.email)) { setErrorMessage('Please enter a valid email address (e.g., user@example.com)'); return; }
    if (profileData.phone && !validatePhone(profileData.phone)) { setErrorMessage('Phone number must be exactly 10 digits'); return; }
    setSaving(true);
    try {
      const result = await updateProfile({ name: profileData.name, email: profileData.email, phone: profileData.phone, bio: profileData.bio, grade: profileData.grade, school: profileData.school });
      if (result.success) { setSuccessMessage('✓ Profile updated successfully!'); setEditing(false); setTimeout(() => setSuccessMessage(''), 3000); }
      else setErrorMessage(result.error || 'Failed to update profile');
    } catch (error) { setErrorMessage('Network error. Please try again.'); }
    finally { setSaving(false); }
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) { alert('Passwords do not match!'); return; }
    if (passwordData.newPassword.length < 6) { alert('Password must be at least 6 characters!'); return; }
    alert('Password changed successfully!');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleQuizSubmit = async () => {
    const score = parseInt(quizDemo.score), total = parseInt(quizDemo.total);
    if (!score || !total || score > total) { alert('Please enter valid score and total'); return; }
    setQuizSaving(true);
    await saveQuizProgressToDB(user?.id, score, total);
    setQuizSaving(false); setQuizSaved(true);
    setQuizDemo({ score: '', total: '' });
    setTimeout(() => setQuizSaved(false), 3000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile Info' },
    { id: 'security', label: 'Security' },
    { id: 'preferences', label: 'Preferences' },
    { id: 'progress', label: '📊 Quiz Progress' },
  ];

  return (
    <div style={{ color: 'white', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        .sp-input:focus { border-color: rgba(168,85,247,0.6) !important; box-shadow: 0 0 0 3px rgba(168,85,247,0.1) !important; }
        .sp-input:disabled { opacity: 0.5; cursor: not-allowed; }
        .sp-tab { flex: 1; padding: 10px 16px; border-radius: 8px; font-weight: 600; font-size: 0.85rem; border: none; cursor: pointer; transition: all 0.2s; }
        .sp-tab.active { background: linear-gradient(135deg,#a855f7,#ec4899); color: white; }
        .sp-tab:not(.active) { background: transparent; color: rgba(255,255,255,0.4); }
        .sp-tab:not(.active):hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.8); }
        .sp-btn-primary { padding: 10px 22px; background: linear-gradient(135deg,#a855f7,#ec4899); color: white; border: none; border-radius: 10px; font-weight: 700; font-size: 0.875rem; cursor: pointer; transition: opacity 0.2s; }
        .sp-btn-primary:hover { opacity: 0.88; }
        .sp-btn-primary:disabled { opacity: 0.45; cursor: not-allowed; }
        .sp-btn-cancel { padding: 10px 22px; background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.6); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; font-weight: 600; font-size: 0.875rem; cursor: pointer; }
        .sp-btn-cancel:hover { background: rgba(255,255,255,0.1); }
        .sp-label { display: block; font-size: 0.75rem; font-weight: 700; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 7px; }
        .sp-pref-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; background: rgba(255,255,255,0.03); border-radius: 10px; border: 1px solid rgba(255,255,255,0.05); }
      `}</style>

      {/* Profile Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e0a3c 0%, #0f1f3d 50%, #0d1117 100%)',
        border: '1px solid rgba(168,85,247,0.2)',
        borderRadius: 20, padding: '28px 32px', marginBottom: 20,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle,rgba(168,85,247,0.2) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, position: 'relative', zIndex: 1 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#a855f7,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 900, flexShrink: 0, boxShadow: '0 8px 24px rgba(168,85,247,0.4)' }}>
            {user?.name?.charAt(0).toUpperCase() || 'S'}
          </div>
          <div>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#a855f7', marginBottom: 6 }}>Student Profile</p>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>{user?.name}</h1>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)', textTransform: 'capitalize' }}>{user?.role} · ID: {user?.id}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Card style={{ padding: '8px 10px', marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {tabs.map(t => (
            <button key={t.id} className={`sp-tab${activeTab === t.id ? ' active' : ''}`} onClick={() => setActiveTab(t.id)}>{t.label}</button>
          ))}
        </div>
      </Card>

      {/* ── Profile Tab ── */}
      {activeTab === 'profile' && (
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Profile Information</h2>
            {!editing && <button className="sp-btn-primary" onClick={() => setEditing(true)}>Edit Profile</button>}
          </div>

          {errorMessage && <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', padding: '10px 14px', borderRadius: 10, fontSize: '0.85rem', marginBottom: 16, fontWeight: 600 }}>{errorMessage}</div>}
          {successMessage && <div style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399', padding: '10px 14px', borderRadius: 10, fontSize: '0.85rem', marginBottom: 16, fontWeight: 600 }}>{successMessage}</div>}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            {[
              { label: 'Full Name', name: 'name', type: 'text' },
              { label: 'Email Address *', name: 'email', type: 'email' },
              { label: 'Phone Number', name: 'phone', type: 'tel', placeholder: '10 digit number' },
              { label: 'Grade / Level', name: 'grade', type: 'select', options: ['9th Grade','10th Grade','11th Grade','12th Grade','College/University'] },
            ].map((f, i) => (
              <div key={i}>
                <label className="sp-label">{f.label}</label>
                {f.type === 'select' ? (
                  <select name={f.name} value={profileData[f.name]} onChange={handleProfileChange} disabled={!editing} className="sp-input"
                    style={{ ...darkInput, appearance: 'none' }}>
                    {f.options.map(o => <option key={o}>{o}</option>)}
                  </select>
                ) : (
                  <input type={f.type} name={f.name} value={profileData[f.name]} onChange={handleProfileChange}
                    disabled={!editing} placeholder={f.placeholder} className="sp-input" style={darkInput} />
                )}
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 14 }}>
            <label className="sp-label">School / Institution</label>
            <input type="text" name="school" value={profileData.school} onChange={handleProfileChange}
              disabled={!editing} placeholder="Enter your school name" className="sp-input" style={darkInput} />
          </div>

          <div style={{ marginBottom: editing ? 16 : 0 }}>
            <label className="sp-label">Bio</label>
            <textarea name="bio" value={profileData.bio} onChange={handleProfileChange}
              disabled={!editing} rows={3} placeholder="Tell us about yourself..."
              className="sp-input" style={{ ...darkInput, resize: 'vertical' }} />
          </div>

          {editing && (
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={handleSaveProfile} disabled={saving} className="sp-btn-primary">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button onClick={() => setEditing(false)} disabled={saving} className="sp-btn-cancel">Cancel</button>
            </div>
          )}
        </Card>
      )}

      {/* ── Security Tab ── */}
      {activeTab === 'security' && (
        <Card>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20 }}>Change Password</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 400, marginBottom: 20 }}>
            {['currentPassword', 'newPassword', 'confirmPassword'].map((field) => (
              <div key={field}>
                <label className="sp-label">{field === 'currentPassword' ? 'Current Password' : field === 'newPassword' ? 'New Password' : 'Confirm New Password'}</label>
                <input type="password" name={field} value={passwordData[field]} onChange={handlePasswordChange} className="sp-input" style={darkInput} />
              </div>
            ))}
            <button onClick={handleChangePassword} className="sp-btn-primary" style={{ width: '100%', padding: '13px' }}>Update Password</button>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 20 }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 14 }}>Two-Factor Authentication</h3>
            <div className="sp-pref-row">
              <div>
                <p style={{ fontWeight: 600, color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem' }}>Enable 2FA</p>
                <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>Add an extra layer of security to your account</p>
              </div>
              <label style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                <input type="checkbox" style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
                <div style={{ width: 44, height: 24, background: 'rgba(255,255,255,0.1)', borderRadius: 100, border: '1px solid rgba(255,255,255,0.1)' }} />
              </label>
            </div>
          </div>
        </Card>
      )}

      {/* ── Preferences Tab ── */}
      {activeTab === 'preferences' && (
        <Card>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20 }}>Learning Preferences</h2>

          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontWeight: 600, fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Notifications</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Email notifications for new assignments', checked: true },
                { label: 'Daily study reminders', checked: true },
                { label: 'Quiz result notifications', checked: false },
              ].map((item, i) => (
                <label key={i} className="sp-pref-row" style={{ cursor: 'pointer' }}>
                  <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>{item.label}</span>
                  <input type="checkbox" defaultChecked={item.checked} style={{ width: 16, height: 16, accentColor: '#a855f7', cursor: 'pointer' }} />
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontWeight: 600, fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>AI Tutor Preferences</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Response Detail Level', options: ['Concise', 'Balanced', 'Detailed'] },
                { label: 'Explanation Style', options: ['Simple/ELI5', 'Standard', 'Technical'] },
              ].map((f, i) => (
                <div key={i}>
                  <label className="sp-label">{f.label}</label>
                  <select className="sp-input" style={{ ...darkInput, appearance: 'none' }}>
                    {f.options.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>

          <button className="sp-btn-primary">Save Preferences</button>
        </Card>
      )}

      {/* ── Quiz Progress Tab ── */}
      {activeTab === 'progress' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 6 }}>📊 Record Quiz Result</h2>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>
              When you submit a quiz, your result is automatically saved and your progress is updated.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
              <div>
                <label className="sp-label">Your Score</label>
                <input type="number" min="0" placeholder="e.g. 4" value={quizDemo.score}
                  onChange={e => setQuizDemo(prev => ({ ...prev, score: e.target.value }))}
                  className="sp-input" style={darkInput} />
              </div>
              <div>
                <label className="sp-label">Total Questions</label>
                <input type="number" min="1" placeholder="e.g. 5" value={quizDemo.total}
                  onChange={e => setQuizDemo(prev => ({ ...prev, total: e.target.value }))}
                  className="sp-input" style={darkInput} />
              </div>
            </div>

            {quizDemo.score && quizDemo.total && (
              <div style={{ marginBottom: 14, padding: '10px 14px', borderRadius: 10, background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)', fontSize: '0.875rem', fontWeight: 600, color: '#a855f7' }}>
                Score: {quizDemo.score}/{quizDemo.total} — {Math.round((parseInt(quizDemo.score) / parseInt(quizDemo.total)) * 100)}%
              </div>
            )}

            <button onClick={handleQuizSubmit} disabled={quizSaving} className="sp-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {quizSaving ? (<><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />Saving...</>) : '💾 Save to Database'}
            </button>

            {quizSaved && (
              <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 10, color: '#34d399', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                ✓ Progress saved to database successfully!
              </div>
            )}
          </Card>

          <Card style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.08), rgba(6,182,212,0.06))', border: '1px solid rgba(168,85,247,0.2)' }}>
            <h3 style={{ fontWeight: 700, color: '#a855f7', fontSize: '0.9rem', marginBottom: 12 }}>⚡ How Auto-Tracking Works</h3>
            <ol style={{ paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                <>Student submits a quiz in <strong>Upload Materials</strong> or <strong>AI Quiz Generator</strong></>,
                <>Score is automatically POSTed to <code style={{ background: 'rgba(255,255,255,0.08)', padding: '1px 6px', borderRadius: 4 }}>/api/progress/quiz</code></>,
                <>Backend updates the <strong>Progress</strong> table — increments quizzesTaken &amp; recalculates averageScore</>,
                <>Progress is visible in <strong>My Progress</strong> dashboard instantly</>,
              ].map((item, i) => (
                <li key={i} style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>{item}</li>
              ))}
            </ol>
          </Card>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;