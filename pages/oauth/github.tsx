import React from "react";
import {useRouter} from "next/router";
import {useAsync} from "react-async-hook";
import api from "../../api";
import {Simulate} from "react-dom/test-utils";


function GithubCallback() {

  let router = useRouter();
  const {code, state} = router.query;
  console.log(code, state);

  if (code === undefined || state === undefined) {
    return (<div>error</div>)
  }

  const {result, loading, error} = useAsync(async () => {
    let ret = await api.github_auth(code, state);
    let message = ret.data.data;
    console.log("token", message);
    console.log("to", window.location.origin);
    window.postMessage({
      token: true,
      data: message
    }, window.location.origin);

  }, [code, state])


  return (
    <div className="container">
      {loading ?
        <div>login....</div>
        :
        error ?
          <div>{error}</div>
          :
          <div>1</div>
      }
    </div>
  )
}


export default GithubCallback
