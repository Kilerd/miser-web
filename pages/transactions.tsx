import {ProtectRoute} from "../contexts/auth";
import {connect} from 'react-redux'
import React, {useState} from "react";
import {useLedger} from "../contexts/ledger";
import TransactionGroup from "../components/TransactionGroup";
import AuthenticationLayout from "../components/AuthenticationLayout";
import NewTransactionModal from "../components/NewTransactionModal";
import EditTransactionModal from "../components/EditTransactionModal";
import dayjs from "dayjs";
import {State, stateWrapper} from "../store";
import {Button, H1} from "@blueprintjs/core";

export const getServerSideProps = stateWrapper.getServerSideProps(({store, req, res, ...etc}) => {
  store.dispatch({type: 'TICK', payload: 'was set in other page'});
})


function Transactions(state: State) {
  const {ledger_id, transactions, loadMoreTransaction} = useLedger();


  let groupedTransactions: { [key: string]: any } = {}
  for (let it of Object.values(transactions)) {
    const date = dayjs(it.create_time).format('YYYY-MM-DD');
    if (groupedTransactions[date] === undefined) {
      groupedTransactions[date] = []
    }
    groupedTransactions[date].push(it)
  }

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

          {Object.entries(groupedTransactions).sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()).reverse().map(item => {
            const [date, trxs] = item;
            return <TransactionGroup key={date} date={date} items={trxs} setEditId={openEditTrxModal}/>
          })}

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

export default connect(state => state)(ProtectRoute(Transactions))
