import React, { CSSProperties, KeyboardEvent } from "react";
import Link from "next/link";

interface Props {
  value: string[];

  onChange(value: string[]): void;
}

export default function TagsInput({ value, onChange }: Props) {
  const innerRef = React.createRef();
  const handleInput = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const newTags = [
        ...value,
        ...innerRef.current.innerText
          .split(",")
          .map((it) => it.trim())
          .filter((it) => it !== ""),
      ];
      onChange(newTags.filter((it, idx) => newTags.indexOf(it) === idx));
      innerRef.current.innerText = "";
    }
    console.log(event.key);
    if (event.key === "Backspace" && innerRef.current.innerText === "") {
      const newTags = [...value];
      newTags.pop();
      onChange(newTags);
    }
  };
  const handleClick = () => {
    innerRef.current.focus();
  };
  const deleteTag = (tag: string) => {
    onChange(value.filter((it) => it !== tag));
  };

  return (
    <>
      <div className="input" onClick={handleClick}>
        {value.map((tag) => (
          <span className="tag" key={tag}>
            <p>{tag}</p>
            <button className="remove" onClick={() => deleteTag(tag)}>
              <svg width="16" height="16" viewBox="0 0 16 16">
                <path
                  d="M9.41 8l2.29-2.29c.19-.18.3-.43.3-.71a1.003 1.003 0 00-1.71-.71L8 6.59l-2.29-2.3a1.003 1.003 0 00-1.42 1.42L6.59 8 4.3 10.29c-.19.18-.3.43-.3.71a1.003 1.003 0 001.71.71L8 9.41l2.29 2.29c.18.19.43.3.71.3a1.003 1.003 0 00.71-1.71L9.41 8z"
                  fillRule="evenodd"
                />
              </svg>
            </button>
          </span>
        ))}
        <div
          className="editable-span"
          ref={innerRef}
          contentEditable
          placeholder="Enter Tag"
          onKeyDown={(event) => handleInput(event)}
        />
      </div>

      <style jsx>{`
        div.input {
          cursor: text;
          padding: 0.56rem 0.5rem;
          border: 2px solid #dfe1e6;
          border-radius: 3px;
          background-color: transparent;
          outline: none;
          width: 100%;
          display: flex;
          flex-wrap: wrap;

          &:focus-within {
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

        span.tag {
          display: inline-flex;
          flex-direction: row;
          background-color: #2862b4;
          align-items: center;
          border: none;
          border-radius: 3px;
          -webkit-box-shadow: none;
          box-shadow: none;
          color: #f5f8fa;
          font-size: 12px;
          line-height: 16px;
          padding: 2px 2px 2px 6px;
          margin-right: 5px;

          p {
            margin: 0;
          }

          button {
            height: 16px;
            cursor: pointer;
            outline: none;
            background: transparent;
            border: none;
            margin: 0;
            padding: 0;

            svg {
              fill: #71a5f3;
            }

            &:hover {
              svg {
                fill: #c8d6ea;
              }
            }
          }
        }

        .editable-span {
          margin-top: 1px;
          display: inline-block;
          outline: none;
          min-width: 10px;
        }

        button.remove {
        }
      `}</style>
    </>
  );
}
