import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function CompleteProfile() {
  const { currentUser, userRole, profileComplete, setProfileComplete, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (profileComplete) {
      navigate('/app', { replace: true });
    }
  }, [profileComplete, navigate]);

  const [certificateName, setCertificateName] = useState('');
  const [grade, setGrade] = useState('');
  const [section, setSection] = useState('');
  const [stream, setStream] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [committee, setCommittee] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    const trimmedName = certificateName.trim();
    if (!trimmedName) {
      setError('Please enter your full name.');
      return;
    }
    if (userRole === 'delegate') {
      if (!grade) {
        setError('Please select your grade.');
        return;
      }
      if (!section.trim()) {
        setError('Please enter your section.');
        return;
      }
      if (!stream) {
        setError('Please select your stream.');
        return;
      }
      if (!contactNo.trim()) {
        setError('Please enter your contact number.');
        return;
      }
    }
    if (!committee) {
      setError('Please select your committee.');
      return;
    }

    try {
      setError('');
      setLoading(true);

      // Create a timeout to prevent the button from being stuck forever
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Request timed out. Please check your connection.")), 10000)
      );

      await Promise.race([
        updateUserProfile({
          name: trimmedName,
          certificateName: trimmedName,
          grade: userRole === 'delegate' ? grade : null,
          section: userRole === 'delegate' ? section.trim().toUpperCase() : null,
          stream: userRole === 'delegate' ? stream : null,
          contactNo: userRole === 'delegate' ? contactNo.trim() : null,
          committee: committee,
          profileComplete: true,
        }),
        timeoutPromise
      ]);

      // No need to navigate here; the useEffect above will trigger when profileComplete becomes true
    } catch (err) {
      console.error("Error saving profile:", err);
      setError('Failed to save your details: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'linear-gradient(135deg, #f8f9fa 0%, #eceef4 50%, #f8f9fa 100%)', 
      padding: '2rem 1.5rem',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Blur Spheres */}
      <div style={{ position: 'absolute', width: '300px', height: '300px', background: 'rgba(139, 30, 30, 0.06)', filter: 'blur(100px)', borderRadius: '50%', top: '15%', left: '10%', pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', width: '350px', height: '350px', background: 'rgba(37, 45, 80, 0.06)', filter: 'blur(120px)', borderRadius: '50%', bottom: '15%', right: '10%', pointerEvents: 'none' }}></div>

      <div className="auth-card" style={{ 
        padding: '3rem 2.5rem', 
        background: '#ffffff', 
        border: '1px solid rgba(0, 0, 0, 0.08)',
        borderRadius: '24px', 
        boxShadow: '0 16px 48px rgba(26,29,43,0.08)', 
        maxWidth: '460px', 
        width: '100%',
        position: 'relative',
        zIndex: 2
      }}>
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '1rem', 
          color: '#1a1d2b',
          fontFamily: "'Outfit', sans-serif",
          fontWeight: '800',
          fontSize: '2rem',
          background: 'linear-gradient(90deg, #1a1d2b 0%, #3a3f52 50%, #8b1e1e 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Complete Your Profile
        </h2>
        <p style={{ textAlign: 'center', color: '#5c6278', marginBottom: '2rem', fontSize: '0.95rem', lineHeight: '1.6' }}>
          Please provide these details for your conference registration and certificate.
        </p>
        
        {error && (
          <div style={{ 
            color: '#ef4444', 
            backgroundColor: 'rgba(239, 68, 68, 0.05)', 
            border: '1px solid rgba(239, 68, 68, 0.15)', 
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
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#3a3f52', fontSize: '0.9rem' }}>Full Name (for Certificate):</label>
            <input 
              type="text" 
              value={certificateName} 
              onChange={(e) => setCertificateName(e.target.value)}
              placeholder="Enter your name exactly as it should appear"
              style={{ 
                width: '100%', 
                padding: '0.85rem', 
                borderRadius: '8px', 
                border: '1px solid rgba(0,0,0,0.12)', 
                background: 'rgba(0, 0, 0, 0.02)', 
                color: '#1a1d2b',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = 'rgba(139, 30, 30, 0.5)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.12)'}
              required
            />
          </div>

          {userRole === 'delegate' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#3a3f52', fontSize: '0.9rem' }}>Grade (Academic Year 2026-2027):</label>
                <select 
                  value={grade} 
                  onChange={(e) => setGrade(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '0.85rem', 
                    borderRadius: '8px', 
                    border: '1px solid rgba(0,0,0,0.12)', 
                    background: 'rgba(0, 0, 0, 0.02)', 
                    color: '#1a1d2b',
                    fontSize: '0.95rem',
                    outline: 'none',
                    cursor: 'pointer',
                    colorScheme: 'light',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(139, 30, 30, 0.5)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.12)'}
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
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#3a3f52', fontSize: '0.9rem' }}>Section:</label>
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
                    border: '1px solid rgba(0,0,0,0.12)', 
                    background: 'rgba(0, 0, 0, 0.02)', 
                    color: '#1a1d2b',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(139, 30, 30, 0.5)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.12)'}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#3a3f52', fontSize: '0.9rem' }}>Stream:</label>
                <select 
                  value={stream} 
                  onChange={(e) => setStream(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '0.85rem', 
                    borderRadius: '8px', 
                    border: '1px solid rgba(0,0,0,0.12)', 
                    background: 'rgba(0, 0, 0, 0.02)', 
                    color: '#1a1d2b',
                    fontSize: '0.95rem',
                    outline: 'none',
                    cursor: 'pointer',
                    colorScheme: 'light',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(139, 30, 30, 0.5)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.12)'}
                  required
                >
                  <option value="">Select Stream</option>
                  <option value="CBSE">CBSE</option>
                  <option value="i-Stream">i-Stream</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#3a3f52', fontSize: '0.9rem' }}>Contact Number:</label>
                <input 
                  type="tel" 
                  value={contactNo} 
                  onChange={(e) => setContactNo(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  style={{ 
                    width: '100%', 
                    padding: '0.85rem', 
                    borderRadius: '8px', 
                    border: '1px solid rgba(0,0,0,0.12)', 
                    background: 'rgba(0, 0, 0, 0.02)', 
                    color: '#1a1d2b',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(139, 30, 30, 0.5)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.12)'}
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#3a3f52', fontSize: '0.9rem' }}>CSMUN Committee Assignment:</label>
            <select 
              value={committee} 
              onChange={(e) => setCommittee(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '0.85rem', 
                borderRadius: '8px', 
                border: '1px solid rgba(0,0,0,0.12)', 
                background: 'rgba(0, 0, 0, 0.02)', 
                color: '#1a1d2b',
                fontSize: '0.95rem',
                outline: 'none',
                cursor: 'pointer',
                colorScheme: 'light',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = 'rgba(139, 30, 30, 0.5)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.12)'}
              required
            >
              <option value="">Select Committee</option>
              <option value="UNEP">UNEP (United Nations Environment Programme)</option>
              <option value="DISEC">DISEC (Disarmament and International Security Committee)</option>
              <option value="HRC">HRC (United Nations Human Rights Council)</option>
              <option value="SOCHUM">SOCHUM (Social, Humanitarian & Cultural Committee)</option>
              <option value="UNEA I">UNEA I (United Nations Environment Assembly I)</option>
              <option value="UNEA II">UNEA II (United Nations Environment Assembly II)</option>
              <option value="WTO">WTO (World Trade Organization)</option>
              <option value="SC">SC (United Nations Security Council)</option>
            </select>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            style={{ 
              width: '100%', 
              padding: '1rem', 
              borderRadius: '30px', 
              background: 'linear-gradient(90deg, #8b1e1e 0%, #a72828 100%)', 
              color: '#ffffff', 
              border: 'none', 
              cursor: loading ? 'not-allowed' : 'pointer', 
              fontSize: '1rem', 
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(139, 30, 30, 0.3)',
              marginTop: '0.5rem'
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {loading ? 'Saving Profile...' : 'Complete Registration'}
          </button>
        </form>
      </div>
    </div>
  );
}
