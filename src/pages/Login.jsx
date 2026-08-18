import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [role, setRole] = useState('delegate');
  const [mentorCode, setMentorCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginWithGoogle, currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate('/app', { replace: true });
    }
  }, [currentUser, navigate]);

  async function handleGoogleLogin() {
    try {
      setError('');
      setLoading(true);
      const { isProfileComplete } = await loginWithGoogle(role);
      navigate('/app/delegate', { replace: true });
    } catch (err) {
      setError('Failed to log in with Google: ' + err.message);
    }
    setLoading(false);
  }

  return (
    <div className="auth-container" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'linear-gradient(135deg, #f8f9fa 0%, #eceef4 50%, #f8f9fa 100%)',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
      overflow: 'hidden',
      padding: '2rem 1.5rem'
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
        maxWidth: '440px', 
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
          Login to CSMUN
        </h2>
        <p style={{ textAlign: 'center', color: '#5c6278', fontSize: '0.9rem', marginBottom: '2rem' }}>
          Welcome back! Please select your portal role and sign in.
        </p>
        
        {error && (
          <div className="alert alert-danger" style={{ 
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
        
        <div className="form-group" style={{ marginBottom: '2.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600', color: '#3a3f52', fontSize: '0.9rem', textAlign: 'center' }}>
            Select Your Portal Role:
          </label>
          
          {/* Custom Capsule Toggle Tabs */}
          <div style={{ 
            display: 'flex', 
            background: 'rgba(0, 0, 0, 0.04)', 
            padding: '4px', 
            borderRadius: '30px', 
            border: '1px solid rgba(0, 0, 0, 0.05)' 
          }}>
            <button
              onClick={() => setRole('delegate')}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                border: 'none',
                borderRadius: '26px',
                background: role === 'delegate' ? 'linear-gradient(90deg, #8b1e1e 0%, #a72828 100%)' : 'transparent',
                color: role === 'delegate' ? '#ffffff' : '#5c6278',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
            >
              Delegate
            </button>
            <button
              onClick={() => setRole('mentor')}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                border: 'none',
                borderRadius: '26px',
                background: role === 'mentor' ? 'linear-gradient(90deg, #8b1e1e 0%, #a72828 100%)' : 'transparent',
                color: role === 'mentor' ? '#ffffff' : '#5c6278',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
            >
              Mentor
            </button>
          </div>
        </div>

        <button 
          onClick={handleGoogleLogin} 
          disabled={loading} 
          style={{ 
            width: '100%', 
            padding: '1rem', 
            border: '1px solid rgba(0, 0, 0, 0.12)', 
            borderRadius: '30px', 
            background: 'rgba(0, 0, 0, 0.02)', 
            color: '#1a1d2b',
            fontWeight: '700',
            cursor: loading ? 'not-allowed' : 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '0.75rem',
            fontSize: '0.95rem',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.2)';
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.12)';
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.02)';
              e.currentTarget.style.transform = 'translateY(0)';
            }
          }}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google Logo" style={{ width: '20px', height: '20px' }} />
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </button>
      </div>
    </div>
  );
}
