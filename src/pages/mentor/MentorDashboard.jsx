import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { collection, query, where, getDocs, updateDoc, doc, addDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';

export default function MentorDashboard() {
  const { currentUser, userData, logout } = useAuth();
  const navigate = useNavigate();
  const [trackedDelegates, setTrackedDelegates] = useState([]);
  const [availableDelegates, setAvailableDelegates] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState('');
  const [newMeeting, setNewMeeting] = useState({ title: '', date: '', time: '', link: '' });

  const fetchData = async () => {
    if (!currentUser || !userData?.committee) return;

    try {
      setLoadingData(true);
      
      // Fetch all delegate progress records
      const progressSnapshot = await getDocs(collection(db, 'delegateProgress'));
      const progressMap = {};
      progressSnapshot.forEach(doc => {
        progressMap[doc.id] = doc.data().completedVideos || [];
      });

      // Fetch delegates in the same committee
      const qDelegates = query(
        collection(db, 'users'), 
        where('role', '==', 'delegate'),
        where('committee', '==', userData.committee)
      );
      const delSnapshot = await getDocs(qDelegates);
      const committeeDels = delSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        completedVideosCount: (progressMap[doc.id] || []).length
      }));

      // Separate into tracked by current mentor vs available (no mentorId)
      const tracked = committeeDels.filter(del => del.mentorId === currentUser.uid);
      const available = committeeDels.filter(del => !del.mentorId || del.mentorId === '');

      setTrackedDelegates(tracked);
      setAvailableDelegates(available);

      // Fetch uploads
      const qUploads = query(collection(db, 'uploads'));
      const upSnapshot = await getDocs(qUploads);
      const allUploads = upSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Filter uploads to only those from our tracked delegates
      const trackedIds = tracked.map(del => del.id);
      const filteredUploads = allUploads.filter(up => trackedIds.includes(up.uid));
      setUploads(filteredUploads);

      // Fetch meetings
      const qMeetings = query(collection(db, 'meetings'), where('mentorUid', '==', currentUser.uid));
      const meetSnapshot = await getDocs(qMeetings);
      setMeetings(meetSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      setError('');
    } catch (err) {
      console.error("Error fetching mentor dashboard data:", err);
      setError("Failed to fetch dashboard data: " + err.message);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (currentUser && userData) {
      fetchData();
    }
  }, [currentUser, userData]);

  const addDelegateToTrack = async (delegateId) => {
    try {
      setError('');
      const delegateRef = doc(db, 'users', delegateId);
      await updateDoc(delegateRef, {
        mentorId: currentUser.uid
      });
      await fetchData();
    } catch (err) {
      console.error("Error tracking delegate:", err);
      setError("Failed to track delegate: " + err.message);
    }
  };

  const removeDelegateFromTrack = async (delegateId) => {
    try {
      setError('');
      const delegateRef = doc(db, 'users', delegateId);
      await updateDoc(delegateRef, {
        mentorId: null
      });
      await fetchData();
    } catch (err) {
      console.error("Error releasing delegate:", err);
      setError("Failed to release delegate: " + err.message);
    }
  };

  const handleAttendance = async (delegateName, status) => {
    alert(`Marked ${status} for ${delegateName}`);
  };

  const scheduleMeeting = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await addDoc(collection(db, 'meetings'), {
        ...newMeeting,
        mentorUid: currentUser.uid,
        createdAt: serverTimestamp()
      });
      setNewMeeting({ title: '', date: '', time: '', link: '' });
      fetchData();
    } catch (err) {
      console.error("Error scheduling meeting:", err);
      setError("Failed to schedule meeting: " + err.message);
    }
  };

  const rankUpload = async (uploadId, rank) => {
    try {
      setError('');
      const scoreNum = parseInt(rank, 10);
      if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 10) {
        throw new Error("Score must be between 0 and 10.");
      }
      const uploadRef = doc(db, 'uploads', uploadId);
      await updateDoc(uploadRef, { rank: scoreNum });
      fetchData();
    } catch (err) {
      console.error("Error ranking document:", err);
      setError("Failed to update rank: " + err.message);
    }
  };

  const deleteUpload = async (uploadId) => {
    if (!window.confirm("🗑️ Are you sure you want to delete this document submission? This action will permanently remove it from delegate files and scores.")) return;
    try {
      setError('');
      const uploadRef = doc(db, 'uploads', uploadId);
      await deleteDoc(uploadRef);
      fetchData();
    } catch (err) {
      console.error("Error deleting document:", err);
      setError("Failed to delete document: " + err.message);
    }
  };

  // If mentor has not registered their committee yet
  if (!userData?.committee) {
    return (
      <div className="portal-wrapper" style={{ 
        minHeight: '100vh', 
        background: '#f8f9fa', 
        color: '#0f172a',
        padding: '3rem 1.5rem',
        fontFamily: "'Inter', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        
        <div className="auth-card" style={{ 
          maxWidth: '540px', 
          width: '100%',
          padding: '3rem 2.5rem', 
          background: '#ffffff', 
          border: '1px solid #cbd5e1',
          borderRadius: '24px', 
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)', 
          textAlign: 'center',
          position: 'relative',
          zIndex: 2
        }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>📋</span>
          <h2 style={{ 
            fontFamily: "'Outfit', sans-serif", 
            fontWeight: '800', 
            fontSize: '1.8rem',
            marginBottom: '1rem',
            color: '#0a2342'
          }}>
            Committee Assignment Required
          </h2>
          <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '2rem', lineHeight: '1.6' }}>
            Before you can view, add, or track delegates, please select your assigned CSMUN Committee in your profile.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={() => window.location.href = '/'}
              style={{ 
                padding: '0.85rem 2rem', 
                borderRadius: '30px', 
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#374151', 
                cursor: 'pointer', 
                fontWeight: '700',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f3f4f6';
                e.currentTarget.style.borderColor = '#9ca3af';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.borderColor = '#cbd5e1';
              }}
            >
              🏠 Home
            </button>
            <button 
              onClick={() => navigate('/app/profile')}
              style={{ 
                padding: '0.85rem 2rem', 
                borderRadius: '30px', 
                background: 'linear-gradient(90deg, #8b1e1e 0%, #a72828 100%)', 
                color: '#ffffff', 
                border: 'none', 
                cursor: 'pointer', 
                fontWeight: '700',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(139, 30, 30, 0.2)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Go to Edit Profile
            </button>
            <button 
              onClick={logout}
              style={{ 
                padding: '0.85rem 2rem', 
                borderRadius: '30px', 
                background: 'transparent', 
                border: '1.5px solid rgba(139, 30, 30, 0.25)',
                color: '#8b1e1e', 
                cursor: 'pointer', 
                fontWeight: '700',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(139, 30, 30, 0.05)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              Logout 🚪
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="portal-wrapper" style={{ 
      minHeight: '100vh', 
      background: '#f3f6fa', 
      color: '#0f172a',
      padding: '2rem 1.5rem',
      fontFamily: "'Inter', sans-serif",
      position: 'relative'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        
        {/* Navigation / Header Banner */}
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <span style={{ 
              fontSize: '0.8rem', 
              fontWeight: '800', 
              color: '#3b82f6', 
              textTransform: 'uppercase', 
              letterSpacing: '1.5px',
              display: 'block',
              marginBottom: '0.25rem'
            }}>
              DASHBOARD
            </span>
            <h1 style={{ 
              fontSize: '2.2rem', 
              fontWeight: '800', 
              fontFamily: "'Outfit', sans-serif",
              color: '#0a2342',
              margin: 0
            }}>
              Welcome, {userData?.name || currentUser?.displayName || 'Mentor'}.
            </h1>
            <p style={{ color: '#475569', fontSize: '0.95rem', margin: '0.25rem 0 0 0', fontWeight: '500' }}>
              Workspace for tracking committee delegates and grading document submissions.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={() => navigate('/app/notes')}
              style={{ 
                padding: '0.65rem 1.5rem', 
                borderRadius: '30px', 
                background: 'linear-gradient(90deg, #8b1e1e 0%, #a72828 100%)',
                border: 'none',
                color: '#ffffff',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '0.85rem',
                boxShadow: '0 4px 12px rgba(139, 30, 30, 0.15)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(139, 30, 30, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 30, 30, 0.15)';
              }}
            >
              📚 View Academic Notes
            </button>
            <button 
              onClick={() => window.location.href = '/'}
              style={{ 
                padding: '0.65rem 1.5rem', 
                borderRadius: '30px', 
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#334155',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '0.85rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f1f5f9';
                e.currentTarget.style.borderColor = '#94a3b8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.borderColor = '#cbd5e1';
              }}
            >
              🏠 Home
            </button>
            <button 
              onClick={() => navigate('/app/profile')}
              style={{ 
                padding: '0.65rem 1.5rem', 
                borderRadius: '30px', 
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#334155',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '0.85rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f1f5f9';
                e.currentTarget.style.borderColor = '#94a3b8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.borderColor = '#cbd5e1';
              }}
            >
              ⚙️ Profile
            </button>
            <button 
              onClick={logout} 
              style={{ 
                padding: '0.65rem 1.5rem', 
                borderRadius: '30px', 
                background: 'transparent',
                border: '1.5px solid rgba(139, 30, 30, 0.25)',
                color: '#8b1e1e',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '0.85rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#8b1e1e';
                e.currentTarget.style.background = 'rgba(139, 30, 30, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(139, 30, 30, 0.25)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              🚪 Log Out
            </button>
          </div>
        </header>

        {error && (
          <div style={{ 
            color: '#ef4444', 
            backgroundColor: 'rgba(239, 68, 68, 0.08)', 
            border: '1px solid rgba(239, 68, 68, 0.15)', 
            padding: '1rem', 
            borderRadius: '12px', 
            marginBottom: '2rem', 
            fontSize: '0.9rem',
            fontWeight: '600',
            textAlign: 'center'
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Top Row: Profile Card and Committee Space Card side-by-side with equal height */}
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '2rem', 
          marginTop: '1.5rem',
          alignItems: 'stretch' 
        }}>
          
          {/* Left Box: Premium Profile Card */}
          <div style={{ 
            flex: '1 1 280px',
            maxWidth: '320px',
            background: '#f4f6fe',
            border: '1px solid #cbd5e1',
            borderRadius: '24px',
            padding: '1.5rem',
            boxShadow: '0 4px 20px rgba(10, 35, 66, 0.02)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <span style={{ 
              fontSize: '0.75rem', 
              fontWeight: '700', 
              color: '#64748b', 
              textTransform: 'uppercase', 
              letterSpacing: '1px', 
              display: 'block', 
              textAlign: 'center', 
              marginBottom: '1rem' 
            }}>
              CSMUN VI MENTOR
            </span>

            <h3 style={{ 
              fontSize: '1.6rem', 
              fontWeight: '800', 
              color: '#0a2342', 
              margin: '0 0 1.5rem 0', 
              fontFamily: "'Outfit', sans-serif", 
              textAlign: 'center' 
            }}>
              {userData?.name || currentUser?.displayName || 'Mentor'}
            </h3>

            {/* Rounded Badges */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span style={{ 
                background: '#ffffff', 
                border: '1px solid #cbd5e1', 
                padding: '0.5rem 1rem', 
                borderRadius: '30px', 
                fontSize: '0.85rem', 
                fontWeight: '600', 
                color: '#334155', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.35rem',
                boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
              }}>
                💼 {userData?.committee || 'No Committee'}
              </span>
              <span style={{ 
                background: '#ffffff', 
                border: '1px solid #cbd5e1', 
                padding: '0.5rem 1rem', 
                borderRadius: '30px', 
                fontSize: '0.85rem', 
                fontWeight: '600', 
                color: '#8b1e1e', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.35rem',
                boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
              }}>
                👥 Delegate No. : {trackedDelegates.length}
              </span>
            </div>
          </div>

          {/* Right Box: Committee Space Info Card */}
          <div style={{ 
            flex: '2 1 500px',
            background: 'linear-gradient(135deg, #dbeafe 0%, #dcfce7 100%)', 
            border: '1px solid #cbd5e1',
            borderRadius: '24px',
            padding: '2rem 2.5rem',
            boxShadow: '0 4px 20px rgba(59, 130, 246, 0.05)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}>
            <div>
              <span style={{ 
                background: '#ffffff', 
                color: '#2563eb', 
                fontSize: '0.75rem', 
                fontWeight: '800', 
                padding: '4px 12px', 
                borderRadius: '20px', 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                boxShadow: '0 2px 5px rgba(0,0,0,0.02)',
                marginBottom: '1rem'
              }}>
                ⚡️ MENTOR SPACE
              </span>
              <h3 style={{ 
                fontFamily: "'Outfit', sans-serif", 
                fontSize: '1.6rem', 
                color: '#0a2342', 
                margin: '0 0 0.5rem 0',
                fontWeight: '800'
              }}>
                {userData?.committee || 'No Committee Assigned'}
              </h3>
              <p style={{ color: '#475569', fontSize: '0.95rem', margin: 0, maxWidth: '480px', lineHeight: '1.5' }}>
                Manage and evaluate delegates who are part of your committee. View document submissions and assign progress rank scores.
              </p>
            </div>

            {/* White rounded momentum capsule elements */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ background: '#ffffff', padding: '1rem 1.25rem', borderRadius: '16px', textAlign: 'center', minWidth: '90px', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#64748b', display: 'block', textTransform: 'uppercase' }}>TRACKING</span>
                <strong style={{ fontSize: '1.2rem', color: '#0a2342', display: 'block', marginTop: '0.25rem' }}>{trackedDelegates.length}</strong>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Row: Tracked Delegates Table Card (Full Width) */}
        <div style={{ marginTop: '2rem' }}>
          <div style={{ 
            background: '#ffffff', 
            border: '1px solid #cbd5e1',
            borderRadius: '24px',
            padding: '2rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.01)'
          }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.3rem', color: '#0a2342', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>👥</span> Your Delegates
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>
                    Delegates in your committee that you track.
                  </p>
                </div>
                
                <button 
                  onClick={() => setShowAddModal(true)}
                  style={{ 
                    padding: '0.5rem 1.25rem', 
                    borderRadius: '30px', 
                    background: 'linear-gradient(90deg, #8b1e1e 0%, #a72828 100%)', 
                    color: '#ffffff', 
                    border: 'none', 
                    cursor: 'pointer', 
                    fontWeight: '700', 
                    fontSize: '0.8rem',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(139, 30, 30, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <span>➕</span> Add Delegates
                </button>
              </div>

              {trackedDelegates.length === 0 ? (
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  padding: '3rem 1.5rem',
                  border: '1px dashed #cbd5e1',
                  borderRadius: '12px',
                  background: '#f8fafc',
                  textAlign: 'center'
                }}>
                  <span style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</span>
                  <strong style={{ color: '#334155', fontSize: '0.95rem', display: 'block' }}>No Tracked Delegates</strong>
                  <span style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.25rem', maxWidth: '320px', display: 'inline-block' }}>
                    Click "Add Delegates" above to view available delegates and start tracking them.
                  </span>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', color: '#334155', textAlign: 'left', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #e2e8f0', background: '#f8fafc' }}>
                        <th style={{ padding: '0.75rem', color: '#475569', fontWeight: '700', whiteSpace: 'nowrap' }}>Name</th>
                        <th style={{ padding: '0.75rem', color: '#475569', fontWeight: '700', whiteSpace: 'nowrap' }}>Grade</th>
                        <th style={{ padding: '0.75rem', color: '#475569', fontWeight: '700', whiteSpace: 'nowrap' }}>Sec</th>
                        <th style={{ padding: '0.75rem', color: '#475569', fontWeight: '700', whiteSpace: 'nowrap' }}>Stream</th>
                        <th style={{ padding: '0.75rem', color: '#475569', fontWeight: '700', whiteSpace: 'nowrap' }}>Email</th>
                        <th style={{ padding: '0.75rem', color: '#475569', fontWeight: '700', whiteSpace: 'nowrap' }}>Contact No.</th>
                        <th style={{ padding: '0.75rem', color: '#475569', fontWeight: '700', whiteSpace: 'nowrap' }}>Videos Watched</th>
                        <th style={{ padding: '0.75rem', color: '#475569', fontWeight: '700', textAlign: 'right', whiteSpace: 'nowrap' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trackedDelegates.map(del => (
                        <tr key={del.id} style={{ borderBottom: '1px solid #e2e8f0', transition: 'background 0.2s ease' }}>
                           <td style={{ padding: '0.85rem 0.75rem', whiteSpace: 'nowrap' }}>
                            <strong style={{ color: '#0a2342', display: 'block' }}>{del.name || 'Setup Pending'}</strong>
                          </td>
                          <td style={{ padding: '0.85rem 0.75rem', color: '#475569', whiteSpace: 'nowrap' }}>{del.grade ? `Grade ${del.grade}` : 'N/A'}</td>
                          <td style={{ padding: '0.85rem 0.75rem', color: '#475569', whiteSpace: 'nowrap' }}>{del.section?.toUpperCase() || 'N/A'}</td>
                          <td style={{ padding: '0.85rem 0.75rem', color: '#475569', whiteSpace: 'nowrap' }}>{del.stream || 'N/A'}</td>
                          <td style={{ padding: '0.85rem 0.75rem', color: '#475569', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{del.email}</td>
                          <td style={{ padding: '0.85rem 0.75rem', color: '#475569', whiteSpace: 'nowrap' }}>{del.contactNo || 'N/A'}</td>
                          <td style={{ padding: '0.85rem 0.75rem', whiteSpace: 'nowrap' }}>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              padding: '0.25rem 0.65rem',
                              borderRadius: '20px',
                              fontSize: '0.75rem',
                              fontWeight: '800',
                              background: del.completedVideosCount === 3 ? '#d1fae5' : del.completedVideosCount > 0 ? '#eff6ff' : '#f1f5f9',
                              color: del.completedVideosCount === 3 ? '#065f46' : del.completedVideosCount > 0 ? '#1e40af' : '#64748b',
                              border: `1px solid ${del.completedVideosCount === 3 ? '#a7f3d0' : del.completedVideosCount > 0 ? '#bfdbfe' : '#e2e8f0'}`
                            }}>
                              🎥 {del.completedVideosCount || 0} / 3
                            </span>
                          </td>
                          <td style={{ padding: '0.85rem 0.75rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <button 
                              onClick={() => removeDelegateFromTrack(del.id)}
                              style={{ 
                                padding: '0.3rem 0.75rem',
                                borderRadius: '20px',
                                background: 'transparent',
                                border: '1.5px solid rgba(239,68,68,0.3)',
                                color: '#ef4444',
                                fontWeight: '700',
                                cursor: 'pointer',
                                fontSize: '0.75rem',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                              ➖ Release
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Document Evaluation Card */}
            <div style={{ 
              background: '#ffffff', 
              border: '1px solid #cbd5e1',
              borderRadius: '24px',
              padding: '2rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.01)'
            }}>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.3rem', color: '#0a2342', fontWeight: '800', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>📤</span> Submissions & Evaluation
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Grade and score papers submitted by your tracked delegates. Enter 1-10 to save.
              </p>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: '#334155', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e2e8f0', background: '#f8fafc' }}>
                      <th style={{ padding: '0.75rem', color: '#475569', fontWeight: '700' }}>Delegate</th>
                      <th style={{ padding: '0.75rem', color: '#475569', fontWeight: '700' }}>Document Type</th>
                      <th style={{ padding: '0.75rem', color: '#475569', fontWeight: '700' }}>Document Link</th>
                      <th style={{ padding: '0.75rem', color: '#475569', fontWeight: '700', textAlign: 'right' }}>Score (out of 10)</th>
                      <th style={{ padding: '0.75rem', color: '#475569', fontWeight: '700', textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uploads.map(up => (
                      <tr key={up.id} style={{ borderBottom: '1px solid #e2e8f0', transition: 'background 0.2s ease' }}>
                        <td style={{ padding: '0.85rem 0.75rem', color: '#0a2342', fontWeight: '700' }}>{up.delegateName || up.delegateEmail}</td>
                        <td style={{ padding: '0.85rem 0.75rem', color: '#475569', textTransform: 'capitalize' }}>{up.type.replace('_', ' ')}</td>
                        <td style={{ padding: '0.85rem 0.75rem' }}>
                          <a 
                            href={up.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ color: '#8b1e1e', fontWeight: '700', textDecoration: 'underline' }}
                          >
                            📄 View File
                          </a>
                        </td>
                        <td style={{ padding: '0.85rem 0.75rem', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <input 
                              key={`${up.id}_${up.rank !== undefined && up.rank !== null ? up.rank : 'unscored'}`}
                              type="number" 
                              min="0" 
                              max="10" 
                              placeholder="0-10" 
                              defaultValue={up.rank !== undefined && up.rank !== null ? up.rank : ''}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.currentTarget.blur();
                                }
                              }}
                              onBlur={async (e) => {
                                const val = e.target.value;
                                if (val !== '') {
                                  const scoreNum = parseInt(val, 10);
                                  if (!isNaN(scoreNum) && scoreNum >= 0 && scoreNum <= 10) {
                                    if (scoreNum !== up.rank) {
                                      await rankUpload(up.id, scoreNum);
                                    }
                                  }
                                }
                              }}
                              style={{ 
                                width: '70px', 
                                padding: '0.4rem',
                                borderRadius: '6px',
                                border: up.rank !== undefined && up.rank !== null ? '1.5px solid #16a34a' : '1px solid #cbd5e1',
                                background: up.rank !== undefined && up.rank !== null ? '#f0fdf4' : '#ffffff',
                                color: up.rank !== undefined && up.rank !== null ? '#16a34a' : '#1e293b',
                                outline: 'none',
                                textAlign: 'center',
                                fontWeight: '700',
                                fontSize: '0.85rem'
                              }}
                            />
                          </div>
                        </td>
                        <td style={{ padding: '0.85rem 0.75rem', textAlign: 'right' }}>
                          <button
                            onClick={() => deleteUpload(up.id)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#ef4444',
                              cursor: 'pointer',
                              fontSize: '1.1rem',
                              padding: '0.25rem',
                              borderRadius: '4px',
                              transition: 'all 0.2s ease',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#fee2e2';
                              e.currentTarget.style.transform = 'scale(1.1)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.transform = 'scale(1)';
                            }}
                            title="Delete Submission"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                    {uploads.length === 0 && (
                      <tr>
                        <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#64748b', fontStyle: 'italic', background: '#f8fafc' }}>
                          No document submissions found to evaluate yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>

      {/* Add Delegates Modal Overlay */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(15, 23, 42, 0.5)',
          backdropFilter: 'blur(8px)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '24px',
            padding: '2.5rem 2rem',
            maxWidth: '500px',
            width: '100%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            position: 'relative'
          }}>
            {/* Close Button */}
            <button 
              onClick={() => setShowAddModal(false)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                fontSize: '1.5rem',
                cursor: 'pointer',
                transition: 'color 0.2s ease',
                lineHeight: '1'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
            >
              ×
            </button>

            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.5rem', color: '#8b1e1e', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>➕</span> Add Committee Delegates
            </h3>
            <p style={{ color: '#475569', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              Select available delegates in <strong>{userData.committee}</strong> to add them to your dashboard.
            </p>

            {availableDelegates.length === 0 ? (
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                padding: '3rem 1.5rem',
                border: '1px dashed #cbd5e1',
                borderRadius: '12px',
                background: '#f8fafc',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>🤝</span>
                <strong style={{ color: '#334155', fontSize: '0.95rem', display: 'block' }}>All Delegates Tracked</strong>
                <span style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                  There are no untracked delegates remaining in {userData.committee}.
                </span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '320px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                {availableDelegates.map(del => (
                  <div key={del.id} style={{ 
                    background: '#f8fafc', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(139, 30, 30, 0.3)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  >
                    <div>
                      <strong style={{ fontSize: '0.95rem', color: '#0a2342', display: 'block' }}>{del.name || 'Setup Pending'}</strong>
                      <span style={{ color: '#64748b', fontSize: '0.8rem', display: 'block' }}>{del.email}</span>
                      {(del.grade || del.section || del.stream) && (
                        <span style={{ fontSize: '0.75rem', color: '#8b1e1e', fontWeight: '700', marginTop: '0.2rem', display: 'inline-block', marginRight: '0.5rem' }}>
                          Grade {del.grade || '?'}{del.section ? `-${del.section.toUpperCase()}` : ''} {del.stream ? `• ${del.stream}` : ''}
                        </span>
                      )}
                      <span style={{ 
                        fontSize: '0.7rem', 
                        color: del.completedVideosCount === 3 ? '#065f46' : del.completedVideosCount > 0 ? '#1e40af' : '#475569', 
                        fontWeight: '800', 
                        background: del.completedVideosCount === 3 ? '#d1fae5' : del.completedVideosCount > 0 ? '#eff6ff' : '#f1f5f9', 
                        padding: '2px 8px', 
                        borderRadius: '10px', 
                        border: `1px solid ${del.completedVideosCount === 3 ? '#a7f3d0' : del.completedVideosCount > 0 ? '#bfdbfe' : '#e2e8f0'}`,
                        display: 'inline-block' 
                      }}>
                        🎥 {del.completedVideosCount || 0}/3 Done
                      </span>
                    </div>
                    <button 
                      onClick={() => addDelegateToTrack(del.id)}
                      style={{ 
                        padding: '0.4rem 1rem', 
                        borderRadius: '20px', 
                        background: 'linear-gradient(90deg, #8b1e1e 0%, #a72828 100%)', 
                        color: '#ffffff', 
                        border: 'none', 
                        cursor: 'pointer', 
                        fontWeight: '700', 
                        fontSize: '0.85rem',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 4px 10px rgba(139, 30, 30, 0.15)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.15)'}
                      onMouseLeave={(e) => e.currentTarget.style.filter = 'none'}
                    >
                      ➕ Track
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setShowAddModal(false)}
                style={{
                  padding: '0.6rem 1.5rem',
                  borderRadius: '20px',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  color: '#475569',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
