import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function AdminPortal() {
  const navigate = useNavigate();
  const [passwordInput, setPasswordInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('cs_admin_auth') === 'true';
  });
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  // Data states
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'unallocated'

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === 'ADMIN_CSmunvi2026') {
      setIsAuthenticated(true);
      sessionStorage.setItem('cs_admin_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('Invalid Admin Password. Access Denied.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('cs_admin_auth');
    setPasswordInput('');
  };

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(collection(db, 'users'));
      const allUsers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(allUsers);
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAdminData();
    }
  }, [isAuthenticated]);

  // Compute metrics
  const mentors = users.filter(u => u.role === 'mentor');
  const delegates = users.filter(u => u.role !== 'mentor');

  const unallocatedDelegates = delegates.filter(d => !d.mentorId && !d.mentorName);
  const allocatedDelegates = delegates.filter(d => d.mentorId || d.mentorName);

  // Collect all unique committee names
  const defaultCommittees = ['DISEC', 'SOCHUM', 'UNSC', 'UNHRC', 'HCC', 'IPC'];
  const userCommittees = users.map(u => u.committee).filter(Boolean);
  const allCommittees = Array.from(new Set([...defaultCommittees, ...userCommittees])).sort();

  // Search filtering
  const filterUser = (user) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (user.name && user.name.toLowerCase().includes(q)) ||
      (user.displayName && user.displayName.toLowerCase().includes(q)) ||
      (user.email && user.email.toLowerCase().includes(q)) ||
      (user.committee && user.committee.toLowerCase().includes(q)) ||
      (user.mentorName && user.mentorName.toLowerCase().includes(q)) ||
      (user.stream && user.stream.toLowerCase().includes(q))
    );
  };

  // If not password authenticated, show password prompt
  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        fontFamily: "'Inter', sans-serif",
        color: '#f8fafc',
        padding: '1.5rem'
      }}>
        <div style={{
          maxWidth: '420px',
          width: '100%',
          background: 'rgba(30, 41, 59, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '24px',
          padding: '2.5rem 2rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          textAlign: 'center',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'rgba(225, 29, 72, 0.15)',
            border: '1.5px solid rgba(225, 29, 72, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto',
            color: '#f43f5e',
            fontSize: '1.6rem'
          }}>
            🔒
          </div>

          <h2 style={{
            fontSize: '1.6rem',
            fontWeight: '800',
            fontFamily: "'Outfit', sans-serif",
            marginBottom: '0.5rem',
            background: 'linear-gradient(90deg, #ffffff 0%, #cbd5e1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            CSMUN Executive Portal
          </h2>

          <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginBottom: '2rem' }}>
            Protected Administrator Access. Enter password to view system overview.
          </p>

          {authError && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              borderRadius: '12px',
              padding: '0.75rem',
              fontSize: '0.85rem',
              fontWeight: '600',
              marginBottom: '1.25rem'
            }}>
              ⚠️ {authError}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input 
              type="password"
              placeholder="Enter Admin Password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              style={{
                width: '100%',
                padding: '0.9rem 1.2rem',
                borderRadius: '14px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                background: 'rgba(15, 23, 42, 0.6)',
                color: '#ffffff',
                fontSize: '0.95rem',
                outline: 'none',
                textAlign: 'center',
                letterSpacing: '2px',
                boxSizing: 'border-box'
              }}
              autoFocus
            />

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '0.9rem',
                borderRadius: '14px',
                border: 'none',
                background: 'linear-gradient(90deg, #8b1e1e 0%, #b91c1c 100%)',
                color: '#ffffff',
                fontWeight: '700',
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, boxShadow 0.2s ease',
                boxShadow: '0 4px 14px rgba(185, 28, 28, 0.4)',
                fontFamily: "'Outfit', sans-serif"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Unlock Executive Portal
            </button>
          </form>

          <div style={{ marginTop: '2rem' }}>
            <Link to="/" style={{ color: '#64748b', fontSize: '0.82rem', textDecoration: 'none' }}>
              ← Return to Main Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0b0f19',
      color: '#e2e8f0',
      fontFamily: "'Inter', sans-serif",
      padding: '2rem 1.5rem',
      boxSizing: 'border-box'
    }}>
      {/* Top Header */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto 2rem auto',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        paddingBottom: '1.5rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <span style={{
              background: '#8b1e1e',
              color: '#ffffff',
              fontSize: '0.75rem',
              fontWeight: '800',
              padding: '3px 10px',
              borderRadius: '20px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              CONFIDENTIAL
            </span>
            <h1 style={{
              margin: 0,
              fontSize: '1.8rem',
              fontWeight: '800',
              color: '#ffffff',
              fontFamily: "'Outfit', sans-serif"
            }}>
              CSMUN Executive Admin Portal
            </h1>
          </div>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>
            Real-time committee allocations, mentor breakdown, and unallocated delegates list.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={fetchAdminData}
            disabled={loading}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#cbd5e1',
              padding: '0.6rem 1.2rem',
              borderRadius: '10px',
              fontWeight: '600',
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'background 0.2s ease'
            }}
          >
            🔄 {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>

          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              padding: '0.6rem 1.2rem',
              borderRadius: '10px',
              fontWeight: '600',
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            🔒 Lock Portal
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Metric Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}>
          {/* Card 1: Total Committees */}
          <div style={{
            background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '18px',
            padding: '1.5rem',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)'
          }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              🏛️ Total Committees
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: '900', color: '#ffffff', fontFamily: "'Outfit', sans-serif", margin: '0.4rem 0' }}>
              {allCommittees.length}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Active conference chambers
            </div>
          </div>

          {/* Card 2: Total Mentors */}
          <div style={{
            background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '18px',
            padding: '1.5rem',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)'
          }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              🎓 Total Mentors
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: '900', color: '#ffffff', fontFamily: "'Outfit', sans-serif", margin: '0.4rem 0' }}>
              {mentors.length}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Registered guidance leads
            </div>
          </div>

          {/* Card 3: Total Delegates */}
          <div style={{
            background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '18px',
            padding: '1.5rem',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)'
          }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              👥 Total Delegates
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: '900', color: '#ffffff', fontFamily: "'Outfit', sans-serif", margin: '0.4rem 0' }}>
              {delegates.length}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: '600' }}>
              {allocatedDelegates.length} Allocated ({Math.round((allocatedDelegates.length / (delegates.length || 1)) * 100)}%)
            </div>
          </div>

          {/* Card 4: Unallocated Delegates */}
          <div style={{
            background: unallocatedDelegates.length > 0 ? 'linear-gradient(145deg, #311318 0%, #1e1b2e 100%)' : 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
            border: unallocatedDelegates.length > 0 ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(255,255,255,0.1)',
            borderRadius: '18px',
            padding: '1.5rem',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)'
          }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: unallocatedDelegates.length > 0 ? '#fca5a5' : '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              ⚠️ Unallocated Delegates
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: '900', color: unallocatedDelegates.length > 0 ? '#f87171' : '#22c55e', fontFamily: "'Outfit', sans-serif", margin: '0.4rem 0' }}>
              {unallocatedDelegates.length}
            </div>
            <div style={{ fontSize: '0.8rem', color: unallocatedDelegates.length > 0 ? '#fca5a5' : '#86efac' }}>
              {unallocatedDelegates.length > 0 ? 'Requires mentor allocation' : 'All delegates allocated!'}
            </div>
          </div>
        </div>

        {/* Filter and View Tabs */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1.5rem',
          background: 'rgba(30, 41, 59, 0.5)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
          padding: '0.85rem 1.25rem'
        }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setActiveTab('all')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'all' ? '#8b1e1e' : 'transparent',
                color: activeTab === 'all' ? '#ffffff' : '#94a3b8',
                fontWeight: '700',
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              🏛️ All Committees Breakdown
            </button>

            <button
              onClick={() => setActiveTab('unallocated')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'unallocated' ? '#ef4444' : 'transparent',
                color: activeTab === 'unallocated' ? '#ffffff' : '#94a3b8',
                fontWeight: '700',
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              ⚠️ Unallocated Delegates List ({unallocatedDelegates.length})
            </button>
          </div>

          {/* Search Box */}
          <div style={{ flex: '1', maxWidth: '320px', minWidth: '220px' }}>
            <input 
              type="text"
              placeholder="🔍 Search delegate or mentor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 1rem',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.12)',
                background: '#0f172a',
                color: '#ffffff',
                fontSize: '0.85rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* Tab 1: All Committees Breakdown */}
        {activeTab === 'all' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {allCommittees.map(commName => {
              const commMentors = mentors.filter(m => m.committee === commName && filterUser(m));
              const commDelegates = delegates.filter(d => d.committee === commName && filterUser(d));
              const commUnallocated = commDelegates.filter(d => !d.mentorId && !d.mentorName);

              // Don't render committee if searching and nothing matches
              if (searchQuery.trim() && commMentors.length === 0 && commDelegates.length === 0) {
                return null;
              }

              return (
                <div 
                  key={commName}
                  style={{
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '20px',
                    padding: '1.5rem',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                  }}
                >
                  {/* Committee Header */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    marginBottom: '1.25rem',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    paddingBottom: '1rem'
                  }}>
                    <div>
                      <h2 style={{
                        margin: 0,
                        fontSize: '1.4rem',
                        fontWeight: '800',
                        color: '#ffffff',
                        fontFamily: "'Outfit', sans-serif",
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem'
                      }}>
                        🏛️ {commName}
                      </h2>
                    </div>

                    <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                      <span style={{
                        background: 'rgba(59, 130, 246, 0.15)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        color: '#93c5fd',
                        fontSize: '0.78rem',
                        fontWeight: '700',
                        padding: '4px 10px',
                        borderRadius: '20px'
                      }}>
                        🎓 {commMentors.length} Mentors
                      </span>

                      <span style={{
                        background: 'rgba(16, 185, 129, 0.15)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        color: '#6ee7b7',
                        fontSize: '0.78rem',
                        fontWeight: '700',
                        padding: '4px 10px',
                        borderRadius: '20px'
                      }}>
                        👥 {commDelegates.length} Delegates
                      </span>

                      {commUnallocated.length > 0 && (
                        <span style={{
                          background: 'rgba(239, 68, 68, 0.15)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          color: '#fca5a5',
                          fontSize: '0.78rem',
                          fontWeight: '700',
                          padding: '4px 10px',
                          borderRadius: '20px'
                        }}>
                          ⚠️ {commUnallocated.length} Unallocated
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Section 1: Mentors and their assigned Delegates */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '0.95rem', color: '#cbd5e1', fontWeight: '700', marginBottom: '0.85rem' }}>
                      🎓 Assigned Mentors & Delegates
                    </h3>

                    {commMentors.length === 0 ? (
                      <div style={{
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px dashed rgba(255,255,255,0.08)',
                        borderRadius: '12px',
                        padding: '1rem',
                        color: '#64748b',
                        fontSize: '0.85rem'
                      }}>
                        No mentors registered in {commName} yet.
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
                        {commMentors.map(mentor => {
                          const assignedDels = commDelegates.filter(
                            d => d.mentorId === mentor.id || (d.mentorName && d.mentorName === mentor.name)
                          );

                          return (
                            <div 
                              key={mentor.id}
                              style={{
                                background: '#1e293b',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '14px',
                                padding: '1.1rem'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                <div>
                                  <div style={{ fontWeight: '800', color: '#ffffff', fontSize: '1rem' }}>
                                    {mentor.name || mentor.displayName || 'Mentor'}
                                  </div>
                                  <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                                    {mentor.email}
                                  </div>
                                </div>
                                <span style={{
                                  background: 'rgba(255,255,255,0.08)',
                                  color: '#cbd5e1',
                                  fontSize: '0.75rem',
                                  fontWeight: '700',
                                  padding: '2px 8px',
                                  borderRadius: '12px'
                                }}>
                                  {assignedDels.length} Delegates
                                </span>
                              </div>

                              {/* Delegates List for this Mentor */}
                              <div style={{ marginTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.65rem' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                                  Delegates under {mentor.name || 'Mentor'}:
                                </div>

                                {assignedDels.length === 0 ? (
                                  <div style={{ fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic' }}>
                                    No delegates claimed yet.
                                  </div>
                                ) : (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                    {assignedDels.map(del => (
                                      <div 
                                        key={del.id}
                                        style={{
                                          background: 'rgba(0,0,0,0.2)',
                                          borderRadius: '8px',
                                          padding: '0.45rem 0.75rem',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'space-between',
                                          fontSize: '0.82rem'
                                        }}
                                      >
                                        <div>
                                          <span style={{ fontWeight: '700', color: '#f8fafc' }}>
                                            {del.name || del.displayName || 'Delegate'}
                                          </span>
                                          <span style={{ color: '#64748b', fontSize: '0.75rem', marginLeft: '6px' }}>
                                            ({del.stream || 'No Stream'})
                                          </span>
                                        </div>
                                        <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                                          {del.contactNo || del.email}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Section 2: Unallocated Delegates in this Committee */}
                  <div>
                    <h3 style={{ fontSize: '0.95rem', color: '#fca5a5', fontWeight: '700', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      ⚠️ Unallocated Delegates in {commName} ({commUnallocated.length})
                    </h3>

                    {commUnallocated.length === 0 ? (
                      <div style={{
                        background: 'rgba(34, 197, 94, 0.05)',
                        border: '1px solid rgba(34, 197, 94, 0.15)',
                        color: '#86efac',
                        borderRadius: '10px',
                        padding: '0.75rem',
                        fontSize: '0.82rem',
                        fontWeight: '600'
                      }}>
                        ✅ All delegates in {commName} are allocated to a mentor!
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
                        {commUnallocated.map(del => (
                          <div 
                            key={del.id}
                            style={{
                              background: 'rgba(239, 68, 68, 0.08)',
                              border: '1px solid rgba(239, 68, 68, 0.2)',
                              borderRadius: '12px',
                              padding: '0.75rem 1rem'
                            }}
                          >
                            <div style={{ fontWeight: '800', color: '#ffffff', fontSize: '0.9rem' }}>
                              {del.name || del.displayName || 'Delegate'}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
                              📧 {del.email}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#cbd5e1', marginTop: '6px' }}>
                              <span>Stream: <strong>{del.stream || 'N/A'}</strong></span>
                              <span>Contact: <strong>{del.contactNo || 'N/A'}</strong></span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Global Unallocated Delegates List */}
        {activeTab === 'unallocated' && (
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '20px',
            padding: '1.5rem'
          }}>
            <h2 style={{
              margin: '0 0 1.25rem 0',
              fontSize: '1.3rem',
              fontWeight: '800',
              color: '#f87171',
              fontFamily: "'Outfit', sans-serif",
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              ⚠️ All Unallocated Delegates Across Committees ({unallocatedDelegates.filter(filterUser).length})
            </h2>

            {unallocatedDelegates.filter(filterUser).length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem 1rem',
                color: '#86efac',
                fontSize: '1rem',
                fontWeight: '700'
              }}>
                🎉 Outstanding! Every registered delegate has been claimed by a mentor.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>
                      <th style={{ padding: '0.75rem' }}>Delegate Name</th>
                      <th style={{ padding: '0.75rem' }}>Committee</th>
                      <th style={{ padding: '0.75rem' }}>Stream</th>
                      <th style={{ padding: '0.75rem' }}>Email</th>
                      <th style={{ padding: '0.75rem' }}>Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unallocatedDelegates.filter(filterUser).map(del => (
                      <tr key={del.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '0.75rem', fontWeight: '800', color: '#ffffff' }}>
                          {del.name || del.displayName || 'Delegate'}
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          <span style={{
                            background: 'rgba(255,255,255,0.08)',
                            color: '#e2e8f0',
                            padding: '3px 8px',
                            borderRadius: '8px',
                            fontWeight: '700',
                            fontSize: '0.78rem'
                          }}>
                            {del.committee || 'Unassigned'}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem', color: '#cbd5e1' }}>
                          {del.stream || 'N/A'}
                        </td>
                        <td style={{ padding: '0.75rem', color: '#94a3b8' }}>
                          {del.email}
                        </td>
                        <td style={{ padding: '0.75rem', color: '#94a3b8' }}>
                          {del.contactNo || 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
