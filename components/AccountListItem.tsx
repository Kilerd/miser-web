import { AccountListItemType } from "../types";
import React, { useState } from "react";
import Link from "next/link";
import { Button, Icon, Tag } from "@blueprintjs/core";
import { IconName } from "@blueprintjs/icons";
import Amount from "./Amount";

interface ModalStatus {
  openEditAccount: any;
}

export default function AccountListItem({
  name,
  alias,
  amount,
  id,
  icon,
  children,
  openEditAccount,
}: AccountListItemType & ModalStatus) {
  const [childrenOpen, setChildrenOpen] = useState(true);

  const childrenDOM = Object.values(children).map((one) => (
    <AccountListItem
      key={one.fullName}
      {...one}
      openEditAccount={openEditAccount}
    />
  ));

  const targetIcon =
    icon ||
    (id
      ? childrenDOM.length < 1
        ? "dot"
        : childrenOpen
        ? "small-minus"
        : "small-plus"
      : childrenOpen
      ? "folder-open"
      : "folder-close");

  const openChildren = (e: any) => {
    setChildrenOpen(!childrenOpen);
  };

  return (
    <>
      <div className="account">
        <div className="content">
          {id ? (
            <div className="left">
              <Icon
                icon={targetIcon as IconName}
                onClick={openChildren}
                className="account-icon"
              />
              <Link href={`/accounts/${id}`}>
                <div className="name pointer">
                  {alias || name}
                  {alias && <span>{name}</span>}
                </div>
              </Link>
            </div>
          ) : (
            <div className="left">
              <Icon
                icon={targetIcon as IconName}
                onClick={openChildren}
                className="account-icon"
              />
              <div className="name">
                {alias || name}
                {alias && <span>{name}</span>}
              </div>
            </div>
          )}
          <div className="right">
            <Amount amount={amount} commodity="CNY" />
          </div>
        </div>
        {childrenDOM.length !== 0 && childrenOpen && (
          <div className="children">{childrenDOM}</div>
        )}
      </div>

      <style jsx>{`
        .account {
          //padding: 1rem 0 0 1.5rem;
          margin-left: 0.5rem;
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
            padding: 0.25rem 0.75rem;
            margin-bottom: 0.25rem;

            &:hover {
              background-color: #efefef;
              border-radius: 5px;

              .left {
                color: #535353;

                .name {
                  color: #535353;
                }
              }
            }

            .pointer {
              cursor: pointer;
            }

            .left {
              display: flex;
              align-items: center;
              color: #7f878a;

              .name {
                margin-left: 0.25rem;
                font-size: 1rem;
                color: #7f878a;
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
            margin-left: 1.25rem;
            border-left: 1px dashed #7c7c7c;
          }
        }
      `}</style>
    </>
  );
}
