import {ProtectRoute} from "../contexts/auth";
import React, {useState} from "react";
import {useLedger} from "../contexts/ledger";
import AuthenticationLayout from "../components/AuthenticationLayout";
import NewTransactionModal from "../components/NewTransactionModal";
import EditTransactionModal from "../components/EditTransactionModal";
import GroupedTransactions from "../components/GroupedTransactions";
import {Button, HTMLTable} from "@blueprintjs/core";


function Journals() {
  const {ledger_id, transactions, loadMoreTransaction} = useLedger();


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
              <Button onClick={() => setNewTrxStatus(true)} icon="refresh" />
            </div>
          </div>

          <HTMLTable style={{width: "100%", borderCollapse: "collapse"}}>
            <thead>
            <tr>
              <th>Date</th>
              <th>Payee Narration</th>
              <th>Source</th>
              <th>Destination</th>
              <th>Amount</th>
              <th></th>
            </tr>
            </thead>
            <tbody>
            <GroupedTransactions items={transactions} openEditTrxModal={openEditTrxModal}/>
            </tbody>
          </HTMLTable>
          <div className="more">
            <Button icon="more" onClick={loadMoreTransaction} minimal/>
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
