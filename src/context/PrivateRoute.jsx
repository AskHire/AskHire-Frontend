import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';


const PrivateRoute = ({ children, roleRequired }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (roleRequired && currentUser.role !== roleRequired) {
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
};

export default PrivateRoute;