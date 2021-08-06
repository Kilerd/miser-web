import React, { CSSProperties } from "react";
import Link from "next/link";

interface Props {
  value: string;
  link: string;
  style?: CSSProperties;
}

export default function LinkTag({ value, link, style }: Props) {
  return (
    <>
      <Link href={link}>
        <span style={style}>{value}</span>
      </Link>

      <style jsx>{`
        span {
          margin: 0 0.2rem;
          border-bottom: 1px dotted #000;

          :hover {
            cursor: pointer;
            border-bottom: 1px solid rgb(0, 82, 204);
            color: rgb(0, 82, 204);
          }
        }
      `}</style>
    </>
  );
}
