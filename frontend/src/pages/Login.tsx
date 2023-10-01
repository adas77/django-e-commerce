import useAuth from "@/hooks/useAuth/useAuth";
import { ERoutes } from "@/routing/routes/Routes.enum";
import { Navigate } from "react-router-dom";

const Login = () => {
  const { isAuth } = useAuth();

  if (isAuth) {
    return <Navigate to={ERoutes.root} replace />;
  }

  return (
    <>
      <p>Login</p>
      <button>Log In</button>
    </>
  );
};

export default Login;
