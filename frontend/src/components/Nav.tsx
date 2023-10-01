import { ERoutes } from "@/routing/routes/Routes.enum";

const Nav = () => {
  const links = Object.entries(ERoutes).map((route) => {
    return { label: route[0], link: route[1] };
  });

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        {links.map((l) => (
          <a
            className="btn btn-ghost normal-case text-xl"
            key={l.label}
            href={l.link}
          >
            {l.label}
          </a>
        ))}
      </div>
    </div>
  );
};

export default Nav;
