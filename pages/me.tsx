import * as React from 'react';
import {ProtectRoute, useAuth} from "../contexts/auth";
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
