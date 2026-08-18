import { Component } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from './pages/Login';
import CompleteProfile from './pages/CompleteProfile';
import Profile from './pages/Profile';
import DelegateDashboard from './pages/delegate/DelegateDashboard';

import MentorDashboard from './pages/mentor/MentorDashboard';
import Notes from './pages/Notes';
import AdminPortal from './pages/AdminPortal';
import Footer from './components/Footer';
import './App.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', maxWidth: '600px', margin: '4rem auto', background: '#fff5f5', color: '#c53030', border: '1px solid #fed7d7', borderRadius: '8px', fontFamily: 'sans-serif' }}>
          <h2 style={{ marginBottom: '1rem' }}>Application Render Error</h2>
          <p style={{ fontWeight: 'bold', marginBottom: '1rem' }}>{this.state.error?.toString()}</p>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#fff', padding: '1rem', border: '1px solid #eee', borderRadius: '4px', fontSize: '0.85rem', overflowX: 'auto', maxHeight: '300px' }}>
            {this.state.error?.stack}
          </pre>
          <button onClick={() => window.location.reload()} style={{ marginTop: '1.5rem', padding: '0.5rem 1rem', background: '#c53030', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function AppRoutes() {
  return (
    <Routes>
      {/* Default /app route: redirect directly to main learning & video dashboard */}
      <Route path="/app" element={<Navigate to="/app/delegate" replace />} />
      <Route path="/app/login" element={<Login />} />
      <Route path="/app/notes" element={<Notes />} />
      <Route path="/app/delegate" element={<DelegateDashboard />} />
      <Route
        path="/app/complete-profile"
        element={
          <ProtectedRoute skipProfileCheck>
            <CompleteProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route path="/app/mentor" element={<MentorDashboard />} />
      <Route path="/app/adminportal" element={<AdminPortal />} />
      {/* Catch-all: redirect to /app */}
      <Route path="*" element={<Navigate to="/app" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1 }}>
              <AppRoutes />
            </div>
            <Footer />
          </div>
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
