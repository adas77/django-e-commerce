import { useRouteError } from "react-router-dom";

const Error = () => {
  type RouteError = {
    statusText?: string;
    message?: string;
  };
  const error = useRouteError() as RouteError;
  console.error(error);

  return (
    <div>
      <p>{error.message}</p>
      <p>{error.statusText}</p>
    </div>
  );
};

export default Error;
