import { AuthStorage } from "@/api/auth/authStorage";
import { ERoutesDetail } from "@/routing/routes/Routes.enum";
import { AxiosError, AxiosResponse } from "axios";

export const responseSuccessInterceptor = (response: AxiosResponse) => response;

export const responseFailureInterceptor = async (error: AxiosError) => {
  if (error.response && error.response.status === 401) {
    AuthStorage.clear();
    if (window.location.pathname !== ERoutesDetail.login) {
      window.location.replace(ERoutesDetail.login);
    }
  }
  return Promise.reject(error);
};
