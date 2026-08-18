import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { currentUser, userData, userRole, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/app/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <nav className="app-navbar">
      <div className="app-navbar-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0.75rem 1.5rem' }}>
        <Link to="/app" className="app-nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <img src="/assets/logo.png" alt="CSMUN Logo" className="app-nav-logo" style={{ height: '36px' }} />
          <span className="app-nav-brand-text" style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1a1d2b' }}>CS<span style={{ color: '#8b1e1e' }}>MUN</span> Portal</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <a href="/#committees" style={{ color: '#3a3f52', fontWeight: '600', textDecoration: 'none', fontSize: '0.95rem' }}>Committees</a>
          <a href="/#videos" style={{ color: '#3a3f52', fontWeight: '600', textDecoration: 'none', fontSize: '0.95rem' }}>Training Videos</a>
          <a href="/resources.html" style={{ color: '#3a3f52', fontWeight: '600', textDecoration: 'none', fontSize: '0.95rem' }}>Resources</a>
          <Link to="/app/notes" style={{ color: '#3a3f52', fontWeight: '600', textDecoration: 'none', fontSize: '0.95rem' }}>Notes</Link>

          {currentUser ? (
            <div className="app-nav-profile-container" ref={dropdownRef} style={{ position: 'relative' }}>
              <button 
                className="app-nav-profile-trigger" 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <img 
                  src={currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.name || userData?.certificateName || currentUser.displayName || 'User')}`} 
                  alt="Profile" 
                  className="app-nav-avatar" 
                />
                <span className="app-nav-user-name">
                  {(userData?.name || userData?.certificateName || currentUser.displayName || 'Account').split(' ')[0]}
                </span>
                <span className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}>▼</span>
              </button>

          {isDropdownOpen && (
            <div className="app-profile-dropdown">
              <div className="dropdown-header">
                <p className="dropdown-user-name">{userData?.name || userData?.certificateName || currentUser.displayName || 'User'}</p>
                <p className="dropdown-user-email">{currentUser.email}</p>
              </div>
              <div className="dropdown-divider"></div>
              <div className="dropdown-info">
                <div className="info-item">
                  <span className="info-label">Role:</span>
                  <span className="info-value role-tag">{userRole?.toUpperCase() || 'NOT SET'}</span>
                </div>
                {userData?.grade && (
                  <div className="info-item">
                    <span className="info-label">Grade:</span>
                    <span className="info-value">{userData.grade}</span>
                  </div>
                )}
              </div>
              <div className="dropdown-divider"></div>
              <ul className="dropdown-links">
                <li>
                  <Link to="/app/profile" onClick={() => setIsDropdownOpen(false)}>
                    <span className="link-icon">👤</span> My Profile
                  </Link>
                </li>
                {userRole === 'delegate' && (
                  <li>
                    <Link to="/app/delegate" onClick={() => setIsDropdownOpen(false)}>
                      <span className="link-icon">📊</span> Dashboard
                    </Link>
                  </li>
                )}
                {userRole === 'mentor' && (
                  <li>
                    <Link to="/app/mentor" onClick={() => setIsDropdownOpen(false)}>
                      <span className="link-icon">📊</span> Dashboard
                    </Link>
                  </li>
                )}
                <li>
                  <button onClick={handleLogout} className="dropdown-logout-btn">
                    <span className="link-icon">🚪</span> Log Out
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
