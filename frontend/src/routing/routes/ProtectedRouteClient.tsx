import useAuth from "@/api/auth/useAuth";
import { Navigate, Outlet } from "react-router-dom";
import { ERoutesDetail } from "./Routes.enum";

const ProtectedRouteClient = () => {
  const { data: sessionData, isLoading } = useAuth();
  if (isLoading) return <p>...</p>;
  return sessionData && sessionData.role_name === "Client" ? (
    <Outlet context={sessionData} />
  ) : (
    <Navigate to={ERoutesDetail.login} />
  );
};

export default ProtectedRouteClient;
