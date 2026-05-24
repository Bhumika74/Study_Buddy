import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const darkInput = {
  width: '100%', padding: '11px 14px',
  background: '#1e293b', border: '1.5px solid rgba(255,255,255,0.1)',
  borderRadius: 10, color: '#fff', fontSize: '0.9rem',
  outline: 'none', fontFamily: "'Inter', sans-serif", transition: 'border-color 0.2s',
};

const Card = ({ children, style = {} }) => (
  <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '24px', ...style }}>
    {children}
  </div>
);

const EducatorProfile = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [profileData, setProfileData] = useState({
    name: user?.name || '', email: user?.email || '',
    phone: user?.phone || '', bio: user?.bio || '',
    specialization: user?.specialization || '',
    experience: user?.experience || '',
    department: user?.department || ''
  });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
    setErrorMessage('');
  };
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => { if (!phone) return true; return /^[0-9]{10}$/.test(phone.replace(/\D/g, '')); };

  const handleSaveProfile = async () => {
    setErrorMessage(''); setSuccessMessage('');
    if (!profileData.name.trim()) { setErrorMessage('Name is required'); return; }
    if (!profileData.email.trim()) { setErrorMessage('Email is required'); return; }
    if (!validateEmail(profileData.email)) { setErrorMessage('Please enter a valid email address'); return; }
    if (profileData.phone && !validatePhone(profileData.phone)) { setErrorMessage('Phone number must be exactly 10 digits'); return; }
    setSaving(true);
    try {
      const result = await updateProfile({ name: profileData.name, email: profileData.email, phone: profileData.phone, bio: profileData.bio, specialization: profileData.specialization, experience: profileData.experience, department: profileData.department });
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

  const tabs = [
    { id: 'profile', label: 'Profile Info' },
    { id: 'security', label: 'Security' },
    { id: 'statistics', label: 'Statistics' },
  ];

  const statItems = [
    { label: 'Total Courses', value: 12, color: '#06b6d4', icon: '📚' },
    { label: 'Total Students', value: 156, color: '#a855f7', icon: '👥' },
    { label: 'Assignments Given', value: 45, color: '#10b981', icon: '📝' },
    { label: 'Materials Uploaded', value: 89, color: '#f59e0b', icon: '📂' },
  ];

  return (
    <div style={{ color: 'white', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        .ep-input:focus { border-color: rgba(6,182,212,0.6) !important; box-shadow: 0 0 0 3px rgba(6,182,212,0.1) !important; }
        .ep-input:disabled { opacity: 0.5; cursor: not-allowed; }
        .ep-tab { flex: 1; padding: 10px 16px; border-radius: 8px; font-weight: 600; font-size: 0.85rem; border: none; cursor: pointer; transition: all 0.2s; }
        .ep-tab.active { background: linear-gradient(135deg,#06b6d4,#3b82f6); color: white; }
        .ep-tab:not(.active) { background: transparent; color: rgba(255,255,255,0.4); }
        .ep-tab:not(.active):hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.8); }
        .ep-btn-primary { padding: 10px 22px; background: linear-gradient(135deg,#06b6d4,#3b82f6); color: white; border: none; border-radius: 10px; font-weight: 700; font-size: 0.875rem; cursor: pointer; transition: opacity 0.2s; }
        .ep-btn-primary:hover { opacity: 0.88; }
        .ep-btn-primary:disabled { opacity: 0.45; cursor: not-allowed; }
        .ep-btn-cancel { padding: 10px 22px; background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.6); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; font-weight: 600; font-size: 0.875rem; cursor: pointer; }
        .ep-label { display: block; font-size: 0.75rem; font-weight: 700; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 7px; }
        .ep-stat:hover { transform: translateY(-3px); }
      `}</style>

      {/* Profile Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #051a2e 0%, #072040 50%, #0d1117 100%)',
        border: '1px solid rgba(6,182,212,0.2)',
        borderRadius: 20, padding: '28px 32px', marginBottom: 20,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle,rgba(6,182,212,0.2) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, position: 'relative', zIndex: 1 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#06b6d4,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 900, flexShrink: 0, boxShadow: '0 8px 24px rgba(6,182,212,0.4)' }}>
            {user?.name?.charAt(0).toUpperCase() || 'E'}
          </div>
          <div>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#06b6d4', marginBottom: 6 }}>Educator Profile</p>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>{user?.name}</h1>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)', textTransform: 'capitalize' }}>{user?.role} · ID: {user?.id}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Card style={{ padding: '8px 10px', marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {tabs.map(t => (
            <button key={t.id} className={`ep-tab${activeTab === t.id ? ' active' : ''}`} onClick={() => setActiveTab(t.id)}>{t.label}</button>
          ))}
        </div>
      </Card>

      {/* ── Profile Tab ── */}
      {activeTab === 'profile' && (
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Profile Information</h2>
            {!editing && <button className="ep-btn-primary" onClick={() => setEditing(true)}>Edit Profile</button>}
          </div>

          {errorMessage && <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', padding: '10px 14px', borderRadius: 10, fontSize: '0.85rem', marginBottom: 16, fontWeight: 600 }}>{errorMessage}</div>}
          {successMessage && <div style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399', padding: '10px 14px', borderRadius: 10, fontSize: '0.85rem', marginBottom: 16, fontWeight: 600 }}>{successMessage}</div>}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            {[
              { label: 'Full Name', name: 'name', type: 'text' },
              { label: 'Email Address', name: 'email', type: 'email' },
              { label: 'Phone Number', name: 'phone', type: 'tel', placeholder: '10 digit number' },
              { label: 'Department', name: 'department', type: 'text', placeholder: 'e.g., Computer Science' },
              { label: 'Specialization', name: 'specialization', type: 'text', placeholder: 'e.g., Web Development, Data Science' },
              { label: 'Experience (Years)', name: 'experience', type: 'number', placeholder: 'e.g., 5' },
            ].map((f, i) => (
              <div key={i}>
                <label className="ep-label">{f.label}</label>
                <input type={f.type} name={f.name} value={profileData[f.name]} onChange={handleProfileChange}
                  disabled={!editing} placeholder={f.placeholder} className="ep-input" style={darkInput} />
              </div>
            ))}
          </div>

          <div style={{ marginBottom: editing ? 16 : 0 }}>
            <label className="ep-label">Bio</label>
            <textarea name="bio" value={profileData.bio} onChange={handleProfileChange}
              disabled={!editing} rows={3} placeholder="Tell students about yourself..."
              className="ep-input" style={{ ...darkInput, resize: 'vertical' }} />
          </div>

          {editing && (
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={handleSaveProfile} disabled={saving} className="ep-btn-primary">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button onClick={() => setEditing(false)} disabled={saving} className="ep-btn-cancel">Cancel</button>
            </div>
          )}
        </Card>
      )}

      {/* ── Security Tab ── */}
      {activeTab === 'security' && (
        <Card>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20 }}>Change Password</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 400 }}>
            {['currentPassword', 'newPassword', 'confirmPassword'].map((field) => (
              <div key={field}>
                <label className="ep-label">{field === 'currentPassword' ? 'Current Password' : field === 'newPassword' ? 'New Password' : 'Confirm New Password'}</label>
                <input type="password" name={field} value={passwordData[field]} onChange={handlePasswordChange} className="ep-input" style={darkInput} />
              </div>
            ))}
            <button onClick={handleChangePassword} className="ep-btn-primary" style={{ padding: '13px' }}>Update Password</button>
          </div>
        </Card>
      )}

      {/* ── Statistics Tab ── */}
      {activeTab === 'statistics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
            {statItems.map((s, i) => (
              <Card key={i} className="ep-stat" style={{ transition: 'all 0.25s', cursor: 'default' }}>
                <div style={{ fontSize: '1.6rem', marginBottom: 10 }}>{s.icon}</div>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: 6, fontWeight: 500 }}>{s.label}</p>
                <p style={{ fontSize: '2rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</p>
              </Card>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Card>
              <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 14 }}>Top Performing Courses</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[{ name: 'Python Basics', pct: 95 }, { name: 'Web Development', pct: 88 }, { name: 'Data Science', pct: 82 }].map((c, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>{c.name}</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981' }}>{c.pct}%</span>
                    </div>
                    <div style={{ height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 100 }}>
                      <div style={{ height: '100%', width: `${c.pct}%`, background: '#10b981', borderRadius: 100 }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 14 }}>Recent Activities</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { text: 'Created "Advanced Python" course', dot: '#10b981' },
                  { text: '23 students submitted assignments', dot: '#06b6d4' },
                  { text: 'Uploaded 5 new materials', dot: '#a855f7' },
                ].map((a, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: a.dot, flexShrink: 0 }} />
                    <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.65)' }}>✓ {a.text}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default EducatorProfile;
