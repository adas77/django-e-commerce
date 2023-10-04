import restClient from "@/api/rest";
import { LoginCredentials } from "@/components/LoginForm";
import { EQueryKeys } from "@/utils/queryClient/QueryKeys.enum";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { AuthStorage } from "./authStorage";

const userResponseSchemaValidator = z.object({
  username: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
  role_name: z.optional(z.enum(["Seller", "Client"])),
});
export type UserResponseSchema = z.infer<typeof userResponseSchemaValidator>;

export async function login(credentials: LoginCredentials) {
  const data = (await restClient.post(`/token/`, credentials)).data;
  AuthStorage.setAccessToken(data.access);
  AuthStorage.setRefreshToken(data.refresh);
  const me = await getMe();
  return me;
}
async function getMe(): Promise<UserResponseSchema> {
  const res = (await restClient.get(`/me`)).data;
  const user = userResponseSchemaValidator.parse(res);
  return user;
}

const useAuth = () => {
  return useQuery({ queryKey: [EQueryKeys.me], queryFn: getMe });
};

export default useAuth;
