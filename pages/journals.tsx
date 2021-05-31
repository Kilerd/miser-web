import {ProtectRoute} from "../contexts/auth";
import React, {useState} from "react";
import {useLedger} from "../contexts/ledger";
import AuthenticationLayout from "../components/AuthenticationLayout";
import NewTransactionModal from "../components/NewTransactionModal";
import EditTransactionModal from "../components/EditTransactionModal";
import {Button, HTMLTable} from "@blueprintjs/core";
import {useSWRInfinite} from "swr";
import {get} from "../api";
import TransactionLine from "../components/TransactionLine";
import {getUrlByTime} from "../utils/swr";
import {groupByDate} from "../utils/sort";

function Journals() {
  const {ledger_id,} = useLedger();

  const {
    data: patchTransactions,
    revalidate,
    setSize,
    size
  } = useSWRInfinite(getUrlByTime(`/ledgers/${ledger_id}/journals`, 'create_time'), get);

  const transactions = patchTransactions ? [].concat(...patchTransactions) : []
  const isEmpty = patchTransactions?.[0]?.length === 0;
  const isReachingEnd =
    isEmpty || (patchTransactions && patchTransactions[patchTransactions.length - 1]?.length < 1);


  const [newTrxStatus, setNewTrxStatus] = useState(false);

  const [editTrx, setEdit] = useState(undefined);
  const [editTrxStatus, setEditTrxStatus] = useState(false);
  const openEditTrxModal = (detail) => {
    setEdit(detail);
    setEditTrxStatus(true)
  };

  return (
    <>
      <AuthenticationLayout>
        <NewTransactionModal modalStatus={newTrxStatus} setModalStatus={setNewTrxStatus}/>
        <EditTransactionModal detail={editTrx} modalStatus={editTrxStatus} setModalStatus={setEditTrxStatus}/>

        <div className="container">
          <div className="header">
            <h1>Journals</h1>
            <div className="right">
              <Button onClick={() => setNewTrxStatus(true)} icon="insert"/>
              <Button onClick={revalidate} icon="refresh"/>
            </div>
          </div>

          <HTMLTable style={{width: "100%", borderCollapse: "collapse"}}>
            <thead>
            <tr>
              <th/>
              <th>Payee Narration</th>
              <th>Source</th>
              <th>Destination</th>
              <th style={{textAlign: "right"}}>Amount</th>
              <th/>
            </tr>
            </thead>
            <tbody>
            {groupByDate(transactions).map(trxByDate => {
                const [date, trxs] = trxByDate
                return trxs.map((one, idx) =>
                  <TransactionLine key={one.id} withDate={idx === 0} detail={one} setEdit={openEditTrxModal}/>)
              }
            )}
            </tbody>
          </HTMLTable>

          <div className="more">
            <Button icon="more" minimal disabled={isReachingEnd} onClick={() => setSize(size + 1)}/>
          </div>

        </div>
      </AuthenticationLayout>
      <style jsx>{`
        .header {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        }

        div.more {
          display: flex;
          justify-content: center;
          justify-items: center;
        }
      `}</style>
    </>
  )
}

export default ProtectRoute(Journals)
