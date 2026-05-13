import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children, allowedRoles, skipProfileCheck }) {
  const { currentUser, userRole, profileComplete } = useAuth();

  if (!currentUser) {
    return <Navigate to="/app/login" />;
  }

  // Redirect to profile completion if not done yet (unless this IS the profile page)
  if (!skipProfileCheck && !profileComplete) {
    return <Navigate to="/app/complete-profile" />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/app" />;
  }

  return children;
}
