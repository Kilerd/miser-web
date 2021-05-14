import React, {useState} from "react";
import Big from 'big.js'
import {useLedger} from "../contexts/ledger";
import classNames from "classnames";
import dayjs from 'dayjs'
import api from "../api";
import Link from "next/link";
import {Popover2} from "@blueprintjs/popover2";
import {Alert, Button, Icon, Intent, Menu, MenuItem, Tag} from "@blueprintjs/core";
import Amount from "./Amount";

export default function TransactionLine({
                                          id,
                                          flag,
                                          narration,
                                          payee,
                                          create_time,
                                          lines,
                                          is_balance,
                                          has_document,
                                          setEditId
                                        }) {

  const {getAccountAlias, update, accounts} = useLedger();


  // todo multiple commodities
  const outAccounts = lines
    .filter(value => new Big(value.cost[0]).s === -1)
    .map(value => value.account)
    .map(it => ({
      id: it,
      value: getAccountAlias(it)
    }));
  const inAccounts = lines
    .filter(value => new Big(value.cost[0]).s === 1)
    .map(value => value.account)
    .map(it => ({
      id: it,
      value: getAccountAlias(it)
    }));

  let amount = new Big(0);
  lines.forEach(it => {
    const targetAccount = accounts[it.account];
    if (targetAccount.full_name.startsWith("Income")) {
      amount = amount.sub(new Big(it.cost[0]));
    } else if (targetAccount.full_name.startsWith("Expenses")) {
      amount = amount.sub(new Big(it.cost[0]));
    }
  });


  const s = dayjs(create_time).format("HH:mm");

  const deleteTrx = async (id) => {
    // setLoading(true);
    await api.deleteTransaction(id)
    // setLoading(false);
    update("TRANSACTIONS")
  }

  const [deleteOpen, setDeleteOpen] = useState(false)
  return (
    <>


      <Alert
        cancelButtonText="Cancel"
        confirmButtonText="Delete"
        icon="trash"
        intent={Intent.DANGER}
        isOpen={deleteOpen}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={() => deleteTrx(id)}
      >
        <p>
          Confirm Delete？
        </p>
      </Alert>

      <tr className={classNames({
        error: flag !== "Complete",
        notBalance: !is_balance,
      })}>
        <td>
          <Link href={`/transactions/${id}`}>
            <div className="info">
              <span className="payee">{payee}</span>
              {narration} {has_document && <Icon icon="document"/>}
            </div>
          </Link>
        </td>
        <td>
          {dayjs(create_time).format("MMM DD, YYYY")}
        </td>
        <td>{outAccounts.map(it => (
          <Link href={`/accounts/${it.id}`}>
            <Tag round minimal interactive key={it.id}>{it.value}</Tag>
          </Link>
        ))}</td>
        <td>{inAccounts.map(it => (
          <Link href={`/accounts/${it.id}`}>
            <Tag round minimal interactive key={it.id}>{it.value}</Tag>
          </Link>
        ))}</td>
        <td><Amount amount={amount} prefix="¥" color/></td>
        <td>
          <Popover2 content={<Menu>
            <MenuItem text="Edit" icon="edit" onClick={() => setEditId(id)}/>
            <MenuItem text="Delete" icon="trash" onClick={() => setDeleteOpen(true)}/>
          </Menu>}>
            <Button minimal icon="more"/>
          </Popover2>
        </td>
      </tr>

      <style jsx>{`

        tr {
          border-bottom: 1px solid #dadada;
          border-left: 3px solid rgba(255, 255, 255, 0);

          td {
            vertical-align: middle;
          }
        }

        .info {
          //font-size: 1rem;
          display: inline-block;
          cursor: pointer;

          span.payee {
            font-weight: 500;
          }

        }

        .line {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.5rem 0.75rem;
          border-left: 1px solid rgb(213, 213, 218);
          border-right: 1px solid rgb(213, 213, 218);
          border-bottom: 1px solid rgb(213, 213, 218);

          :first-child {
            border-top: 1px solid rgb(213, 213, 218);
            border-top-left-radius: 3px;
            border-top-right-radius: 3px;
          }

          :last-child {
            border-bottom-left-radius: 3px;
            border-bottom-right-radius: 3px;
          }

          .left {
            display: flex;
            flex-direction: column;


            .meta {

              display: flex;

              div {
                margin-right: 0.25rem;
              }
            }
          }

          .right {
            display: flex;
            align-items: center;

            .info {
              display: flex;
              flex-direction: column;
              align-items: flex-end;

              .amount {
                font-size: 1.25rem;
              }


              .orientation {
                font-size: 0.85rem;
              }
            }
          }
        }

        .notBalance {
          border-left: 3px solid red;
        }
      `}</style>
    </>
  )
}
