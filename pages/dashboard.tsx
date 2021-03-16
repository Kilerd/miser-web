import {ProtectRoute, useAuth} from "../contexts/auth";
import {connect} from 'react-redux'
import {State} from "../store";
import React from "react";
import AuthenticationLayout from "../components/AuthenticationLayout";


function Dashboard(state: State) {

  const {user} = useAuth();
  return (
    <AuthenticationLayout>
      <div>hello {user.username}</div>
    </AuthenticationLayout>
  )
}


export default connect(state => state)(ProtectRoute(Dashboard))
