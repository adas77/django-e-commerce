import useAuth from "@/api/auth/useAuth";
import { ERoutes, ERoutesDetail } from "@/routing/routes/Routes.enum";
import { Button } from "./ui/button";

const Nav = () => {
  const { isAuth, user, logout } = useAuth();
  const links: {
    label: string;
    link: ERoutes;
  }[] = Object.entries(ERoutes)
    .filter(
      (route) =>
        !(user && user.role_name !== "Client" && route[1] === ERoutes.orders) &&
        !(
          user &&
          user.role_name !== "Seller" &&
          route[1] === ERoutes.products_stats
        )
    )
    .map((route) => {
      return { label: route[0].toUpperCase(), link: route[1] };
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
        {isAuth() ? (
          <div className="flex justify-center gap-2">
            <Button disabled>{user.email}</Button>
            <Button disabled>{user.role_name}</Button>
            <Button className="text-xl" onClick={() => logout()}>
              LOGOUT
            </Button>
          </div>
        ) : (
          <Button>
            <a className="text-xl" href={ERoutesDetail.login}>
              LOGIN
            </a>
          </Button>
        )}
      </div>
    </div>
  );
};

export default Nav;
