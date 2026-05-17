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
    console.warn(`Access denied for role: ${userRole}. Required: ${allowedRoles}`);
    if (profileComplete) {
      if (userRole === 'mentor') return <Navigate to="/app/mentor" replace />;
      if (userRole === 'delegate') return <Navigate to="/app/delegate" replace />;
      // If role is missing, redirect to login page where they can re-assert it
      console.warn("User has complete profile but missing role. Redirecting to login.");
      return <Navigate to="/app/login" replace />;
    }
    return <Navigate to="/app" />;
  }

  return children;
}
