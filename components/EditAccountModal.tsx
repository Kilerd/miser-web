import React, {useEffect, useState} from "react";
import Modal from 'react-modal'
import api from "../api";
import {useLedger} from "../contexts/ledger";
import {NEXT_PROJECT_ROOT} from "next/dist/lib/constants";
import {use} from "ast-types";

export default function EditAccountModal({id, name, alias, commodities, modalStatus, setModalStatus}) {
  const ledgerContext = useLedger();

  const [editName, setEditName] = useState("");
  const [editAlias, setEditAlias] = useState("");
  const [editCommodityMap, setEditCommodityMap] = useState({});

  useEffect(() => setEditName(name), [name]);
  useEffect(() => setEditAlias(alias || ""), [alias]);
  useEffect(() => {
    const newCommodityMap = {};
    Object.keys(ledgerContext.commodities).forEach(one => {
      newCommodityMap[one] = commodities?.indexOf(one) !== -1;
    })
    setEditCommodityMap(newCommodityMap);
  }, [commodities]);
  //
  // useEffect(() => {
  //   const newCommodityMap = {...editCommodityMap};
  //   Object.keys(ledgerContext.commodities).forEach(one => {
  //     newCommodityMap[one] = newCommodityMap[one] || false;
  //   })
  //   setEditCommodityMap(newCommodityMap);
  // }, [ledgerContext.commodities])

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
    await api.updateAccount(id, editName, editAlias, selectedCommodityMap);
    setLoading(false);
    setModalStatus(false);
    setEditName("");
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
      <h2>Edit Account {id}</h2>
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
    </Modal>
  )
}
