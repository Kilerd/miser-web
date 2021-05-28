import {ProtectRoute} from "../../contexts/auth";
import api, {get} from "../../api";
import {useRouter} from "next/router";
import AuthenticationLayout from "../../components/AuthenticationLayout";
import {useLedger} from "../../contexts/ledger";
import React, {useState} from "react";
import Select from 'react-select';
import {Button, FormGroup, H2, HTMLTable, Tab, Tabs, Tag} from "@blueprintjs/core";
import Big from 'big.js';
import {Line} from "react-chartjs-2";
import {DateInput, TimePrecision} from "@blueprintjs/datetime";
import dayjs from "dayjs";
import useSWR, {useSWRInfinite} from "swr";
import {getUrlByTime} from "../../utils/swr";
import Amount from "../../components/Amount";
import Link from "next/link";
import Timeline from "../../components/Account/Timeline";
import Balance from "../../components/Account/Balance";
import Setting from "../../components/Account/Setting";


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
          label: 'My First dataset',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: data
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
              <h1>{targetAccount.alias} {targetAccount.full_name}</h1>
              {summary && <Line data={fillInData(summary)} height={70}/>}
            </div>
            <div className="right">
              <Amount size={1.75} amount={targetAccount.summary.total.value}
                      about={targetAccount.summary.total.about}
                      postfix={targetAccount.summary.total.commodity}/>

              <div className="detail">
                {Object.keys(targetAccount.summary.detail.data).sort().map(it => {
                  let targetAmount = targetAccount.summary.detail.data[it];
                  console.log("TargetAmount", targetAmount);
                  return <Amount key={it} size={1.15} amount={targetAmount}
                                 postfix={it}/>
                })}
              </div>
            </div>
          </div>
          <Tabs renderActiveTabPanelOnly large>
            <Tab id="timeline" title="Timeline" panel={<Timeline id={id}/>}/>
            <Tab id="balance" title="Balance" panel={<Balance id={id}/>}/>
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
