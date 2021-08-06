import { useRouter } from "next/router";
import React from "react";
import { Tab, Tabs } from "@blueprintjs/core";
import { Line } from "react-chartjs-2";
import useSWR from "swr";
import { ProtectRoute } from "../../contexts/auth";
import { get } from "../../api";
import AuthenticationLayout from "../../components/AuthenticationLayout";
import { useLedger } from "../../contexts/ledger";
import Amount from "../../components/Amount";
import Timeline from "../../components/Account/Timeline";
import Balance from "../../components/Account/Balance";
import Setting from "../../components/Account/Setting";

function Page() {
  const router = useRouter();
  const id = router.query.id as string;

  const ledgerContext = useLedger();
  const targetAccount = ledgerContext.accounts[id];
  if (targetAccount === undefined) {
    return <div>404</div>;
  }

  const { isValidating, data: summary } = useSWR(
    `/ledgers/${ledgerContext.ledger_id}/accounts/${id}/summary`,
    get
  );

  function fillInData(summary: any) {
    const date = summary.map((it) => it.date).reverse();
    const data1 = summary.map((it) => parseFloat(it.total.value)).reverse();
    const data2 = summary.map((it) => it.detail.data.CNY || "0").reverse();
    console.log("data2", data1);
    return {
      labels: date,
      datasets: [
        {
          label: "Total",
          fill: false,
          lineTension: 0,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: data1,
        },
        {
          label: "Change",
          fill: false,
          lineTension: 0,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: data2,
        },
      ],
    };
  }

  return (
    <>
      <AuthenticationLayout>
        <div className="container">
          <div className="header">
            <div className="left">
              <h1>
                {targetAccount.alias} {targetAccount.name}
              </h1>
              {summary && <Line data={fillInData(summary)} height={70} />}
            </div>
            <div className="right">
              <Amount
                size={1.75}
                amount={targetAccount.summary.total.value}
                about={targetAccount.summary.total.about}
                commodity={targetAccount.summary.total.commodity}
              />

              <div className="detail">
                {/*{Object.keys(targetAccount.summary.detail.data).sort().map(it => {*/}
                {/*    const targetAmount = targetAccount.summary.detail.data[it];*/}
                {/*    console.log("TargetAmount", targetAmount);*/}
                {/*    return <Amount key={it} size={1.15} amount={targetAmount}*/}
                {/*                   commodity={it}/>*/}
                {/*})}*/}
              </div>
            </div>
          </div>
          <Tabs renderActiveTabPanelOnly large>
            <Tab id="timeline" title="Timeline" panel={<Timeline id={id} />} />
            <Tab
              id="balance"
              title="Balance"
              panel={
                <Balance id={id} commodities={targetAccount.commodities} />
              }
            />
            <Tab
              id="setting"
              title="Setting"
              panel={<Setting {...targetAccount} />}
            />
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
  );
}

export default ProtectRoute(Page);
