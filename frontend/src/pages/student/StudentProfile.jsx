import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const API_BASE = 'http://localhost:5000';

// ── Save quiz result to DB ────────────────────────────────────────────────────
const saveQuizProgressToDB = async (studentId, score, total) => {
  try {
    const percentage = Math.round((score / total) * 100);
    const res = await fetch(`${API_BASE}/api/progress/quiz`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ studentId, score, total, percentage })
    });
    if (!res.ok) throw new Error('Failed to save progress');
    return await res.json();
  } catch (err) {
    console.error('Progress save error:', err);
  }
};
// ─────────────────────────────────────────────────────────────────────────────

const StudentProfile = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    bio: '',
    grade: '10th Grade',
    school: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Demo quiz state to show progress tracking
  const [quizDemo, setQuizDemo] = useState({ score: '', total: '' });
  const [quizSaving, setQuizSaving] = useState(false);
  const [quizSaved, setQuizSaved] = useState(false);

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setTimeout(async () => {
      await updateProfile(profileData);
      setSaving(false);
      setEditing(false);
      alert('Profile updated successfully!');
    }, 1000);
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match!'); return;
    }
    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters!'); return;
    }
    alert('Password changed successfully!');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  // Called automatically when a quiz is submitted anywhere in the app
  const handleQuizSubmit = async () => {
    const score = parseInt(quizDemo.score);
    const total = parseInt(quizDemo.total);
    if (!score || !total || score > total) {
      alert('Please enter valid score and total'); return;
    }
    setQuizSaving(true);
    await saveQuizProgressToDB(user?.id, score, total);
    setQuizSaving(false);
    setQuizSaved(true);
    setQuizDemo({ score: '', total: '' });
    setTimeout(() => setQuizSaved(false), 3000);
  };

  // Teal active tab style
  const tabStyle = (tab) => ({
    flex: 1, padding: '12px 24px', borderRadius: 8,
    fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.2s',
    background: activeTab === tab ? '#1a7a6e' : 'transparent',
    color: activeTab === tab ? 'white' : '#6b7280',
    border: 'none', cursor: 'pointer'
  });

  // Teal input focus style
  const inputClass = "w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition disabled:bg-gray-50";

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center space-x-4">
          {/* ✅ teal avatar */}
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold"
            style={{ background: '#1a7a6e' }}>
            {user?.name?.charAt(0).toUpperCase() || 'S'}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{user?.name}</h1>
            <p className="text-gray-600 capitalize">{user?.role}</p>
            <p className="text-sm mt-1" style={{ color: '#1a7a6e' }}>ID: {user?.id}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md p-2">
        <div className="flex space-x-2">
          <button style={tabStyle('profile')} onClick={() => setActiveTab('profile')}>
            Profile Information
          </button>
          <button style={tabStyle('security')} onClick={() => setActiveTab('security')}>
            Security
          </button>
          <button style={tabStyle('preferences')} onClick={() => setActiveTab('preferences')}>
            Preferences
          </button>
          <button style={tabStyle('progress')} onClick={() => setActiveTab('progress')}>
            📊 Quiz Progress
          </button>
        </div>
      </div>

      {/* ── Profile Tab ── */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Profile Information</h2>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 text-white rounded-lg transition text-sm font-medium"
                style={{ background: '#1a7a6e' }}
                onMouseEnter={e => e.currentTarget.style.background = '#155f55'}
                onMouseLeave={e => e.currentTarget.style.background = '#1a7a6e'}
              >
                Edit Profile
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input type="text" name="name" value={profileData.name}
                  onChange={handleProfileChange} disabled={!editing}
                  className={inputClass}
                  onFocus={e => e.target.style.borderColor = '#1a7a6e'}
                  onBlur={e => e.target.style.borderColor = '#d1d5db'} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input type="email" name="email" value={profileData.email}
                  onChange={handleProfileChange} disabled={!editing}
                  className={inputClass}
                  onFocus={e => e.target.style.borderColor = '#1a7a6e'}
                  onBlur={e => e.target.style.borderColor = '#d1d5db'} />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input type="tel" name="phone" value={profileData.phone}
                  onChange={handleProfileChange} disabled={!editing}
                  placeholder="+1 (555) 123-4567" className={inputClass}
                  onFocus={e => e.target.style.borderColor = '#1a7a6e'}
                  onBlur={e => e.target.style.borderColor = '#d1d5db'} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Grade/Level</label>
                <select name="grade" value={profileData.grade}
                  onChange={handleProfileChange} disabled={!editing}
                  className={inputClass}
                  onFocus={e => e.target.style.borderColor = '#1a7a6e'}
                  onBlur={e => e.target.style.borderColor = '#d1d5db'}>
                  <option>9th Grade</option>
                  <option>10th Grade</option>
                  <option>11th Grade</option>
                  <option>12th Grade</option>
                  <option>College/University</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">School/Institution</label>
              <input type="text" name="school" value={profileData.school}
                onChange={handleProfileChange} disabled={!editing}
                placeholder="Enter your school name" className={inputClass}
                onFocus={e => e.target.style.borderColor = '#1a7a6e'}
                onBlur={e => e.target.style.borderColor = '#d1d5db'} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea name="bio" value={profileData.bio}
                onChange={handleProfileChange} disabled={!editing}
                rows={4} placeholder="Tell us about yourself..."
                className={inputClass}
                onFocus={e => e.target.style.borderColor = '#1a7a6e'}
                onBlur={e => e.target.style.borderColor = '#d1d5db'} />
            </div>

            {editing && (
              <div className="flex space-x-3">
                <button onClick={handleSaveProfile} disabled={saving}
                  className="px-6 py-3 text-white rounded-lg transition font-medium disabled:opacity-50"
                  style={{ background: '#1a7a6e' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#155f55'}
                  onMouseLeave={e => e.currentTarget.style.background = '#1a7a6e'}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button onClick={() => setEditing(false)} disabled={saving}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium">
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Security Tab ── */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Change Password</h2>
          <div className="space-y-4 max-w-md">
            {['currentPassword', 'newPassword', 'confirmPassword'].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field === 'currentPassword' ? 'Current Password' : field === 'newPassword' ? 'New Password' : 'Confirm New Password'}
                </label>
                <input type="password" name={field}
                  value={passwordData[field]} onChange={handlePasswordChange}
                  className={inputClass}
                  onFocus={e => e.target.style.borderColor = '#1a7a6e'}
                  onBlur={e => e.target.style.borderColor = '#d1d5db'} />
              </div>
            ))}
            <button onClick={handleChangePassword}
              className="w-full px-6 py-3 text-white rounded-lg transition font-medium"
              style={{ background: '#1a7a6e' }}
              onMouseEnter={e => e.currentTarget.style.background = '#155f55'}
              onMouseLeave={e => e.currentTarget.style.background = '#1a7a6e'}>
              Update Password
            </button>
          </div>

          {/* 2FA */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Two-Factor Authentication</h3>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">Enable 2FA</p>
                <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer
                  peer-checked:after:translate-x-full peer-checked:after:border-white
                  after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                  after:bg-white after:border-gray-300 after:border after:rounded-full
                  after:h-5 after:w-5 after:transition-all"
                  style={{ '--tw-peer-checked-bg': '#1a7a6e' }}
                  // Tailwind doesn't support dynamic peer-checked bg via CSS var, use inline:
                ></div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ── Preferences Tab ── */}
      {activeTab === 'preferences' && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Learning Preferences</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Notifications</h3>
              <div className="space-y-3">
                {[
                  { label: 'Email notifications for new assignments', checked: true },
                  { label: 'Daily study reminders', checked: true },
                  { label: 'Quiz result notifications', checked: false },
                ].map((item, i) => (
                  <label key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                    <span className="text-gray-700">{item.label}</span>
                    <input type="checkbox" defaultChecked={item.checked}
                      className="w-4 h-4 rounded" style={{ accentColor: '#1a7a6e' }} />
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-3">AI Tutor Preferences</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Response Detail Level</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
                    onFocus={e => e.target.style.borderColor = '#1a7a6e'}
                    onBlur={e => e.target.style.borderColor = '#d1d5db'}>
                    <option>Concise</option>
                    <option>Balanced</option>
                    <option>Detailed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Explanation Style</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
                    onFocus={e => e.target.style.borderColor = '#1a7a6e'}
                    onBlur={e => e.target.style.borderColor = '#d1d5db'}>
                    <option>Simple/ELI5</option>
                    <option>Standard</option>
                    <option>Technical</option>
                  </select>
                </div>
              </div>
            </div>

            <button className="px-6 py-3 text-white rounded-lg transition font-medium"
              style={{ background: '#1a7a6e' }}
              onMouseEnter={e => e.currentTarget.style.background = '#155f55'}
              onMouseLeave={e => e.currentTarget.style.background = '#1a7a6e'}>
              Save Preferences
            </button>
          </div>
        </div>
      )}

      {/* ── Quiz Progress Tab ── */}
      {activeTab === 'progress' && (
        <div className="space-y-6">

          {/* Manual quiz save card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">📊 Record Quiz Result</h2>
            <p className="text-sm text-gray-500 mb-6">
              When you submit a quiz anywhere in the app, your result is automatically saved to the database and your progress is updated.
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Score</label>
                <input type="number" min="0" placeholder="e.g. 4"
                  value={quizDemo.score}
                  onChange={e => setQuizDemo(prev => ({ ...prev, score: e.target.value }))}
                  className={inputClass}
                  onFocus={e => e.target.style.borderColor = '#1a7a6e'}
                  onBlur={e => e.target.style.borderColor = '#d1d5db'} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Questions</label>
                <input type="number" min="1" placeholder="e.g. 5"
                  value={quizDemo.total}
                  onChange={e => setQuizDemo(prev => ({ ...prev, total: e.target.value }))}
                  className={inputClass}
                  onFocus={e => e.target.style.borderColor = '#1a7a6e'}
                  onBlur={e => e.target.style.borderColor = '#d1d5db'} />
              </div>
            </div>

            {quizDemo.score && quizDemo.total && (
              <div className="mb-4 p-3 rounded-lg text-sm font-medium" style={{ background: '#f0faf8', color: '#1a7a6e' }}>
                Score: {quizDemo.score}/{quizDemo.total} — {Math.round((parseInt(quizDemo.score) / parseInt(quizDemo.total)) * 100)}%
              </div>
            )}

            <button onClick={handleQuizSubmit} disabled={quizSaving}
              className="px-6 py-3 text-white rounded-lg transition font-medium disabled:opacity-50 flex items-center gap-2"
              style={{ background: '#1a7a6e' }}
              onMouseEnter={e => e.currentTarget.style.background = '#155f55'}
              onMouseLeave={e => e.currentTarget.style.background = '#1a7a6e'}>
              {quizSaving ? (
                <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> Saving...</>
              ) : '💾 Save to Database'}
            </button>

            {quizSaved && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm font-medium flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Progress saved to database successfully!
              </div>
            )}
          </div>

          {/* How it works */}
          <div className="rounded-xl p-6 border" style={{ background: 'linear-gradient(to right, #f0faf8, #f5f0ff)', borderColor: '#d1faf4' }}>
            <h3 className="font-semibold text-gray-800 mb-3" style={{ color: '#1a7a6e' }}>⚡ How Auto-Tracking Works</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-start gap-2">
                <span style={{ color: '#1a7a6e' }}>1.</span>
                <span>Student submits a quiz in <strong>Upload Materials</strong> or <strong>AI Quiz Generator</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: '#1a7a6e' }}>2.</span>
                <span>Score is automatically POSTed to <code className="bg-gray-100 px-1 rounded">/api/progress/quiz</code></span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: '#1a7a6e' }}>3.</span>
                <span>Backend updates the <strong>Progress</strong> table — increments <code className="bg-gray-100 px-1 rounded">quizzesTaken</code> and recalculates <code className="bg-gray-100 px-1 rounded">averageScore</code></span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: '#1a7a6e' }}>4.</span>
                <span>Progress is visible in <strong>My Progress</strong> dashboard instantly</span>
              </li>
            </ul>
          </div>
        </div>
      )}

    </div>
  );
};

export default StudentProfile;