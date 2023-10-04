import { ERoutes, ERoutesDetail } from "@/routing/routes/Routes.enum";
import { Button } from "./ui/button";
import { AuthStorage } from "@/api/auth/authStorage";
import useAuth from "@/api/auth/useAuth";

const Nav = () => {
  const { data: sessionData } = useAuth();

  const links = Object.entries(ERoutes).map((route) => {
    return { label: route[0], link: route[1] };
  });

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1 justify-center gap-8">
        {links.map((l) => (
          <a
            className="btn btn-ghost normal-case text-xl"
            key={l.label}
            href={l.link}
          >
            {l.label}
          </a>
        ))}
        {sessionData ? (
          <div className="flex justify-center gap-2">
            <Button disabled>{sessionData.email}</Button>
            <Button disabled>{sessionData.role_name}</Button>
            <Button onClick={() => AuthStorage.logout()}>LOGOUT</Button>
          </div>
        ) : (
          <Button>
            <a href={ERoutesDetail.login}>LOGIN</a>
          </Button>
        )}
      </div>
    </div>
  );
};

export default Nav;
