import React, { useState } from "react";
import Modal from "react-modal";
import api from "../api";
import { useLedger } from "../contexts/ledger";

export default function NewCommodityModal({ modalStatus, setModalStatus }) {
  const ledgerContext = useLedger();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [prefix, setPrefix] = useState("");
  const [postfix, setPostfix] = useState("");
  const [precision, setPrecision] = useState("2");

  const [isLoading, setLoading] = useState(false);
  const canBeSubmit = name !== "" && !isLoading;

  const submit = async () => {
    setLoading(true);
    await api.newCommodity(name, description, precision, prefix, postfix);
    setLoading(false);
    setModalStatus(false);
    setName("");
    ledgerContext.update("COMMODITY");
  };
  return (
    <Modal
      isOpen={modalStatus}
      // onRequestClose={()=> setIsOpen(false)}
      contentLabel="Example Modal"
      // style={customStyles}
    >
      <button onClick={() => setModalStatus(false)}>close</button>
      <h2>new Commodity</h2>
      <div>
        name:
        <input
          type="text"
          value={name}
          placeholder="name"
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        descirption:
        <input
          type="text"
          value={description}
          placeholder="description"
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        precision:
        <input
          type="text"
          value={precision}
          placeholder="precision"
          onChange={(e) => setPrecision(e.target.value)}
        />
      </div>
      <div>
        prefix:
        <input
          type="text"
          value={prefix}
          placeholder="prefix"
          onChange={(e) => setPrefix(e.target.value)}
        />
      </div>
      <div>
        postfix:
        <input
          type="text"
          value={postfix}
          placeholder="postfix"
          onChange={(e) => setPostfix(e.target.value)}
        />
      </div>

      <button disabled={!canBeSubmit} onClick={submit}>
        {" "}
        create
      </button>
    </Modal>
  );
}
