import {ProtectRoute} from "../contexts/auth";
import React, {useState} from "react";
import {useLedger} from "../contexts/ledger";
import AuthenticationLayout from "../components/AuthenticationLayout";
import NewTransactionModal from "../components/NewTransactionModal";
import EditTransactionModal from "../components/EditTransactionModal";
import GroupedTransactions from "../components/GroupedTransactions";


function Transactions() {
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
            <h1>Transactions for ledger {ledger_id}</h1>
            <button onClick={() => setNewTrxStatus(true)} className="button"> new</button>
          </div>
          <GroupedTransactions items={transactions} loadMore={loadMoreTransaction} openEditTrxModal={openEditTrxModal}/>

        </div>
      </AuthenticationLayout>
      <style jsx>{`
        .header {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        }
      `}</style>
    </>
  )
}

export default ProtectRoute(Transactions)
