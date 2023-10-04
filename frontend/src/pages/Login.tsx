import useAuth from "@/api/auth/useAuth";
import LoginForm from "@/components/LoginForm";
import { TEST_CREDENTIALS } from "@/consts";
import Center from "@/routing/abstract/Center";
import { ERoutes } from "@/routing/routes/Routes.enum";
import { Navigate } from "react-router-dom";

const Login = () => {
  const { data } = useAuth();

  if (data) {
    return <Navigate to={ERoutes.products} replace />;
  }

  return (
    <Center className="mt-32">
      <div>
        <p className="text-center text-4xl mb-24">
          Just click <b>Submit</b>
        </p>
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
      </div>
    </Center>
  );
};

export default Login;
