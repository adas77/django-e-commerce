import LoginForm from "@/components/LoginForm";
import { TEST_CREDENTIALS } from "@/consts";
import useAuth from "@/hooks/useAuth/useAuth";
import Center from "@/routing/abstract/Center";
import { ERoutes } from "@/routing/routes/Routes.enum";
import { Navigate } from "react-router-dom";

const Login = () => {
  const { isAuth } = useAuth();

  if (isAuth) {
    return <Navigate to={ERoutes.root} replace />;
  }

  return (
    <Center>
      <div className="flex gap-32">
        <LoginForm
          defaultUsername={TEST_CREDENTIALS.username_client}
          defaultPassword={TEST_CREDENTIALS.password}
          title={"to list products, and create orders"}
        />
        <LoginForm
          defaultUsername={TEST_CREDENTIALS.username_seller}
          defaultPassword={TEST_CREDENTIALS.password}
          title={"to modify products and see statistics"}
        />
      </div>
    </Center>
  );
};

export default Login;
