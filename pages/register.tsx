import {useState} from "react";
import {useAuth} from "../contexts/auth";
import {useRouter} from "next/router";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const authContextType = useAuth();
  const router = useRouter();

  async function handleLogin() {
    let any = await authContextType.register(email, username, password);
    await router.push("/")
  }

  return (
    <div>
      {email}
      <input type="text" value={email} onChange={e => setEmail(e.target.value)}/>
      <input type="text" value={username} onChange={e => setUsername(e.target.value)}/>
      <input type="password" value={password} onChange={e => setPassword(e.target.value)}/>
      <button onClick={handleLogin}>login</button>
    </div>
  )
}


export default Register