import {ProtectRoute} from "../../contexts/auth";
import {get} from "../../api";
import {useRouter} from "next/router";
import AuthenticationLayout from "../../components/AuthenticationLayout";
import {useLedger} from "../../contexts/ledger";
import React from "react";
import {Tab, Tabs} from "@blueprintjs/core";
import {Line} from "react-chartjs-2";
import useSWR from "swr";
import Amount from "../../components/Amount";
import Timeline from "../../components/Account/Timeline";
import Balance from "../../components/Account/Balance";
import Setting from "../../components/Account/Setting";
import dayjs from "dayjs";


function Page() {
    const router = useRouter();
    const id = router.query.id as string;


    const ledgerContext = useLedger();
    const targetAccount = ledgerContext.accounts[id];
    if (targetAccount === undefined) {
        return <div>404</div>
    }

    const {isValidating, data: summary} = useSWR(`/ledgers/${ledgerContext.ledger_id}/accounts/${id}/summary`, get);

    function fillInData(summary: any) {
        let date = summary.map(it => it.date).reverse()
        let data = summary.map(it => it.total.value).reverse();
        return {
            labels: date,
            datasets: [
                {
                    label: 'bar',
                    borderColor: 'rgb(245,77,109)',
                    backgroundColor: 'rgba(245,77,109, 0.5)',
                    data,
                    order: 1
                },
                {
                    label: 'line',
                    fill: false,
                    type: "line",
                    borderColor: 'rgb(32,189,229)',
                    order: 0,
                    data
                }
            ]
        }
    }

    return (
        <>
            <AuthenticationLayout>
                <div className="container">
                    <div className="header">
                        <div className="left">
                            <h1>{targetAccount.alias} {targetAccount.name}</h1>
                            {summary && <Line data={fillInData(summary)} height={70} options={{
                                plugins: {
                                    title: {
                                        text: 'Chart.js Combo Time Scale',
                                        display: true
                                    }
                                },
                                scales: {
                                    x: {
                                        type: 'time',
                                        display: true,
                                        offset: true,
                                        time: {
                                            unit: 'day'
                                        }
                                    },
                                },
                            }}/>}
                        </div>
                        <div className="right">
                            <Amount size={1.75} amount={targetAccount.summary.total.value}
                                    about={targetAccount.summary.total.about}
                                    commodity={targetAccount.summary.total.commodity}/>

                            <div className="detail">
                                {Object.keys(targetAccount.summary.detail.data).sort().map(it => {
                                    let targetAmount = targetAccount.summary.detail.data[it];
                                    console.log("TargetAmount", targetAmount);
                                    return <Amount key={it} size={1.15} amount={targetAmount}
                                                   commodity={it}/>
                                })}
                            </div>
                        </div>
                    </div>
                    <Tabs renderActiveTabPanelOnly large>
                        <Tab id="timeline" title="Timeline" panel={<Timeline id={id}/>}/>
                        <Tab id="balance" title="Balance"
                             panel={<Balance id={id} commodities={targetAccount.commodities}/>}/>
                        <Tab id="setting" title="Setting" panel={<Setting {...targetAccount} />}/>
                    </Tabs>

                </div>
            </AuthenticationLayout>
            <style jsx>{`
              .header {
                display: flex;
                justify-content: space-between;

                .left {
                  flex: 1;
                }

                .right {
                  padding: 2em 1em 1em;

                }
              }
            `}</style>
        </>
    )


}

export default ProtectRoute(Page)
