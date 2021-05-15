import {ProtectRoute} from "../contexts/auth";
import React, {useState} from "react";
import {useLedger} from "../contexts/ledger";
import AuthenticationLayout from "../components/AuthenticationLayout";
import NewTransactionModal from "../components/NewTransactionModal";
import EditTransactionModal from "../components/EditTransactionModal";
import {Button, HTMLTable, Spinner} from "@blueprintjs/core";
import {useSWRInfinite} from "swr";
import {get} from "../api";
import TransactionLine from "../components/TransactionLine";
import {getUrlByTime} from "../utils/swr";


function Journals() {
  const {ledger_id,} = useLedger();

  const {isValidating, data: transactions, revalidate, setSize, size} = useSWRInfinite(getUrlByTime(`/ledgers/${ledger_id}/journals`, 'create_time'), get);

  const [newTrxStatus, setNewTrxStatus] = useState(false);

  const [editId, setEditId] = useState(null);
  const [editTrxStatus, setEditTrxStatus] = useState(false);
  const openEditTrxModal = (id) => {
    setEditId(id);
    setEditTrxStatus(true)
  };

  return (
    <>
      <AuthenticationLayout>
        <NewTransactionModal modalStatus={newTrxStatus} setModalStatus={setNewTrxStatus}/>
        <EditTransactionModal editId={editId} modalStatus={editTrxStatus} setModalStatus={setEditTrxStatus}/>

        <div className="container">
          <div className="header">
            <h1>Journals</h1>
            <div className="right">
              <Button onClick={() => setNewTrxStatus(true)} icon="insert"/>
              <Button onClick={revalidate} icon="refresh"/>
            </div>
          </div>

          {isValidating ? <Spinner/> :
            <HTMLTable style={{width: "100%", borderCollapse: "collapse"}}>
              <thead>
              <tr>
                <th>Payee Narration</th>
                <th>Date</th>
                <th>Source</th>
                <th>Destination</th>
                <th>Amount</th>
                <th/>
              </tr>
              </thead>
              <tbody>
              {transactions.map(batch => batch.map(one =>
                  <TransactionLine key={one.id} {...one} setEditId={setEditId}/>
                )
              )}
              </tbody>
            </HTMLTable>}

          <div className="more">
            <Button icon="more" minimal onClick={() => {
              console.log("currentSize", size);
              setSize(size + 1)
            }}/>
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
