import React from "react";
import Big from 'big.js';

interface Props {
  prefix?: string,
  amount: Big,
  currency: string,
}

export default function Amount(props: Props) {

  let amountBig = Big(props.amount)
  return <>
    <div className="amount">
      <div className="prefix">{props.prefix}</div>
      <div className="amount">{new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        maximumFractionDigits: 6, // (causes 2500.99 to be printed as $2,501)
      }).format(amountBig.toFixed(2))}</div>
      <div className="currency">{props.currency}</div>
    </div>

    <style jsx>{`
      div.amount {
        font-family: monospace, serif;
        display: flex;
        flex-direction: row;
        color: #535353;
        align-items: baseline;

        .amount {
          font-size: 1.1rem;
        }

        .currency {
          margin-left: 0.5rem;
        }
      }
    `}</style>
  </>
}
