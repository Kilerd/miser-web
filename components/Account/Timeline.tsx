import React from "react";
import {useRouter} from "next/router";
import {ProtectRoute} from "../../contexts/auth";
import {Button, H2, HTMLTable} from "@blueprintjs/core";
import dayjs from "dayjs";
import Link from "next/link";
import Amount from "../Amount";
import {useSWRInfinite} from "swr";
import {getUrlByTime} from "../../utils/swr";
import {get} from "../../api";
import {useLedger} from "../../contexts/ledger";

interface Props {
  id: string
}


const Client = (props: Props) => {
  const ledgerContext = useLedger();

  const {
    isValidating,
    data: rawTimeline,
    revalidate,
    setSize,
    size,
  } = useSWRInfinite(
    getUrlByTime(`/ledgers/${ledgerContext.ledger_id}/accounts/${props.id}/timeline`, 'create_time'),
    get
  );
  const timeline = rawTimeline ? [].concat(...rawTimeline) : []
  const isEmpty = rawTimeline?.[0]?.length === 0;
  const isReachingEnd =
    isEmpty || (rawTimeline && rawTimeline[rawTimeline.length - 1]?.length < 1);


  return (<div>

    <H2>Timeline</H2>
    <HTMLTable style={{width: "100%", borderCollapse: "collapse"}}>
      <thead>
      <tr>
        <th>Date</th>
        <th>Payee Narration</th>
        <th style={{textAlign: "right"}}>Amount</th>
        <th/>
      </tr>
      </thead>
      <tbody>
      {timeline.map(item =>
        <tr key={item.id}>
          <td>{dayjs(item.create_time).format("MMM DD, YYYY")}</td>
          <td><Link href={`/transactions/${item.transaction_id}`}>
            <p>{item.payee} {item.narration}</p>
          </Link></td>
          <td><Amount amount={item.amount} prefix="¥" color/></td>
        </tr>
      )}
      </tbody>
    </HTMLTable>
    <div>
      <Button disabled={isReachingEnd} onClick={() => setSize(size + 1)}>
        {isReachingEnd ? "no more data" : `load more`}
      </Button>
    </div>

  </div>)
}


export default ProtectRoute(Client)
// export default Client
