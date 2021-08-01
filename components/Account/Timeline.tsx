import React from "react";
import {Button, H2, HTMLTable} from "@blueprintjs/core";
import dayjs from "dayjs";
import Link from "next/link";
import {useSWRInfinite} from "swr";
import {ProtectRoute} from "../../contexts/auth";
import Amount from "../Amount";
import {getUrlByTime} from "../../utils/swr";
import {get} from "../../api";
import {useLedger} from "../../contexts/ledger";

interface Props {
    id: string
}


const Client = (props: Props) => {
    const ledgerContext = useLedger();

    const accountId = parseInt(props.id, 10);
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


    return (
        <>
            <div>

                <H2>Timeline</H2>
                <HTMLTable style={{width: "100%", borderCollapse: "collapse"}}>
                    <thead>
                    <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Payee Narration</th>
                        <th style={{textAlign: "right"}}>Amount</th>
                        <th style={{textAlign: "right"}}>Balance</th>
                    </tr>
                    </thead>
                    <tbody>
                    {timeline.map(item => {
                            if (item.type === "Transaction") {
                                return <tr key={`${item.type}-${item.transaction_id}`}>
                                    <td>{dayjs(item.time).format("MMM DD, YYYY")}</td>
                                    <td>Transaction</td>
                                    <td>
                                        <Link href={`/transactions/${item.transaction_id}`}><p
                                            className='payee'>{item.payee} {item.narration}</p></Link>
                                    </td>
                                    <td style={{textAlign: "right"}}><Amount amount={item.amount} commodity={item.commodity} color/></td>
                                    <td style={{textAlign: "right"}}><Amount amount={item.balance_number} commodity={item.balance_currency}/></td>
                                </tr>
                            }

                            if (item.pad !== null) {
                                // 平账
                                return <tr key={`${item.type}-${item.transaction_id}`}>
                                    <td>{dayjs(item.time).format("MMM DD, YYYY")}</td>
                                    {item.pad === accountId ?
                                        <td>{item.type} pad account</td> :
                                        <td>{item.type}</td>}
                                    <td>
                                        {item.pad === accountId ?
                                            `change by account ${ledgerContext.getAccountAlias(item.account)} balance` :
                                            ""
                                        }
                                    </td>
                                    <td style={{textAlign: "right"}}>{item.pad === accountId ?
                                        <Amount amount={item.detail.change[0]} commodity={item.detail.change[1]} color/>
                                        : <Amount amount={item.amount} commodity={item.commodity} color/>
                                    }</td>
                                    <td style={{textAlign: "right"}}><Amount amount={item.amount} commodity={item.commodity}/></td>
                                </tr>
                            }
                            // 对账
                            return <tr key={`${item.type}-${item.transaction_id}`}>
                                <td>{dayjs(item.time).format("MMM DD, YYYY")}</td>
                                {item.pad === accountId ?
                                    <td>{item.type} pad account</td> :
                                    <td>{item.type}</td>}
                                <td>check account</td>
                                <td style={{textAlign: "right"}}><Amount amount={item.amount} commodity={item.commodity} color/></td>
                                <td style={{textAlign: "right"}}>
                                    {item.detail?.balance ?
                                        <p>OK</p>
                                        : <div>
                                            <p>Unbalanced</p>
                                            <div>current: <Amount amount={item.detail.current[0]}
                                                                  commodity={item.detail.current[1]} color/></div>
                                            <div>distance: <Amount amount={item.detail.distance[0]}
                                                                   commodity={item.detail.distance[1]} color/></div>
                                        </div>

                                    }
                                </td>
                            </tr>

                        }
                    )}
                    </tbody>
                </HTMLTable>
                <div>
                    <Button disabled={isReachingEnd} onClick={() => setSize(size + 1)}>
                        {isReachingEnd ? "no more data" : `load more`}
                    </Button>
                </div>

            </div>
            <style jsx> {`
              .payee {
                display: inline-block;
                cursor: pointer;
              }
            `}</style>
        </>
    )
}


export default ProtectRoute(Client)
