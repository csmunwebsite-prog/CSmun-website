import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from './pages/Login';
import CompleteProfile from './pages/CompleteProfile';
import Profile from './pages/Profile';
import DelegateDashboard from './pages/delegate/DelegateDashboard';
import MentorDashboard from './pages/mentor/MentorDashboard';
import './App.css';

function AppRoutes() {
  const { currentUser, userRole, profileComplete } = useAuth();

  return (
    <Routes>
      {/* Default /app route: smart redirect based on auth & profile state */}
      <Route
        path="/app"
        element={
          !currentUser ? (
            <Navigate to="/app/login" replace />
          ) : !profileComplete ? (
            <Navigate to="/app/complete-profile" replace />
          ) : userRole === 'mentor' ? (
            <Navigate to="/app/mentor" replace />
          ) : (
            <Navigate to="/app/delegate" replace />
          )
        }
      />
      <Route path="/app/login" element={<Login />} />
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
