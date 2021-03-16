import React, {useState} from "react";
import Modal from 'react-modal'
import api from "../api";
import {useLedger} from "../contexts/ledger";

export default function NewCommodityModal({modalStatus, setModalStatus}) {
  const ledgerContext = useLedger();
  const [name, setName] = useState("");
  const [isLoading, setLoading] = useState(false);
  const canBeSubmit = name !== '' && !isLoading;

  const submit = async () => {
    setLoading(true);
    await api.newCommodity(name);
    setLoading(false);
    setModalStatus(false);
    setName("");
    ledgerContext.update("COMMODITY");
  }
  return (
    <Modal
      isOpen={modalStatus}
      // onRequestClose={()=> setIsOpen(false)}
      contentLabel="Example Modal"
      // style={customStyles}
    >
      <button onClick={() => setModalStatus(false)}>close</button>
      <h2>new Commodity</h2>
      <input type="text" value={name} onChange={e => setName(e.target.value)}/>

      <button disabled={!canBeSubmit} onClick={submit}> create</button>
    </Modal>
  )
}
