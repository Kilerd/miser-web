import React from "react";
import classNames from "classnames";

interface Props {
  children: React.ReactElement[];
  noPadding?: boolean;
}

export default function Card({ children, noPadding }: Props) {
  return (
    <>
      <div
        className={classNames("card", {
          padding: noPadding === undefined ? true : !noPadding,
        })}
      >
        {children}
      </div>

      <style jsx>{`
        .card {
          width: 100%;

          border-radius: 4px;
          box-shadow: 0 1px 1px rgb(9 30 66 / 25%), 0 0 1px 0 rgb(9 30 66 / 31%);
          overflow: hidden;
          background-color: #fff;
          grid-column: span 4;
        }

        .padding {
          padding: 1rem;
        }
      `}</style>
    </>
  );
}
