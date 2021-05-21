import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {ProtectRoute} from "../../contexts/auth";
import {useLedger} from "../../contexts/ledger";
import api from "../../api";

interface Props {
  id: number,
  name: string,
  full_name:string,
  alias: string,
  commodities: string[]
}

const Client = (props: Props) => {

  const ledgerContext = useLedger();

  const [editName, setEditName] = useState(props.full_name);
  const [editAlias, setEditAlias] = useState(props.alias);
  const [editCommodityMap, setEditCommodityMap] = useState(() => {
    const newCommodityMap = {};
    Object.keys(ledgerContext.commodities).forEach(one => {
      newCommodityMap[one] = props.commodities?.indexOf(one) !== -1;
    })
    return newCommodityMap
  });


  const handleCommodityClick = (commodity) => {
    const newCommodityMap = {...editCommodityMap};
    newCommodityMap[commodity] = !newCommodityMap[commodity];
    setEditCommodityMap(newCommodityMap);
  }

  const [isLoading, setLoading] = useState(false);
  const canBeSubmit = editName !== '' && !isLoading;

  const submit = async () => {
    setLoading(true);
    const selectedCommodityMap = Object.keys(editCommodityMap).filter(one => editCommodityMap[one]);
    await api.updateAccount(props.id, editName, editAlias, selectedCommodityMap);
    setLoading(false);
    setEditName("");
    ledgerContext.update("ACCOUNT")
  }



  return (<div>
    <h2>Edit Account {props.id}</h2>
    <input type="text" value={editName} placeholder="name" onChange={e => setEditName(e.target.value)}/>
    <input type="text" value={editAlias} placeholder="alias" onChange={e => setEditAlias(e.target.value)}/>

    <div>
      {
        Object.keys(editCommodityMap).map(commodity => (
          <label key={commodity} onClick={() => handleCommodityClick(commodity)} htmlFor={`commodity-${commodity}`}>
            <input type="checkbox" checked={editCommodityMap[commodity]}
                   onChange={() => handleCommodityClick(commodity)} className="input"
                   id="commodity-{commodity}"/>
            {commodity}
          </label>
        ))
      }
    </div>
    <button disabled={!canBeSubmit} onClick={submit}> create</button>
  </div>)
}


export default ProtectRoute(Client)
// export default Client
