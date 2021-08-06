import React, { useState } from "react";
import Big from "big.js";
import classNames from "classnames";
import dayjs from "dayjs";
import Link from "next/link";
import { Popover2 } from "@blueprintjs/popover2";
import {
  Alert,
  Button,
  Icon,
  Intent,
  Menu,
  MenuItem,
  Tag,
} from "@blueprintjs/core";
import { useLedger } from "../contexts/ledger";
import api from "../api";
import Amount from "./Amount";
import Card from "../basic/Card";
import TransactionLine from "./TransactionLine";
import { groupByDate } from "../utils/sort";

interface Props {
  date: any;
  items: any[];
}

export default function TransactionDateGroup({ date, items }: Props) {
  return (
    <>
      <div className="date-group">
        <div className="date">
          {dayjs(date).format("MMMM D")}
          <span className="weekday">{dayjs(date).format("dddd")}</span>
        </div>
        <Card noPadding>
          {items.map((one) => (
            <TransactionLine key={one.id} detail={one} action />
          ))}
        </Card>
      </div>

      <style jsx>{`
        .date-group {
          margin-bottom: 1rem;

          .date {
            margin-left: 0.5rem;
            margin-bottom: 0.2rem;
            font-size: 1.2rem;

            span.weekday {
              margin-left: 0.4rem;
              font-size: 0.9rem;
              color: rgba(92, 112, 128, 0.7);
            }
          }
        }
      `}</style>
    </>
  );
}
