import React, {useState} from "react";
import {ProtectRoute} from "../../contexts/auth";
import dayjs from "dayjs";
import api from "../../api";
import {useLedger} from "../../contexts/ledger";
import Big from 'big.js';
import BalanceLine from "./BalanceLine";

interface Props {
  id: string,
  commodities: string[]
}

const Client = (props: Props) => {

  const [date, setDate] = useState(() => dayjs());
  const [padAccount, setPadAccount] = useState(null);
  const [amount, setAmount] = useState("");
  const [amountAvailable, setAmountAvailable] = useState(false);
  const ledgerContext = useLedger();

  const accountOptions = Object.values(Object.values(ledgerContext.accounts)
    .reduce((ret, it) => {
      const type = it.name.split(":")[0];
      const item = {label: it.name, value: it.id};
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
    await api.newAccountBalance(props.id, date.toDate(), padAccount, amount, "CNY")
  }

  return <>
    <div>

      <h2>Balance</h2>
      {props.commodities.map(one =>
        <BalanceLine id={props.id} commodity={one} key={one}/>
      )}
    </div>
    <style jsx>{`
      
    `}</style>
  </>
};


export default ProtectRoute(Client)
