import React from "react";
import Big from 'big.js';
import {show} from "@blueprintjs/core/lib/esnext/components/context-menu/contextMenu";

interface Props {
  prefix?: string,
  amount: Big,
  postfix?: string,
  color?: boolean,
  about?: boolean,
  size?: number
}

export default function Amount(props: Props) {

  let amountBig = Big(props.amount)
  const positive = amountBig.s === 1;

  const showColor = props.color || false;

  const colorCss = showColor ? positive ? "green" : "red" : "";
  const about = (props.about || false) ? "≈" : "";
  return <>
    <div className={`${colorCss} amount`}>
      <div>{about}{!positive && "-"}</div>
      <div>{props.prefix}</div>
      <div>{new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        maximumFractionDigits: 6, // (causes 2500.99 to be printed as $2,501)
      }).format(amountBig.abs(0).toFixed(2))}</div>

      {props.postfix &&
      <div className="currency">{props.postfix}</div>
      }

    </div>

    <style jsx>{`
      div.green {
        color: green !important;
      }

      div.red {
        color: red !important;
      }

      div.amount {
        font-family: monospace, serif;
        display: flex;
        flex-direction: row;
        color: #535353;
        align-items: baseline;
        justify-content: flex-end;
        font-size: ${props.size || 1}em;
        .currency {
          margin-left: 0.5rem;
        }
      }


    `}</style>
  </>
}
