import React from "react";
import clsx from "clsx";
type Props = {
  children: React.ReactNode;
  className?: string;
};
const Center = ({ children, className }: Props) => {
  return (
    <div className={clsx("grid place-items-center", className)}>{children}</div>
  );
};

export default Center;
