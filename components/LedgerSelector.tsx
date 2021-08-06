import Link from "next/link";
import React from "react";
import { IdMap, Ledger } from "../types";

interface Props {
  ledgers: IdMap<Ledger>;

  selectLedger(string): void;
}

export default function Component(props: Props) {
  const { ledgers, selectLedger } = props;
  return (
    <>
      <div>
        select one ledger
        <ul>
          {Object.keys(ledgers).map((ledger_id) => {
            const ledger = ledgers[ledger_id];
            return (
              <button
                key={ledger_id}
                type="submit"
                onClick={() => selectLedger(ledger_id)}
              >
                {ledger.name}
              </button>
            );
          })}
        </ul>
        <Link href="/ledgers"> goto create a ledger</Link>
      </div>
    </>
  );
}
