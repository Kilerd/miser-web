import {useState} from "react";
import {useAuth} from "../contexts/auth";
import {useRouter} from "next/router";
import Link from "next/link";
import {Button} from "@blueprintjs/core";
import {BASE_URL} from "../api";


const loginTab = (myUrl): Promise<string> => {
  const windowArea = {
    width: Math.floor(window.outerWidth * 0.8),
    height: Math.floor(window.outerHeight * 0.5),
    left: 0,
    top: 0
  };

  if (windowArea.width < 1000) {
    windowArea.width = 1000;
  }
  if (windowArea.height < 630) {
    windowArea.height = 630;
  }
  windowArea.left = Math.floor(window.screenX + ((window.outerWidth - windowArea.width) / 2));
  windowArea.top = Math.floor(window.screenY + ((window.outerHeight - windowArea.height) / 8));

  const sep = (myUrl.indexOf('?') !== -1) ? '&' : '?';
  const url = `${myUrl}${sep}`;
  const windowOpts = `toolbar=0,scrollbars=1,status=1,resizable=1,location=1,menuBar=0,
    width=${windowArea.width},height=${windowArea.height},
    left=${windowArea.left},top=${windowArea.top}`;

  const authWindow = window.open(url, '_blank', windowOpts);
  // Create IE + others compatible event handler
  return new Promise((resolve, rejects) => {
    authWindow.addEventListener("message", (e) => {
      if (e.origin.startsWith(window.location.origin) && e.data.token === true) {
        let token = e.data.data;
        authWindow.close();
        resolve(token);
      }
    }, false)
  })


};


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const authContextType = useAuth();
  const router = useRouter();

  async function handleLogin() {
    await authContextType.login(email, password);
    await router.push("/dashboard");
  }

  async function handleGithubLogin() {
    let token = await loginTab(`${BASE_URL}/oauth/github`)
    await authContextType.loginWithToken(token);
  }

  return (
    <>
      <div className="login-register-form">
        <div className="title">Login</div>
        <p className="recommendation">Thank you for getting back to Miser</p>
        <label htmlFor="email" className="input">Email</label>
        <input type="text" placeholder="Email" id="email" className="input" value={email}
               onChange={e => setEmail(e.target.value)}/>

        <label htmlFor="password" className="input">Password</label>
        <input type="password" placeholder="Password" id="password" className="input" value={password}
               onChange={e => setPassword(e.target.value)}/>

        <button className="button" onClick={handleLogin}>Sign in</button>

        <p className="tips">Don't have an account yet? <Link href="/register">Join Us</Link></p>
        <p><Button onClick={handleGithubLogin}>Login In with Github</Button></p>
      </div>


      <style jsx>{`

        div.login-register-form {
          display: flex;
          flex-direction: column;
        }

        div.title {
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }

        p.recommendation {
          margin-bottom: 4rem;
          font-size: 1rem;
          color: #aaa;
        }
      `}</style>
    </>

  )
}


export default Login
