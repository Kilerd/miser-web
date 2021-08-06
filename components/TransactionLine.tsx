import React, { useState } from "react";
import Big from "big.js";
import classNames from "classnames";
import dayjs from "dayjs";
import Link from "next/link";
import { Popover2 } from "@blueprintjs/popover2";
import { Alert, Button, Intent, Menu, MenuItem } from "@blueprintjs/core";
import { useLedger } from "../contexts/ledger";
import api from "../api";
import Amount from "./Amount";
import LinkTag from "../basic/LinkTag";
import Modal, { ModalTransition } from "@atlaskit/modal-dialog";
import EditTransactionModal from "./EditTransactionModal";

interface Props {
  detail: any;

  action?: boolean;
}

export default function TransactionLine({ detail, action }: Props) {
  const { getAccountAlias, update, accounts } = useLedger();
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);
  const open = () => setIsOpen(true);

  // todo multiple commodities
  const outAccounts = Array.from(
    new Set<number>(
      detail.postings
        .filter((value) => new Big(value.cost[0]).s === -1)
        .map((value) => value.account)
    )
  ).map((it) => ({
    id: it,
    value: getAccountAlias(it),
  }));
  const inAccounts = Array.from(
    new Set<number>(
      detail.postings
        .filter((value) => new Big(value.cost[0]).s === 1)
        .map((value) => value.account)
    )
  ).map((it) => ({
    id: it,
    value: getAccountAlias(it),
  }));

  let amount = new Big(0);
  detail.postings.forEach((it) => {
    const targetAccount = accounts[it.account];
    if (targetAccount.name.startsWith("Income")) {
      amount = amount.sub(new Big(it.cost[0]));
    } else if (targetAccount.name.startsWith("Expenses")) {
      amount = amount.sub(new Big(it.cost[0]));
    }
  });

  const deleteTrx = async (id) => {
    // setLoading(true);
    await api.deleteTransaction(id);
    // setLoading(false);
    update("TRANSACTIONS");
  };

  const actionShow = action || false;
  const [deleteOpen, setDeleteOpen] = useState(false);
  return (
    <>
      <Alert
        cancelButtonText="Cancel"
        confirmButtonText="Delete"
        icon="trash"
        intent={Intent.DANGER}
        isOpen={deleteOpen}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={() => deleteTrx(detail.id)}
      >
        <p>Confirm Delete？</p>
      </Alert>

      <ModalTransition>
        {isOpen && (
          <Modal onClose={close} width="x-large" heading="Create a user">
            <EditTransactionModal
              detail={detail}
              modalStatus={isOpen}
              setModalStatus={setIsOpen}
            />
          </Modal>
        )}
      </ModalTransition>

      <div
        className={classNames("journal-line", {
          error: detail.flag !== "Complete",
          notBalance: !detail.is_balance,
        })}
      >
        <div className="left">
          <Link href={`/transactions/${detail.id}`}>
            <div className="narration">{detail.narration}</div>
          </Link>
          <div className="info">
            <span className="time">{dayjs(detail.time).format("HH:mm")}</span>
            {detail.payee && <span className="payee">{detail.payee}</span>}
            {outAccounts.map((it) => (
              <LinkTag
                link={`/accounts/${it.id}`}
                value={it.value}
                key={it.id}
              />
            ))}
            {inAccounts.map((it) => (
              <LinkTag
                link={`/accounts/${it.id}`}
                value={it.value}
                key={it.id}
              />
            ))}
          </div>
        </div>

        <div className="right">
          <div>
            <Amount amount={amount} commodity="CNY" color />
          </div>
          <div>
            {actionShow && (
              <Popover2
                content={
                  <Menu>
                    <MenuItem text="Edit" icon="edit" onClick={open} />
                    <MenuItem
                      text="Delete"
                      icon="trash"
                      onClick={() => setDeleteOpen(true)}
                    />
                  </Menu>
                }
              >
                <Button minimal icon="more" />
              </Popover2>
            )}
          </div>
        </div>
      </div>
      <style jsx>{`
        .journal-line {
          padding: 1rem;
          display: flex;
          border-bottom: 1px solid #dadada;
          align-items: center;
          justify-content: space-between;

          .left {
            display: flex;
            align-items: baseline;
            flex-direction: column;

            .narration {
              font-size: 1.2rem;

              :hover {
                cursor: pointer;
              }

              padding-bottom: 0.2rem;
            }

            .info {
              display: flex;
              flex-direction: row;
              font-weight: 500;
              font-size: 0.95rem;
              color: rgba(92, 112, 128, 0.7);

              .time,
              .payee {
                margin-right: 0.4rem;
              }
            }
          }

          .right {
            display: flex;
            align-items: center;
          }

          :hover {
            background-color: #fafbfc;
          }

          :last-child {
            border-bottom: none;
          }
        }
      `}</style>
    </>
  );
}
