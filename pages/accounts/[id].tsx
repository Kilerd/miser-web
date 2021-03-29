import {ProtectRoute} from "../../contexts/auth";
import {useAsync} from "react-async-hook";
import api from "../../api";
import {useRouter} from "next/router";
import AuthenticationLayout from "../../components/AuthenticationLayout";
import {useLedger} from "../../contexts/ledger";
import React, {useState} from "react";
import Select from 'react-select';
import {Button} from "@blueprintjs/core";
import Big from 'big.js';
import GroupedTransactions from "../../components/GroupedTransactions";
import {IdMap, Transaction} from "../../types";
import {Line} from "react-chartjs-2";


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

  const [padAccount, setPadAccount] = useState(null);
  const [amount, setAmount] = useState("");
  const [amountAvailable, setAmountAvailable] = useState(false);
  const [accountTransactions, setAccountTransactions] = useState({} as IdMap<Transaction>);

  const {result, loading, error} = useAsync(async () => {
    let res = await api.loadTransactionsByAccounts(id, null);
    setAccountTransactions(res)
  }, [id]);

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

  async function loadMore() {

    let sort = Object.values(accountTransactions).sort((a, b) => new Date(a.create_time).getTime() - new Date(b.create_time).getTime());
    console.log(sort);
    let latestDate = (sort[0] || {create_time: new Date()}).create_time;
    let moreRes = await api.loadTransactionsByAccounts(id, latestDate);
    let newTransactionMap = {...accountTransactions};
    for (let moreResKey in moreRes) {
      newTransactionMap[moreResKey] = moreRes[moreResKey];
    }
    console.log("new", newTransactionMap);
    setAccountTransactions(newTransactionMap);
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
    await api.newAccountBalance(id, new Date(), padAccount, amount, "CNY")
  }

  return (
    <AuthenticationLayout>
      <div className="container">
        <h1>{targetAccount.alias} {targetAccount.full_name}</h1>

        <Line data={data} height={70}/>
        {(!loading && !error) &&
        <GroupedTransactions items={accountTransactions} loadMore={loadMore} openEditTrxModal={(id) => {
        }}/>
        }

        <h2>Balance</h2>
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
