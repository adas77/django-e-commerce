import useAuth from "@/api/auth/useAuth";
import { Navigate, Outlet } from "react-router-dom";
import { ERoutesDetail } from "./Routes.enum";

const ProtectedRouteSeller = () => {
  const { user } = useAuth();
  return user && user.role_name === "Seller" ? (
    <Outlet />
  ) : (
    <Navigate to={ERoutesDetail.login} />
  );
};

export default ProtectedRouteSeller;
