import React from "react";
import Big from 'big.js'
import {useLedger} from "../contexts/ledger";
import classNames from "classnames";
import dayjs from 'dayjs'
import api from "../api";
import Link from "next/link";
import {Popover2, Classes} from "@blueprintjs/popover2";
import {Button, H5, Icon, Intent, Tag} from "@blueprintjs/core";
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
  const outAccounts = lines.filter(value => new Big(value.cost[0]).s === -1).map(value => value.account);
  const inAccounts = lines.filter(value => new Big(value.cost[0]).s === 1).map(value => value.account);

  const outAccount = outAccounts.length !== 1 ? `${outAccounts.length} Accounts` : getAccountAlias(outAccounts[0])
  const inAccount = inAccounts.length !== 1 ? `${inAccounts.length} Accounts` : getAccountAlias(inAccounts[0])
  const outAmount = lines.filter(value => new Big(value.cost[0]).s === -1).map(value => value.cost[0]).reduce((sum, cur) => sum.add(cur), new Big(0));
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
  return (
    <>
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
        <td>{outAccount}</td>
        <td>{inAccount}</td>
        <td><Amount amount={amount} prefix="¥" color/></td>
        <td>
          <a onClick={() => setEditId(id)}><Button minimal icon="edit"/></a>
          <Popover2 content={<div key="text" style={{padding: "1rem"}}>
            <H5>Confirm deletion</H5>
            <div style={{display: "flex", justifyContent: "flex-end", marginTop: 15}}>
              <Button className={Classes.POPOVER2_DISMISS} style={{marginRight: 10}}>
                Cancel
              </Button>
              <Button intent={Intent.DANGER} onClick={() => deleteTrx(id)} className={Classes.POPOVER2_DISMISS}>
                Delete
              </Button>
            </div>
          </div>}>
            <Button minimal icon="trash"/>
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
