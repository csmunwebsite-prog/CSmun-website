import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from './pages/Login';
import DelegateDashboard from './pages/delegate/DelegateDashboard';
import MentorDashboard from './pages/mentor/MentorDashboard';
import './App.css';

function AppRoutes() {
  const { currentUser, userRole } = useAuth();

  return (
    <Routes>
      {/* Default /app route: if logged in, redirect to dashboard; else show login */}
      <Route
        path="/app"
        element={
          currentUser ? (
            <Navigate to={userRole === 'mentor' ? '/app/mentor' : '/app/delegate'} replace />
          ) : (
            <Navigate to="/app/login" replace />
          )
        }
      />
      <Route path="/app/login" element={<Login />} />
      <Route
        path="/app/delegate"
        element={
          <ProtectedRoute allowedRoles={['delegate']}>
            <DelegateDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/mentor"
        element={
          <ProtectedRoute allowedRoles={['mentor']}>
            <MentorDashboard />
          </ProtectedRoute>
        }
      />
      {/* Catch-all: redirect to /app */}
      <Route path="*" element={<Navigate to="/app" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
