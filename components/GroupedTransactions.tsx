import dayjs from "dayjs";
import {IdMap, Transaction} from "../types";
import TransactionGroup from "./TransactionGroup";
import {Button} from "@blueprintjs/core";
import React from "react";


interface Props {
  items: IdMap<Transaction>

  openEditTrxModal(id): void

  loadMore(): void
}

export default function GroupedTransactions({items, openEditTrxModal, loadMore}: Props) {

  let groupedTransactions: { [key: string]: any } = {}
  for (let it of Object.values(items)) {
    const date = dayjs(it.create_time).format('YYYY-MM-DD');
    if (groupedTransactions[date] === undefined) {
      groupedTransactions[date] = []
    }
    groupedTransactions[date].push(it)
  }

  return (
    <>
      {Object.entries(groupedTransactions).sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()).reverse().map(item => {
        const [date, trxs] = item;
        return <TransactionGroup key={date} date={date} items={trxs} setEditId={openEditTrxModal}/>
      })}

      <div className="more">
        <Button icon="more" onClick={loadMore} minimal/>
      </div>


      <style jsx>{`
        div.more {
          display: flex;
          justify-content: center;
          justify-items: center;
        }
      `}</style>
    </>

  )

}
