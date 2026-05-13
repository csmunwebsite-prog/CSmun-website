import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [role, setRole] = useState('delegate');
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
      // Navigate to /app which will handle the smart redirect
      navigate('/app', { replace: true });
    } catch (err) {
      setError('Failed to log in with Google: ' + err.message);
    }
    setLoading(false);
  }

  return (
    <div className="auth-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f2f5' }}>
      <div className="auth-card" style={{ padding: '2rem', background: 'white', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', maxWidth: '400px', width: '100%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Login to CSMUN</h2>
        
        {error && <div className="alert alert-danger" style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Select Your Role:</label>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <label style={{ cursor: 'pointer' }}>
              <input 
                type="radio" 
                value="delegate" 
                checked={role === 'delegate'} 
                onChange={(e) => setRole(e.target.value)} 
                style={{ marginRight: '0.5rem' }}
              /> Delegate
            </label>
            <label style={{ cursor: 'pointer' }}>
              <input 
                type="radio" 
                value="mentor" 
                checked={role === 'mentor'} 
                onChange={(e) => setRole(e.target.value)} 
                style={{ marginRight: '0.5rem' }}
              /> Mentor
            </label>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem', textAlign: 'center' }}>
            If you already have an account, your previous role will be used.
          </p>
        </div>

        <button 
          onClick={handleGoogleLogin} 
          disabled={loading} 
          className="btn btn-primary" 
          style={{ width: '100%', padding: '0.75rem', border: 'none', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google Logo" style={{ width: '20px' }} />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
