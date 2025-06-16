import { ReactNode, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user, loading } = useAuth();
  useEffect(() => {}, [user]);
  if(loading) return <div>loading...</div>
  return user ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRoute;


// in react , children is a special prop that represents whatever is inside a component when you use it.