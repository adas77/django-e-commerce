// import { AuthStorage } from "@/api/auth/authStorage";

const useAuth = () => {
  // const isAuth = AuthStorage.getAccessToken() ? true : false;

  // FIXME: remove
  const isAuth = true;
  return { isAuth };
  //

  // return { isAuth };
};

export default useAuth;
