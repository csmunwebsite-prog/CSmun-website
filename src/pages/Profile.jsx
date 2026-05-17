import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function Profile() {
  const { currentUser, logout, updateUserProfile, userRole } = useAuth();
  const navigate = useNavigate();
  const [certificateName, setCertificateName] = useState('');
  const [grade, setGrade] = useState('');
  const [section, setSection] = useState('');
  const [stream, setStream] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [committee, setCommittee] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCertificateName(data.certificateName || data.name || '');
          setGrade(data.grade || '');
          setSection(data.section || '');
          setStream(data.stream || '');
          setContactNo(data.contactNo || '');
          setCommittee(data.committee || '');
        }
      } catch (err) {
        setError('Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    }
    fetchUserData();
  }, [currentUser]);

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmedName = certificateName.trim();
    if (!trimmedName) return setError('Name is required.');
    if (userRole === 'delegate') {
      if (!grade) return setError('Grade is required.');
      if (!section.trim()) return setError('Section is required.');
      if (!stream) return setError('Stream is required.');
      if (!contactNo.trim()) return setError('Contact number is required.');
    }
    if (!committee) return setError('Committee is required.');

    try {
      setError('');
      setSuccess('');
      setSaving(true);
      await updateUserProfile({
        name: trimmedName,
        certificateName: trimmedName,
        grade: userRole === 'delegate' ? grade : null,
        section: userRole === 'delegate' ? section.trim().toUpperCase() : null,
        stream: userRole === 'delegate' ? stream : null,
        contactNo: userRole === 'delegate' ? contactNo.trim() : null,
        committee: committee
      });
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        background: 'linear-gradient(135deg, #0a0c16 0%, #12172a 50%, #0a0c16 100%)', 
        color: '#ffffff',
        fontFamily: "'Inter', sans-serif"
      }}>
        Loading Profile...
      </div>
    );
  }

  return (
    <div className="auth-container" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'linear-gradient(135deg, #0a0c16 0%, #12172a 50%, #0a0c16 100%)', 
      padding: '2rem 1.5rem',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Blur Spheres */}
      <div style={{ position: 'absolute', width: '300px', height: '300px', background: 'rgba(139, 30, 30, 0.15)', filter: 'blur(100px)', borderRadius: '50%', top: '15%', left: '10%', pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', width: '350px', height: '350px', background: 'rgba(26, 32, 58, 0.35)', filter: 'blur(120px)', borderRadius: '50%', bottom: '15%', right: '10%', pointerEvents: 'none' }}></div>

      <div className="auth-card" style={{ 
        padding: '3rem 2.5rem', 
        background: 'rgba(255, 255, 255, 0.03)', 
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '24px', 
        boxShadow: '0 16px 48px rgba(0,0,0,0.4)', 
        maxWidth: '460px', 
        width: '100%',
        position: 'relative',
        zIndex: 2
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <button 
            onClick={() => navigate('/app')} 
            style={{ 
              background: 'transparent', 
              border: '1px solid rgba(255,255,255,0.2)', 
              borderRadius: '20px',
              padding: '0.4rem 1rem',
              color: '#ffffff', 
              cursor: 'pointer', 
              fontSize: '0.85rem',
              fontWeight: '600',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            ← Back
          </button>
          <button 
            onClick={logout} 
            style={{ 
              background: 'transparent', 
              border: '1px solid rgba(239, 68, 68, 0.3)', 
              borderRadius: '20px',
              padding: '0.4rem 1rem',
              color: '#ef4444', 
              cursor: 'pointer', 
              fontSize: '0.85rem',
              fontWeight: '600',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            Logout 🚪
          </button>
        </div>

        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '1rem', 
          color: '#ffffff',
          fontFamily: "'Outfit', sans-serif",
          fontWeight: '800',
          fontSize: '2rem',
          background: 'linear-gradient(90deg, #ffffff 0%, #cbd5e1 50%, #a72828 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Edit Your Profile
        </h2>
        
        {error && (
          <div style={{ 
            color: '#ef4444', 
            backgroundColor: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.2)', 
            padding: '0.85rem', 
            borderRadius: '8px', 
            marginBottom: '1.5rem', 
            textAlign: 'center', 
            fontSize: '0.9rem',
            fontWeight: '600'
          }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ 
            color: '#22c55e', 
            backgroundColor: 'rgba(34, 197, 94, 0.1)', 
            border: '1px solid rgba(34, 197, 94, 0.2)', 
            padding: '0.85rem', 
            borderRadius: '8px', 
            marginBottom: '1.5rem', 
            textAlign: 'center', 
            fontSize: '0.9rem',
            fontWeight: '600'
          }}>
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#cbd5e1', fontSize: '0.9rem' }}>Full Name (for Certificate):</label>
            <input 
              type="text" 
              value={certificateName} 
              onChange={(e) => setCertificateName(e.target.value)}
              placeholder="Enter your name exactly as it appear"
              style={{ 
                width: '100%', 
                padding: '0.85rem', 
                borderRadius: '8px', 
                border: '1px solid rgba(255,255,255,0.1)', 
                background: 'rgba(0, 0, 0, 0.4)', 
                color: '#ffffff',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = 'rgba(139, 30, 30, 0.5)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              required
            />
          </div>

          {userRole === 'delegate' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#cbd5e1', fontSize: '0.9rem' }}>Grade (2026-2027):</label>
                <select 
                  value={grade} 
                  onChange={(e) => setGrade(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '0.85rem', 
                    borderRadius: '8px', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    background: 'rgba(0, 0, 0, 0.4)', 
                    color: '#ffffff',
                    fontSize: '0.95rem',
                    outline: 'none',
                    cursor: 'pointer',
                    colorScheme: 'dark',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(139, 30, 30, 0.5)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  required
                >
                  <option value="">Select Grade</option>
                  <option value="6">Grade 6</option>
                  <option value="7">Grade 7</option>
                  <option value="8">Grade 8</option>
                  <option value="9">Grade 9</option>
                  <option value="10">Grade 10</option>
                  <option value="11">Grade 11</option>
                  <option value="12">Grade 12</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#cbd5e1', fontSize: '0.9rem' }}>Section:</label>
                <input 
                  type="text" 
                  value={section} 
                  onChange={(e) => setSection(e.target.value)}
                  placeholder="e.g. A, B, C"
                  maxLength={1}
                  style={{ 
                    width: '100%', 
                    padding: '0.85rem', 
                    borderRadius: '8px', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    background: 'rgba(0, 0, 0, 0.4)', 
                    color: '#ffffff',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(139, 30, 30, 0.5)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#cbd5e1', fontSize: '0.9rem' }}>Stream:</label>
                <select 
                  value={stream} 
                  onChange={(e) => setStream(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '0.85rem', 
                    borderRadius: '8px', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    background: 'rgba(0, 0, 0, 0.4)', 
                    color: '#ffffff',
                    fontSize: '0.95rem',
                    outline: 'none',
                    cursor: 'pointer',
                    colorScheme: 'dark',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(139, 30, 30, 0.5)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  required
                >
                  <option value="">Select Stream</option>
                  <option value="iStream">iStream</option>
                  <option value="CBSE">CBSE</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#cbd5e1', fontSize: '0.9rem' }}>Contact Number:</label>
                <input 
                  type="tel" 
                  value={contactNo} 
                  onChange={(e) => setContactNo(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  style={{ 
                    width: '100%', 
                    padding: '0.85rem', 
                    borderRadius: '8px', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    background: 'rgba(0, 0, 0, 0.4)', 
                    color: '#ffffff',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(139, 30, 30, 0.5)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#cbd5e1', fontSize: '0.9rem' }}>CSMUN Committee Assignment:</label>
            <select 
              value={committee} 
              onChange={(e) => setCommittee(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '0.85rem', 
                borderRadius: '8px', 
                border: '1px solid rgba(255,255,255,0.1)', 
                background: 'rgba(0, 0, 0, 0.4)', 
                color: '#ffffff',
                fontSize: '0.95rem',
                outline: 'none',
                cursor: 'pointer',
                colorScheme: 'dark',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = 'rgba(139, 30, 30, 0.5)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              required
            >
              <option value="">Select Committee</option>
              <option value="Committee 1">Committee 1</option>
              <option value="Committee 2">Committee 2</option>
              <option value="Committee 3">Committee 3</option>
              <option value="Committee 4">Committee 4</option>
              <option value="Committee 5">Committee 5</option>
              <option value="Committee 6">Committee 6</option>
              <option value="Committee 7">Committee 7</option>
              <option value="Committee 8">Committee 8</option>
              <option value="Committee 9">Committee 9</option>
              <option value="Committee 10">Committee 10</option>
            </select>
          </div>

          <button 
            type="submit" 
            disabled={saving} 
            style={{ 
              width: '100%', 
              padding: '1rem', 
              borderRadius: '30px', 
              background: 'linear-gradient(90deg, #8b1e1e 0%, #a72828 100%)', 
              color: '#ffffff', 
              border: 'none', 
              cursor: saving ? 'not-allowed' : 'pointer', 
              fontSize: '1rem', 
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(139, 30, 30, 0.3)',
              marginTop: '0.5rem'
            }}
            onMouseEnter={(e) => {
              if (!saving) e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              if (!saving) e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {saving ? 'Saving...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
