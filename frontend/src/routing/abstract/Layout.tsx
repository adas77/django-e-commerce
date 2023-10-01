import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import useAuth from "@/hooks/useAuth/useAuth";
import { Navigate, Outlet } from "react-router-dom";
import { ERoutes } from "../routes/Routes.enum";

const Layout = () => {
  const { isAuth } = useAuth();

  if (!isAuth) {
    return <Navigate to={ERoutes.login} replace />;
  }

  return (
    <div className="flex h-screen flex-col justify-between">
      <Nav />
      <main className="mb-auto">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
