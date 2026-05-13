import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function Profile() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [certificateName, setCertificateName] = useState('');
  const [grade, setGrade] = useState('');
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
          setCertificateName(data.certificateName || '');
          setGrade(data.grade || '');
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
    if (!grade) return setError('Grade is required.');

    try {
      setError('');
      setSuccess('');
      setSaving(true);
      const docRef = doc(db, 'users', currentUser.uid);
      await updateDoc(docRef, {
        certificateName: trimmedName,
        grade: grade,
      });
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#1a203a' }}>Loading Profile...</div>;
  }

  return (
    <div className="auth-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f2f5', padding: '1rem' }}>
      <div className="auth-card" style={{ padding: '2.5rem', background: 'white', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', maxWidth: '450px', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <button onClick={() => navigate('/app')} style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', fontSize: '0.9rem' }}>← Back</button>
          <button onClick={logout} style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', fontSize: '0.9rem' }}>Logout</button>
        </div>

        <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: '#1a203a' }}>Edit Your Profile</h2>
        
        {error && <div style={{ color: '#dc3545', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        {success && <div style={{ color: '#155724', backgroundColor: '#d4edda', border: '1px solid #c3e6cb', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', textAlign: 'center' }}>{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Full Name (for Certificate):</label>
            <input 
              type="text" 
              value={certificateName} 
              onChange={(e) => setCertificateName(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px' }}
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Grade (2026-2027):</label>
            <select 
              value={grade} 
              onChange={(e) => setGrade(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px' }}
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
            disabled={saving} 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '1rem', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
          >
            {saving ? 'Saving...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
