import React from "react";
import {IdMap, Ledger} from "../types";

interface Props {
    ledgers: IdMap<Ledger>;

    selectLedger(string): void,

}

export default function Component(props: Props) {
    const {ledgers, selectLedger} = props;
    return <>
        <div>
            select one ledger
            <ul>
                {Object.keys(ledgers).map((ledger_id) => {
                    const ledger = ledgers[ledger_id];
                    return <button key={ledger_id} type="submit" onClick={() => selectLedger(ledger_id)}>{ledger.name}</button>
                })}
            </ul>
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
