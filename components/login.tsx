import {useState} from "react";
import {useAuth} from "../contexts/auth";
import {useRouter} from "next/router";
import Link from "next/link";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const authContextType = useAuth();
  const router = useRouter();

  async function handleLogin() {
    let any = await authContextType.login(email, password);
    await router.push("/dashboard");
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
      </div>


      <style jsx>{`
        
        div.login-register-form {
          display: flex;
          flex-direction: column;
        }
        div.title {
          font-size: 1.5rem;
          margin-bottom:1rem;
        }
        p.recommendation {
          margin-bottom:4rem;
          font-size:1rem;
          color: #aaa;
        }
        `}</style>
    </>

  )
}


export default Login
