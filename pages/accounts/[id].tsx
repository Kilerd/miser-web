import {ProtectRoute} from "../../contexts/auth";
import {useAsync} from "react-async-hook";
import api from "../../api";
import {useRouter} from "next/router";
import AuthenticationLayout from "../../components/AuthenticationLayout";
import {useLedger} from "../../contexts/ledger";
import React, {useState} from "react";
import Select from 'react-select';

function Page() {
  const router = useRouter();
  const id = router.query.id as string;
  const {result, loading, error} = useAsync(async () => api.loadTransactionsByAccounts(id), [id]);
  const ledgerContext = useLedger();
  const targetAccount = ledgerContext.accounts[id];
  if (targetAccount === undefined) {
    return <div>404</div>
  }

  const [padAccount, setPadAccount] = useState(null);


  const accountOptions = Object.values(Object.values(ledgerContext.accounts)
    .reduce((ret, it) => {
      const type = it.full_name.split(":")[0];
      const item = {label: it.full_name, value: it.id};
      ret[type] = ret[type] || {label: type.toUpperCase(), options: []}
      ret[type].options.push(item);
      return ret;
    }, {})).sort()

  function handleAccountChange(e: any, index: number) {
    const selectAccountId = e.value;
    setPadAccount(selectAccountId);
  }

  return (
    <AuthenticationLayout>
      <div className="container">
        <h1>{targetAccount.alias} {targetAccount.full_name}</h1>


        <h2>Balance</h2>
        <input type="number" className="input" placeholder="pad amount"/>
        <Select
          options={accountOptions}
          onChange={(inputValue, actionMeta) => handleAccountChange(inputValue, 0)}
        />
      </div>
    </AuthenticationLayout>
  )


}

export default ProtectRoute(Page)
