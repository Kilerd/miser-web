import {AccountListItemType} from "../types";
import styles from './layout.module.scss'
import React from "react";
import Link from "next/link";

interface ModalStatus {
  openEditAccount: any
}


export default function AccountListItem({
                                          name,
                                          fullName,
                                          isAvailable,
                                          alias,
                                          commodities,
                                          amount,
                                          id,
                                          children,
                                          openEditAccount
                                        }: AccountListItemType & ModalStatus) {
  const commodities_map = commodities.map(one => <span key={one}>{one}</span>);
  const childrenDOM = Object.values(children).map(one =>
    <AccountListItem key={one.fullName} {...one} openEditAccount={openEditAccount}/>
  )
  return (

    <>
      <div className="account">
        <div className="content">
          <Link href={`/accounts/${id}`}>
            <div className="left">
              <div className="name">{alias || name}</div>
              <div className="meta">{fullName}</div>
              <div className="commodities">{commodities_map}</div>
            </div>
          </Link>
          <div className="right">
            <div className="amount">{amount} CNY</div>
            {id &&
            <span>
              <a onClick={() => openEditAccount(id, fullName, alias, commodities)}>edit</a>
            </span>
            }
          </div>
        </div>
        {childrenDOM.length !== 0 &&
        <div className="children">
          {childrenDOM}
        </div>
        }

      </div>

      <style jsx>{`
        .account {
          padding: 1rem 0 0 1.5rem;
          display: flex;
          flex-direction: column;


          .content {
            border: 1px solid #eee;
            border-radius: 5px;
            background-color: rgba(0, 114, 239, 0.06);
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            padding: 0.5rem 0.75rem;

            .left {
              display: flex;
              align-items: center;

              .name {
                font-size: 1rem;
              }

              .meta {
                margin-left: 0.5rem;
                font-size: 1rem;
                color: #7c7c7c;
              }
            }

            .right {
              display: flex;
              align-items: center;
            }
          }

          .children {
          }
        }
      `}</style>
    </>
  )
}
