import React, {useState} from "react";
import {ProtectRoute} from "../../contexts/auth";
import {Button, FormGroup} from "@blueprintjs/core";
import {DateInput, TimePrecision} from "@blueprintjs/datetime";
import dayjs from "dayjs";
import api from "../../api";
import {useLedger} from "../../contexts/ledger";
import Select from 'react-select';
import Big from 'big.js';

interface Props {
  id: string
}

const Client = (props: Props) => {

  const [date, setDate] = useState(() => dayjs());
  const [padAccount, setPadAccount] = useState(null);
  const [amount, setAmount] = useState("");
  const [amountAvailable, setAmountAvailable] = useState(false);
  const ledgerContext = useLedger();

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
    await api.newAccountBalance(props.id, date.toDate(), padAccount, amount, "CNY")
  }

  return (<div>

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
  </div>)
}


export default ProtectRoute(Client)
// export default Client
