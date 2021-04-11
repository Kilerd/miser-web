import {AccountListItemType} from "../types";
import React from "react";
import Link from "next/link";
import {Button, Icon, Tag} from "@blueprintjs/core";
import {IconName} from "@blueprintjs/icons";

interface ModalStatus {
  openEditAccount: any
  level: number
}


export default function AccountListItem({
                                          name,
                                          fullName,
                                          isAvailable,
                                          alias,
                                          commodities,
                                          amount,
                                          id,
                                          icon,
                                          children,
                                          openEditAccount,
                                          level
                                        }: AccountListItemType & ModalStatus) {
  const childrenDOM = Object.values(children).map(one =>
    <AccountListItem key={one.fullName} {...one} level={level + 1} openEditAccount={openEditAccount}/>
  )


  let targetIcon = icon || "folder-close"

  return (

    <>
      <div className="account">
        <div className="content">
          {id
            ?
            <Link href={`/accounts/${id}`}>
              <div className="left pointer" style={{paddingLeft: `${level * 1}rem`}}>
                <div className="name">
                  <Icon icon={targetIcon as IconName}/>
                  {alias || name}
                </div>
                {alias && <div className="meta">{name}</div>}
              </div>
            </Link>
            :
            <div className="left" style={{paddingLeft: `${level * 1}rem`}}>
              <div className="name">
                <Icon icon={targetIcon as IconName}/>
                {alias || name}
              </div>
              {alias && <div className="meta">{name}</div>}
            </div>
          }
          <div className="right">
            <div className="amount">{amount} CNY</div>
            {/*{id &&*/}
            {/*<span>*/}
            {/*  <a onClick={() => openEditAccount(id, fullName, alias, commodities)}><Button minimal icon="edit"/></a>*/}
            {/*</span>*/}
            {/*}*/}
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
          //padding: 1rem 0 0 1.5rem;
          display: flex;
          flex-direction: column;

          .content {
            //border: 1px solid #eee;
            border-radius: 5px;
            //background-color: rgba(0, 114, 239, 0.06);
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            //margin: 0.25rem;
            padding: 0.35rem 1rem;

            &:hover {
              background-color: #efefef;
              border-radius: 5px;
            }

            .pointer {
              cursor: pointer;
            }

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
