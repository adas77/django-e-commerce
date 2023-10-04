import Nav from "@/components/Nav";
import { Toaster } from "@/components/ui/toaster";
import { Outlet } from "react-router-dom";
const Layout = () => {
  return (
    <div className="flex h-screen flex-col justify-between">
      <Nav />
      <main className="mb-auto">
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
};

export default Layout;
