import React from "react";
import TransactionLine from "./TransactionLine";
import dayjs from "dayjs";
import {Button, Card, Divider, Elevation} from "@blueprintjs/core";


export default function TransactionGroup({date, items, setEditId}) {

  const lines = items.map((one) => (<TransactionLine key={one.id} {...one} setEditId={setEditId}/>))

  const isToday = dayjs().isSame(dayjs(date), "day");

  return (
    <>


      <div className="group">
        <div className="head">
          {isToday ?
            <h2>Today <span>{date}</span></h2>
            :
            <h2>{date}</h2>
          }
        </div>

        <div className="lines">
          {lines}
        </div>

      </div>

      <style jsx>{`
        .group {
          display: flex;
          flex-direction: column;
          margin-bottom: 1rem;

          .head {
            padding-left: 0.5rem;

            h2 {
              font-weight: normal;
              font-size: 1.2rem;

              span {
                font-size: 0.95rem;
                color: #b1b1b1;
              }
            }
          }

          .lines {
            color: #2E3033;
          }
        }
      `}</style>
    </>
  )
}
