// src/components/PrivateRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProfilePage from "../pages/ProfilePage.jsx";

const PrivateRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Загрузка...</div>;

  return user ? <ProfilePage /> : <Navigate to="/login" />;
};

export default PrivateRoute;