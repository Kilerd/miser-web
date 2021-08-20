import React, { CSSProperties } from "react";
import Link from "next/link";

interface Props {
  type?: "text" | "password";
  placeholder?: string;
  value: string;

  onChange(value: string): void;
}

export default function Input({ type, placeholder, value, onChange }: Props) {
  return (
    <>
      <div>
        <input
          type={type || "text"}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>

      <style jsx>{`
        input {
          padding: 0.7rem 0.5rem;
          border: 2px solid #dfe1e6;
          border-radius: 3px;
          background-color: transparent;
          outline: none;
          width: 100%;

          &:focus {
            border-color: rgb(0, 82, 204);
            transition: border-color linear 0.1s;

            &:hover {
              border-color: rgb(0, 82, 204);
              transition: border-color linear 0.1s;
            }
          }

          &:hover {
            border-color: rgb(0, 82, 204, 0.3);
            transition: border-color linear 0.1s;
          }
        }
      `}</style>
    </>
  );
}
