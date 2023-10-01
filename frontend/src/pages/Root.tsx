import env from "@/utils/env";

const Root = () => {
  return (
    <div>
      <p>Root</p>
      <p>{env.VITE_REST_ENDPOINT}</p>
    </div>
  );
};

export default Root;
