import { AuthStorage } from "@/api/auth/authStorage";
import { AxiosRequestHeaders, InternalAxiosRequestConfig } from "axios";

export const requestSuccessInterceptor = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  const token = AuthStorage.getAccessToken();
  if (token) {
    return {
      ...config,
      withCredentials: true,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      } as AxiosRequestHeaders,
    };
  }
  return config;
};
