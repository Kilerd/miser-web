import React from "react";
import classNames from "classnames";

interface Props {
  children: React.ReactElement[] | React.ReactElement;
}

export default function Card({ children }: Props) {
  return (
    <>
      <div className={classNames("card", {})}>{children}</div>

      <style jsx>{`
        .card {
          width: 100%;

          border-radius: 4px;
          box-shadow: 0 1px 1px rgb(9 30 66 / 25%), 0 0 1px 0 rgb(9 30 66 / 31%);
          overflow: hidden;
          background-color: #fff;
          grid-column: span 4;
        }
      `}</style>
    </>
  );
}

interface HeaderProps {
  children: React.ReactElement[] | React.ReactElement;
}

export function CardHeader({ children }: HeaderProps) {
  return (
    <>
      <div>{children}</div>

      <style jsx>{`
        div {
          padding: 1rem;
          border-bottom: 1px solid #dadada;
        }
      `}</style>
    </>
  );
}

export function CardContent({ children }: Props) {
  return <div>{children}</div>;
}
