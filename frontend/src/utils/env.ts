import { cleanEnv, url } from "envalid";

const env = cleanEnv(import.meta.env, {
  VITE_REST_ENDPOINT: url({ desc: "e-commerce REST endpoint" }),
});

export default env;
