import React, {useEffect, useState} from "react";
import Modal from 'react-modal'
import api from "../api";
import {useLedger} from "../contexts/ledger";
import {NEXT_PROJECT_ROOT} from "next/dist/lib/constants";
import {use} from "ast-types";

export default function NewAccountModal({modalStatus, setModalStatus}) {
  const ledgerContext = useLedger();

  const [name, setName] = useState("");
  const [alias, setAlias] = useState("");
  const [commodityMap, setCommodityMap] = useState({});
  const [init, setInit] = useState(false);

  const [account, setAccount] = useState(() => {
    const account1 = Object.values(ledgerContext.accounts).find(it => it.full_name === 'Equity:Opening-Balances');
    return account1?.id;
  });

  const [amount, setAmount] = useState("")
  const [commodity, setCommodity] = useState(() => {
    const account1 = Object.values(ledgerContext.accounts).find(it => it.full_name === 'Equity:Opening-Balances');
    let commodities = account1?.commodities;
    return commodities?.length > 0 ? commodities[0] : null;
  })
  const [commodityCandidates, setCommodityCandidates] = useState(() => {
    const account1 = Object.values(ledgerContext.accounts).find(it => it.full_name === 'Equity:Opening-Balances');
    return account1?.commodities || [];
  })

  useEffect(() => {
    const newCommodityMap = {...commodityMap};
    Object.keys(ledgerContext.commodities).forEach(one => {
      newCommodityMap[one] = newCommodityMap[one] || false;
    })
    setCommodityMap(newCommodityMap);
  }, [ledgerContext.commodities])

  const handleCommodityClick = (commodity) => {
    const newCommodityMap = {...commodityMap};
    newCommodityMap[commodity] = !newCommodityMap[commodity];
    setCommodityMap(newCommodityMap);
  }

  function handleAccountChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const accountId = parseInt(e.target.value);
    setAccount(accountId);

    let commodityCandidates = ledgerContext.accounts[accountId]?.commodities || [];
    setCommodityCandidates(commodityCandidates);
    setCommodity(commodityCandidates.length > 0 ? commodityCandidates[0] : null)
  }

  const [isLoading, setLoading] = useState(false);
  const canBeSubmit = name !== '' && !isLoading;

  const submit = async () => {
    setLoading(true);
    const selectedCommodityMap = Object.keys(commodityMap).filter(one => commodityMap[one]);
    await api.newAccount(name, alias, selectedCommodityMap, init, account, amount, commodity);
    setLoading(false);
    setModalStatus(false);
    setName("");
    ledgerContext.update("ACCOUNT")
  }
  return (
    <Modal
      isOpen={modalStatus}
      // onRequestClose={()=> setIsOpen(false)}
      contentLabel="Example Modal"
      // style={customStyles}
    >
      <button onClick={() => setModalStatus(false)}>close</button>
      <h2>new Account</h2>
      <input type="text" value={name} placeholder="name" onChange={e => setName(e.target.value)}/>
      <input type="text" value={alias} placeholder="alias" onChange={e => setAlias(e.target.value)}/>

      <div>
        {
          Object.keys(commodityMap).map(commodity => (
            <label key={commodity} onClick={() => handleCommodityClick(commodity)} htmlFor={`commodity-${commodity}`}>
              <input type="checkbox" checked={commodityMap[commodity]} className="input" id="commodity-{commodity}"/>
              {commodity}
            </label>
          ))
        }
      </div>

      <div>
        <label htmlFor="init" onClick={() => setInit(!init)}>
          <input type="checkbox" checked={init}/>
          init
        </label>
        {init && (
          <div>
            <select name="select" id="exampleSelect" className="input" onChange={handleAccountChange}>
              {Object.values(ledgerContext.accounts).map(it =>
                <option value={it.id}>{it.alias} ({it.full_name})</option>
              )}
            </select>
            <input type="number" placeholder="Amount" className="input" value={amount}
                   onChange={e => setAmount(e.target.value)}/>

            <select name="select" id="exampleSelect" onChange={e => setCommodity(e.target.value)}>
              {commodityCandidates.map(candidate =>
                <option selected={commodity === candidate} value={candidate}>{candidate}</option>
              )}
            </select>
          </div>
        )}
      </div>
      <button disabled={!canBeSubmit} onClick={submit}> create</button>
    </Modal>
  )
}
