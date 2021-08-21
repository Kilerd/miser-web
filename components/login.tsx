import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@blueprintjs/core";
import { useAuth } from "../contexts/auth";
import { BASE_URL } from "../api";
import Card from "../basic/Card";
import Input from "../basic/Input";

const loginTab = (myUrl): Promise<string> => {
  const windowArea = {
    width: Math.floor(window.outerWidth * 0.8),
    height: Math.floor(window.outerHeight * 0.5),
    left: 0,
    top: 0,
  };

  if (windowArea.width < 1000) {
    windowArea.width = 1000;
  }
  if (windowArea.height < 630) {
    windowArea.height = 630;
  }
  windowArea.left = Math.floor(
    window.screenX + (window.outerWidth - windowArea.width) / 2
  );
  windowArea.top = Math.floor(
    window.screenY + (window.outerHeight - windowArea.height) / 8
  );

  const sep = myUrl.indexOf("?") !== -1 ? "&" : "?";
  const url = `${myUrl}${sep}`;
  const windowOpts = `toolbar=0,scrollbars=1,status=1,resizable=1,location=1,menuBar=0,
    width=${windowArea.width},height=${windowArea.height},
    left=${windowArea.left},top=${windowArea.top}`;

  const authWindow = window.open(url, "_blank", windowOpts);
  // Create IE + others compatible event handler
  return new Promise((resolve, rejects) => {
    authWindow.addEventListener(
      "message",
      (e) => {
        if (
          e.origin.startsWith(window.location.origin) &&
          e.data.token === true
        ) {
          let token = e.data.data;
          authWindow.close();
          resolve(token);
        }
      },
      false
    );
  });
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const authContextType = useAuth();
  const router = useRouter();

  const disabled = email === "" || password === "";

  async function handleLogin() {
    await authContextType.login(email, password);
    await router.push("/dashboard");
  }

  async function handleGithubLogin() {
    const token = await loginTab(`${BASE_URL}/oauth/github`);
    await authContextType.loginWithToken(token);
  }

  return (
    <>
      <div className="center">
        <div className="login">
          <Card padding={2}>
            <div className="logo">
              <img src="/images/welcome.svg" alt="logo" className="logo" />
            </div>
            <div className="form">
              <div className="line">
                <Input
                  type="text"
                  value={email}
                  onChange={setEmail}
                  placeholder="Enter Email"
                />
              </div>
              <div className="line">
                <Input
                  type="password"
                  value={password}
                  onChange={setPassword}
                  placeholder="Enter password"
                />
              </div>

              <button
                className="button"
                disabled={disabled}
                onClick={handleLogin}
              >
                Sign in
              </button>
            </div>
            <div className="more">
              <p className="tips">
                Don't have an account yet? <Link href="/register">Join Us</Link>
              </p>
            </div>
            <div className="more">
              <Button onClick={handleGithubLogin}>Login In with Github</Button>
            </div>
          </Card>
        </div>
      </div>

      <style jsx>{`
        div.center {
          width: 100vw;
          min-height: 100vh;
          display: flex;
          align-items: center;
        }

        div.login {
          width: 350px;
          margin: 0 auto;
        }

        div.logo {
          width: 100%;

          display: flex;
          justify-content: center;
        }

        div.form {
          display: flex;
          flex-direction: column;

          div.line {
            margin-bottom: 1.5rem;
          }
        }
      `}</style>
    </>
  );
};

export default Login;
