import { cleanEnv, str, url } from "envalid";

const env = cleanEnv(import.meta.env, {
  VITE_REST_ENDPOINT: url({ desc: "e-commerce REST endpoint" }),
  VITE_AUTH_ACCESS_TOKEN_KEY: str({ desc: "Access token key" }),
});

export default env;
