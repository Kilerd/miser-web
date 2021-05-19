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
import {useSWRInfinite} from "swr";
import {getUrlByTime} from "../../utils/swr";
import Amount from "../../components/Amount";
import Link from "next/link";
import Timeline from "../../components/Account/Timeline";
import Balance from "../../components/Account/Balance";
import Setting from "../../components/Account/Setting";


const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
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
      data: [65, 59, 80, 81, 56, 55, 40]
    }
  ]
};

function Page() {
  const router = useRouter();
  const id = router.query.id as string;


  const ledgerContext = useLedger();
  const targetAccount = ledgerContext.accounts[id];
  if (targetAccount === undefined) {
    return <div>404</div>
  }

  return (
    <AuthenticationLayout>
      <div className="container">
        <h1>{targetAccount.alias} {targetAccount.full_name}</h1>
        <Line data={data} height={70}/>
        <Tabs renderActiveTabPanelOnly large>
          <Tab id="timeline" title="Timeline" panel={<Timeline id={id} />}/>
          <Tab id="balance" title="Balance" panel={<Balance id={id} />}/>
          <Tab id="setting" title="Setting" panel={<Setting {...targetAccount} />}/>
        </Tabs>




      </div>
    </AuthenticationLayout>
  )


}

export default ProtectRoute(Page)
