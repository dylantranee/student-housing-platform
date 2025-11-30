import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const token = document.cookie.match(/access_token=([^;]+)/);
  if (!token) return <Navigate to="/login" />;
  return children;
}
