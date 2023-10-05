import useAuth from "@/api/auth/useAuth";
import { Navigate, Outlet } from "react-router-dom";
import { ERoutesDetail } from "./Routes.enum";

const ProtectedRouteClient = () => {
  const { user } = useAuth();
  return user && user.role_name === "Client" ? (
    <Outlet />
  ) : (
    <Navigate to={ERoutesDetail.login} />
  );
};

export default ProtectedRouteClient;
