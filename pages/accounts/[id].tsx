import {ProtectRoute} from "../../contexts/auth";
import api, {get} from "../../api";
import {useRouter} from "next/router";
import AuthenticationLayout from "../../components/AuthenticationLayout";
import {useLedger} from "../../contexts/ledger";
import React, {useState} from "react";
import Select from 'react-select';
import {Button, FormGroup, H2, HTMLTable} from "@blueprintjs/core";
import Big from 'big.js';
import {Line} from "react-chartjs-2";
import {DateInput, TimePrecision} from "@blueprintjs/datetime";
import dayjs from "dayjs";
import {useSWRInfinite} from "swr";
import {getUrlByTime} from "../../utils/swr";
import Amount from "../../components/Amount";
import Link from "next/link";


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
  const [date, setDate] = useState(() => dayjs());
  const [padAccount, setPadAccount] = useState(null);
  const [amount, setAmount] = useState("");
  const [amountAvailable, setAmountAvailable] = useState(false);

  const {
    isValidating,
    data: rawTimeline,
    revalidate,
    setSize,
    size,
  } = useSWRInfinite(
    getUrlByTime(`/ledgers/${ledgerContext.ledger_id}/accounts/${id}/timeline`, 'create_time'),
    get
  );
  const timeline = rawTimeline ? [].concat(...rawTimeline) : []
  const isEmpty = rawTimeline?.[0]?.length === 0;
  const isReachingEnd =
    isEmpty || (rawTimeline && rawTimeline[rawTimeline.length - 1]?.length < 1);


  const accountOptions = Object.values(Object.values(ledgerContext.accounts)
    .reduce((ret, it) => {
      const type = it.full_name.split(":")[0];
      const item = {label: it.full_name, value: it.id};
      ret[type] = ret[type] || {label: type.toUpperCase(), options: []}
      ret[type].options.push(item);
      return ret;
    }, {})).sort()

  function handleAccountChange(e: any) {
    const selectAccountId = e.value;
    setPadAccount(selectAccountId);
  }


  function handlePadAmountChange(e: any) {
    try {
      new Big(e.target.value);
      setAmountAvailable(true);
    } catch (e) {
      setAmountAvailable(false);
    }
    setAmount(e.target.value)
  }

  async function submitBalance() {
    await api.newAccountBalance(id, date.toDate(), padAccount, amount, "CNY")
  }

  return (
    <AuthenticationLayout>
      <div className="container">
        <h1>{targetAccount.alias} {targetAccount.full_name}</h1>

        <Line data={data} height={70}/>
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

        <h2>Balance</h2>
        <FormGroup
          label="Date"
        >
          <DateInput
            defaultValue={date.toDate()}
            parseDate={(s) => new Date(s)}
            formatDate={date => date.toLocaleString()}
            highlightCurrentDay
            shortcuts
            showActionsBar
            timePickerProps={{showArrowButtons: true}}
            timePrecision={TimePrecision.MINUTE}
            onChange={(date) => setDate(dayjs(date))}
            fill
          />
        </FormGroup>
        <Select
          options={accountOptions}
          onChange={(inputValue, actionMeta) => handleAccountChange(inputValue)}
        />
        <input type="number" className="input" value={amount} onChange={handlePadAmountChange}
               placeholder="pad amount"/>
        <Button disabled={!amountAvailable} onClick={submitBalance}>Submit</Button>
      </div>
    </AuthenticationLayout>
  )


}

export default ProtectRoute(Page)
