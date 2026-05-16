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
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    const trimmedName = certificateName.trim();
    if (!trimmedName) {
      setError('Please enter your full name.');
      return;
    }
    if (!grade) {
      setError('Please select your grade.');
      return;
    }

    try {
      setError('');
      setLoading(true);

      await updateUserProfile({
        name: trimmedName,
        certificateName: trimmedName,
        grade: grade,
        profileComplete: true,
      });

      // No need to navigate here; the useEffect above will trigger when profileComplete becomes true
    } catch (err) {
      console.error("Error saving profile:", err);
      setError('Failed to save your details: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f2f5', padding: '1rem' }}>
      <div className="auth-card" style={{ padding: '2.5rem', background: 'white', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', maxWidth: '450px', width: '100%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: '#1a203a' }}>Complete Your Profile</h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem', fontSize: '0.95rem' }}>
          Please provide these details for your conference registration and certificate.
        </p>
        
        {error && <div style={{ color: '#dc3545', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', padding: '0.75rem', borderRadius: '6px', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Full Name (for Certificate):</label>
            <input 
              type="text" 
              value={certificateName} 
              onChange={(e) => setCertificateName(e.target.value)}
              placeholder="Enter your name exactly as it should appear"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem' }}
              required
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Grade (Academic Year 2026-2027):</label>
            <select 
              value={grade} 
              onChange={(e) => setGrade(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem', backgroundColor: 'white' }}
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

          <button 
            type="submit" 
            disabled={loading} 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '1rem', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem', fontWeight: '600' }}
          >
            {loading ? 'Saving Profile...' : 'Complete Registration'}
          </button>
        </form>
      </div>
    </div>
  );
}
