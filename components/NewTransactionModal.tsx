import React, {useState} from "react";
import Modal from 'react-modal'
import api from "../api";
import {useLedger} from "../contexts/ledger";
import Big from 'big.js';
import Select from 'react-select';
import dayjs from "dayjs";
import {Button, Classes, Dialog, Intent} from "@blueprintjs/core";

export default function NewTransactionModal({modalStatus, setModalStatus}) {
  const ledgerContext = useLedger();

  const [simpleMode, setSimpleMode] = useState(true);

  const [date, setDate] = useState(() => {
    return dayjs().format("YYYY-MM-DDTHH:mm");
  });
  const [payee, setPayee] = useState("");
  const [narration, setNarration] = useState("");
  const [newTag, setNewTag] = useState("");
  const [tags, setTags] = useState([]);
  const [lines, setLines] = useState([
    {account: null, amount: "", commodity: null, commodity_candidates: []},
    {account: null, amount: "", commodity: null, commodity_candidates: []}
  ])


  const [isLoading, setLoading] = useState(false);
  const canBeSubmit = !isLoading;


  const handleNewTag = (e) => {
    if (e.code == 'Enter') {
      const value = e.target.value.trim();
      if (value !== '') {
        if (tags.indexOf(value) === -1) {
          setTags([...tags, value])
        }
        setNewTag("")
      }
    }
  }

  const canDeleteLine = lines.length > 2;
  const handleLineChange = (e, index, fieldId) => {
    const newLines = [...lines]
    newLines[index][fieldId] = e.target.value;
    setLines(newLines);
  }
  const newLine = () => {
    setLines([
      ...lines,
      {account: null, amount: "", commodity: null, commodity_candidates: []}
    ])
  }
  const deleteLine = (target_index) => {
    setLines(lines.filter((value, index) => index != target_index));
  }

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
    const newLines = [...lines]
    newLines[index].account = e;
    let commodityCandidates = ledgerContext.accounts[selectAccountId]?.commodities || [];
    newLines[index].commodity_candidates = commodityCandidates;
    newLines[index].commodity = commodityCandidates.length > 0 ? commodityCandidates[0] : null;
    setLines(newLines);
  }


  const submit = async () => {
    setLoading(true);
    const lineReq = lines.map(line => ({
      account: parseInt(line.account.value),
      amount: [line.amount, line.commodity],
      description: ""
    }));
    await api.createTransaction(new Date(date), payee, narration, tags, [], lineReq)
    setLoading(false);
    setModalStatus(false);
    ledgerContext.update("TRANSACTIONS")
  }


  function handleSimpleModeAmountInput(e: React.ChangeEvent<HTMLInputElement>) {
    let big = new Big(e.target.value);
    let negative = big.mul(-1);
    lines[0].amount = negative.toFixed();
    lines[1].amount = big.toFixed();
    setLines([...lines]);
  }

  return (
    <Dialog
      isOpen={modalStatus}
      title="New Transaction"
      onClose={() => setModalStatus(false)}
    >
      {/*<Modal*/}
      {/*  isOpen={modalStatus}*/}
      {/*  // onRequestClose={()=> setIsOpen(false)}*/}
      {/*  contentLabel="Example Modal"*/}
      {/*  // style={customStyles}*/}
      {/*>*/}
      <div className={Classes.DIALOG_BODY}>
        <div>
          <label htmlFor="date" className="input">Date</label>
          <input type="datetime-local" name="date" id="date" placeholder="2020-10-10" value={date}
                 onChange={e => setDate(e.target.value)}/>

          <label htmlFor="payee" className="input">Payee</label>
          <input type="text" placeholder="Payee" id="payee" className="input" value={payee}
                 onChange={e => setPayee(e.target.value)}/>

          <label htmlFor="narration" className="input">Narration</label>
          <input type="text" placeholder="Narration" id="narration" className="input" value={narration}
                 onChange={e => setNarration(e.target.value)}/>
        </div>

        <div>
          {tags.map(one => <span key={one}>{one}</span>)}
        </div>
        <div>
          <input type="text" placeholder="New Tag" className="input" value={newTag}
                 onChange={e => setNewTag(e.target.value)} onKeyUp={handleNewTag}/>
        </div>

        <label htmlFor="enhancedMode">
          <input id="enhancedMode" type="checkbox" checked={!simpleMode} onChange={() => setSimpleMode(!simpleMode)}
                 disabled={lines.length != 2}/>
          enhanced mode
        </label>
        {simpleMode ? (
            <div>
              <div>
                <Select

                  defaultValue={lines[0].account}
                  options={accountOptions}
                  onChange={(inputValue, actionMeta) => handleAccountChange(inputValue, 0)}
                />
                <Select
                  defaultValue={lines[1].account}
                  options={accountOptions}
                  onChange={(inputValue, actionMeta) => handleAccountChange(inputValue, 1)}

                />

              </div>
              <div>
                <input type="number" placeholder="Amount" className="input" value={lines[1].amount}
                       onChange={e => handleSimpleModeAmountInput(e)}/>

                <select name="select" id="exampleSelect"
                        defaultValue={lines[0].commodity} onChange={(e) => {
                  handleLineChange(e, 0, 'commodity');
                  handleLineChange(e, 1, 'commodity');
                }}>
                  {lines[0].commodity_candidates.filter(it => lines[1].commodity_candidates.indexOf(it) !== -1).map(candidate =>
                    <option key={`${candidate}`} value={candidate}>{candidate}</option>
                  )}
                </select>
              </div>
            </div>
          ) :
          <>
            <h3>Lines</h3>
            <button onClick={newLine}>new Lines</button>
            {lines.map((one, index) =>
              <div key={index}>

                <Select
                  defaultValue={one.account}
                  options={accountOptions}
                  onChange={(inputValue, actionMeta) => handleAccountChange(inputValue, index)}
                />
                <input type="number" placeholder="Amount" className="input" value={one.amount}
                       onChange={e => handleLineChange(e, index, "amount")}/>

                <select name="select" id="exampleSelect"
                        defaultValue={one.commodity} onChange={(e) => handleLineChange(e, index, 'commodity')}>
                  {one.commodity_candidates.map(candidate =>
                    <option key={`${index}-${candidate}`} value={candidate}>{candidate}</option>
                  )}
                </select>
                {canDeleteLine &&
                <button onClick={() => deleteLine(index)}>delete</button>
                }

              </div>
            )}
          </>
        }
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button onClick={() => setModalStatus(false)}>Close</Button>
          <Button intent={Intent.PRIMARY} disabled={!canBeSubmit} onClick={submit}>Create</Button>
        </div>
      </div>

    </Dialog>
  )
}
