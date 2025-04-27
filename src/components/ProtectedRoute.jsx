import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute({ element }) {
  const location = useLocation();
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (location.pathname.startsWith('/teacher') && role !== 'TEACHER') {
    return <Navigate to="/" replace />;
  }
  if (location.pathname.startsWith('/student') && role !== 'STUDENT') {
    return <Navigate to="/" replace />;
  }

  return element;
}

export default ProtectedRoute;
