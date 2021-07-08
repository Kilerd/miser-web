import {useRouter} from "next/router";
import React from "react";
import {HTMLTable} from "@blueprintjs/core";
import useSWR from "swr";
import {ProtectRoute} from "../../contexts/auth";
import AuthenticationLayout from "../../components/AuthenticationLayout";
import {useLedger} from "../../contexts/ledger";
import {get} from "../../api";
import {groupByDate} from "../../utils/sort";
import TransactionLine from "../../components/TransactionLine";


function Page() {
    const router = useRouter();
    const id = router.query.id as string;


    const ledgerContext = useLedger();

    const {
        data: fetchedTransactions,
    } = useSWR(`/ledgers/${ledgerContext.ledger_id}/schedulers/${id}/transactions`, get);

    const transactions = fetchedTransactions || []

    return (
        <>
            <AuthenticationLayout>


                <div className="container">
                    <div className="header">
                        <h1>Scheduler Detail</h1>
                    </div>

                    <HTMLTable style={{width: "100%", borderCollapse: "collapse"}}>
                        <thead>
                        <tr>
                            <th/>
                            <th>Payee Narration</th>
                            <th>Source</th>
                            <th>Destination</th>
                            <th style={{textAlign: "right"}}>Amount</th>
                            <th/>
                        </tr>
                        </thead>
                        <tbody>
                        {groupByDate(transactions).map(trxByDate => {
                                const [date, trxs] = trxByDate
                                return trxs.map((one, idx) =>
                                    <TransactionLine key={one.id} withDate={idx === 0} detail={one} />)
                            }
                        )}
                        </tbody>
                    </HTMLTable>


                </div>
            </AuthenticationLayout>
        </>
    )

}

export default ProtectRoute(Page)
