import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role }: { children: React.ReactNode, role?: string | string[] }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (!token) {
    return <Navigate to="/login" />;
  }

  const allowedRoles = Array.isArray(role) ? role : role ? [role] : [];
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
