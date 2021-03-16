import {ProtectRoute, useAuth} from "../contexts/auth";
import {useAsync} from "react-async-hook";
import AuthenticationLayout from "../components/AuthenticationLayout";


function Page() {
  const authContextType = useAuth();
  return (
    <AuthenticationLayout>
      <div>
        hi, {authContextType.user.username}
      </div>
    </AuthenticationLayout>
  )
}


export default ProtectRoute(Page);
