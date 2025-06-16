import { ReactNode, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

interface PublicRouteProps {
  children: ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { user } = useAuth();
  useEffect(() => {}, [user]);

  return user ? <Navigate to="/" /> : <>{children}</>;
};

export default PublicRoute;
