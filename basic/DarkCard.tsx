import React from "react";
import classNames from "classnames";

interface Props {
  children: React.ReactElement[] | React.ReactElement;
  title: string;
}

export default function DarkCard({ children, title }: Props) {
  return (
    <>
      <div className={classNames("card", {})}>
        <div className="title">{title}</div>
        {children}
      </div>

      <style jsx>{`
        .card {
          width: 100%;
          padding: 2rem;
          border-radius: 4px;
          overflow: hidden;
          background-color: #f6f5f8;
          margin-bottom: 2rem;

          div.title {
            font-weight: 500;
            font-size: 1.2rem;
            margin-bottom: 2rem;
          }
        }
      `}</style>
    </>
  );
}

interface ContentProps {
  children: React.ReactElement[] | React.ReactElement;
}

export function DarkCardContent({ children }: ContentProps) {
  return <div>{children}</div>;
}
