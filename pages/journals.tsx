import { ProtectRoute } from "../contexts/auth";
import React, { useState } from "react";
import { useLedger } from "../contexts/ledger";
import AuthenticationLayout from "../components/AuthenticationLayout";
import NewTransactionModal from "../components/NewTransactionModal";
import EditTransactionModal from "../components/EditTransactionModal";
import { Button, HTMLTable } from "@blueprintjs/core";
import { useSWRInfinite } from "swr";
import { get } from "../api";
import TransactionLine from "../components/TransactionLine";
import { getUrlByTime } from "../utils/swr";
import { groupByDate } from "../utils/sort";
import TransactionDateGroup from "../components/TransactionDateGroup";

function Journals() {
  const { ledger_id } = useLedger();

  const {
    data: patchTransactions,
    revalidate,
    setSize,
    isValidating,
    size,
  } = useSWRInfinite(
    getUrlByTime(`/ledgers/${ledger_id}/journals`, "create_time"),
    get
  );

  const transactions = patchTransactions ? [].concat(...patchTransactions) : [];
  const isEmpty = patchTransactions?.[0]?.length === 0;
  const isReachingEnd =
    isEmpty ||
    (patchTransactions &&
      patchTransactions[patchTransactions.length - 1]?.length < 1);

  const refresh = () => {
    revalidate();
  };

  return (
    <>
      <AuthenticationLayout>
        <div className="container">
          <div className="header">
            <h1>Journals</h1>
            <div className="right">
              <Button onClick={refresh} minimal icon="refresh" />
            </div>
          </div>

          {groupByDate(transactions).map((trxByDate) => {
            const [date, trxs] = trxByDate;
            return <TransactionDateGroup date={date} items={trxs} />;
          })}

          <div className="more">
            <Button
              icon={isValidating ? "walk" : "more"}
              minimal
              disabled={isReachingEnd}
              onClick={() => setSize(size + 1)}
            />
          </div>
        </div>
      </AuthenticationLayout>
      <style jsx>{`
        .header {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
        }

        div.more {
          display: flex;
          justify-content: center;
          justify-items: center;
        }
      `}</style>
    </>
  );
}

export default ProtectRoute(Journals);
