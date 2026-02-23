import React from 'react';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }: { children: React.ReactElement }) {
  const token = document.cookie.match(/access_token=([^;]+)/);
  if (!token) return <Navigate to="/login" />;
  return children;
}
