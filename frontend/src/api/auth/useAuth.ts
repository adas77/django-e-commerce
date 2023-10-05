import restClient from "@/api/rest";
import jwt_decode from "jwt-decode";
import { z } from "zod";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { AuthStorage } from "./authStorage";
import { LoginCredentials } from "@/components/LoginForm";
import { ERoutesDetail } from "@/routing/routes/Routes.enum";

export const userResponseSchemaValidator = z.object({
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
}

type State = {
  user: UserResponseSchema;
};

type Action = {
  authenticate: (token: string) => Promise<void>;
  logout: () => void;
  isAuth: () => boolean;
};

const useAuth = create<State & Action>(
  devtools(
    persist(
      (set) => ({
        user: null,
        authenticate: (token) => {
          const decodedToken: { [key: string]: unknown } = jwt_decode(token);
          const validatedUser =
            userResponseSchemaValidator.safeParse(decodedToken);

          if (validatedUser.success) {
            set({ user: validatedUser.data });
          }
        },
        logout: () => {
          AuthStorage.removeAccessToken();
          AuthStorage.removeRefreshToken();
          set({ user: {} });
          if (window.location.pathname !== ERoutesDetail.login) {
            window.location.replace(ERoutesDetail.login);
          }
        },
        isAuth: () => {
          return !!AuthStorage.getAccessToken();
        },
      }),
      {
        name: "__AUTH_DATA__",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);

export default useAuth;
