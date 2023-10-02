import { AuthStorage } from "@/api/auth/authStorage";

const useAuth = () => {
  const isAuth = AuthStorage.getAccessToken() ? true : false;

  return { isAuth };
};

export default useAuth;
