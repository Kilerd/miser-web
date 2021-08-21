import * as React from "react";

interface Props {
  message?: string;
}

const LoadingPage = ({ message }: Props) => {
  return (
    <>
      <div className="center">
        <img src="/images/integration.svg" alt="logo" className="logo" />
        <p>{message || "Loading..."}</p>
      </div>

      <style jsx>{`
        div.center {
          width: 100vw;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          img {
            width: 300px;
          }
          p {
            font-size: 1.5rem;
            font-weight: 500;
          }
        }
      `}</style>
    </>
  );
};

export default LoadingPage;
