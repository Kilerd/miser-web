import {ProtectRoute, useAuth} from "../contexts/auth";
import React from "react";
import {useRouter} from "next/router";

const Client = () => {
  const router = useRouter();
  const authContextType = useAuth();

  authContextType.logout();

  router.push("/")

  return (<div>
    logout
  </div>)
}


export default ProtectRoute(Client)
// export default Client