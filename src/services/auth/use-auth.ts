import { useContext } from "react";
import { AuthContext } from "./auth-context";
import { RoleEnum } from "../api/types/role";
import { User } from "../api/types/user";

function useAuth() {
  return useContext(AuthContext);
}
export function isAdminUser(user: User | null) {
  return user?.role?.id === RoleEnum.ADMIN;
}
export default useAuth;
