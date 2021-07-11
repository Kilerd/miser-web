import React from "react";
import {HTMLTable} from "@blueprintjs/core";
import useSWR from "swr";
import {ProtectRoute} from "../../contexts/auth";
import AuthenticationLayout from "../../components/AuthenticationLayout";
import {useLedger} from "../../contexts/ledger";
import {get} from "../../api";
import Amount from "../../components/Amount";


function Page() {

    const ledgerContext = useLedger();

    const {
        data: fetchedBudgets,
    } = useSWR(`/ledgers/${ledgerContext.ledger_id}/budgets`, get);

    const budgets = fetchedBudgets || []

    return (
        <>
            <AuthenticationLayout>

                <div className="container">
                    <div className="header">
                        <h1>Budgets</h1>
                    </div>

                    <HTMLTable style={{width: "100%", borderCollapse: "collapse"}}>
                        <thead>
                        <tr>
                            <th>name</th>
                            <th>description</th>
                            <th>periodic</th>
                            <th style={{textAlign: "right"}}>Amount</th>
                            <th>percent</th>
                        </tr>
                        </thead>
                        <tbody>
                        {budgets.map(one =>
                                <tr>
                                    <td>{one.name}</td>
                                    <td>{one.description}</td>
                                    <td>{one.periodic}</td>
                                    <td><Amount amount={one.total.value} commodity={one.total.commodity}/>/<Amount amount={one.amount} commodity={one.commodity}/></td>
                                    <td>{(one.total.value/one.amount)*100}%</td>
                                </tr>

                        )}
                        </tbody>
                    </HTMLTable>


                </div>
            </AuthenticationLayout>
        </>
    )

}

export default ProtectRoute(Page)
