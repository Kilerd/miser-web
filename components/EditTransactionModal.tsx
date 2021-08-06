import React, { useEffect, useState } from "react";
import api from "../api";
import { useLedger } from "../contexts/ledger";
import Big from "big.js";
import Select from "react-select";
import dayjs from "dayjs";
import {
  Button,
  Classes,
  Dialog,
  FormGroup,
  HTMLTable,
  InputGroup,
  Intent,
  Switch,
  TagInput,
} from "@blueprintjs/core";
import { DateInput, TimePrecision } from "@blueprintjs/datetime";

export default function EditTransactionModal({
  detail,
  modalStatus,
  setModalStatus,
}) {
  const ledgerContext = useLedger();

  const [simpleMode, setSimpleMode] = useState(false);

  const [date, setDate] = useState(() => dayjs());
  const [payee, setPayee] = useState("");
  const [narration, setNarration] = useState("");
  const [tags, setTags] = useState([]);
  const [lines, setLines] = useState([
    {
      account: null,
      desc: "",
      amount: "",
      commodity: null,
      commodity_candidates: [],
    },
    {
      account: null,
      desc: "",
      amount: "",
      commodity: null,
      commodity_candidates: [],
    },
  ]);

  useEffect(() => {
    if (detail !== undefined) {
      setDate(dayjs(detail.time));
      setPayee(detail.payee);
      setNarration(detail.narration);
      setTags(detail.tags);
      setLines(
        detail.postings.map((it) => {
          const targetAccount = ledgerContext.accounts[it.account];

          return {
            account: { label: targetAccount.name, value: targetAccount.id },
            amount: it.cost[0],
            desc: it.description,
            commodity: it.cost[1],
            commodity_candidates: targetAccount.commodities,
          };
        })
      );
      setSimpleMode(detail.postings.length === 2);
    }
  }, [detail]);

  const [isLoading, setLoading] = useState(false);
  const canBeSubmit =
    !isLoading &&
    (payee !== "" || narration !== "") &&
    lines.filter(
      (it) =>
        it.account !== null &&
        it.amount !== "" &&
        it.amount !== null &&
        it.commodity !== null
    ).length === lines.length;

  const canDeleteLine = lines.length > 2;
  const handleLineChange = (e, index, fieldId) => {
    const newLines = [...lines];
    newLines[index][fieldId] = e.target.value;
    setLines(newLines);
  };
  const newLine = () => {
    setLines([
      ...lines,
      {
        account: null,
        desc: "",
        amount: "",
        commodity: null,
        commodity_candidates: [],
      },
    ]);
  };
  const deleteLine = (target_index) => {
    setLines(lines.filter((value, index) => index != target_index));
  };

  const accountOptions = Object.values(
    Object.values(ledgerContext.accounts).reduce((ret, it) => {
      const type = it.name.split(":")[0];
      const item = { label: it.name, value: it.id };
      ret[type] = ret[type] || { label: type.toUpperCase(), options: [] };
      ret[type].options.push(item);
      return ret;
    }, {})
  ).sort();

  function handleAccountChange(e: any, index: number) {
    const selectAccountId = e.value;
    const newLines = [...lines];
    newLines[index].account = e;
    let commodityCandidates =
      ledgerContext.accounts[selectAccountId]?.commodities || [];
    newLines[index].commodity_candidates = commodityCandidates;
    newLines[index].commodity =
      commodityCandidates.length > 0 ? commodityCandidates[0] : null;
    setLines(newLines);
  }

  const submit = async () => {
    setLoading(true);
    const lineReq = lines.map((line) => ({
      account: parseInt(line.account.value, 10),
      amount: [line.amount, line.commodity],
      description: line.desc === "" ? null : line.desc,
    }));
    await api.updateTransaction(
      detail.id,
      date.toDate(),
      payee,
      narration,
      tags,
      [],
      lineReq
    );
    setLoading(false);
    setModalStatus(false);
    ledgerContext.update("TRANSACTIONS");
  };

  function handleSimpleModeAmountInput(e: React.ChangeEvent<HTMLInputElement>) {
    let big = new Big(e.target.value);
    let negative = big.mul(-1);
    lines[0].amount = negative.toFixed();
    lines[1].amount = big.toFixed();
    setLines([...lines]);
  }

  return (
    <div>
      <div className={Classes.DIALOG_BODY}>
        <div>
          <FormGroup label="Date">
            <DateInput
              defaultValue={date.toDate()}
              parseDate={(s) => new Date(s)}
              formatDate={(date) => date.toLocaleString()}
              highlightCurrentDay
              shortcuts
              showActionsBar
              timePickerProps={{ showArrowButtons: true }}
              timePrecision={TimePrecision.MINUTE}
              onChange={(date) => setDate(dayjs(date))}
              fill
            />
          </FormGroup>

          <FormGroup label="Payee" labelFor="text-payee">
            <InputGroup
              id="text-payee"
              placeholder="Payee"
              value={payee}
              onChange={(e) => setPayee(e.target.value)}
            />
          </FormGroup>

          <FormGroup label="Narration" labelFor="text-narration">
            <InputGroup
              id="text-narration"
              placeholder="Narration"
              value={narration}
              onChange={(e) => setNarration(e.target.value)}
            />
          </FormGroup>

          <FormGroup label="Tags">
            <TagInput
              values={tags}
              placeholder="Separate tags with commas..."
              onChange={(e) =>
                setTags(e.filter((it, idx) => e.indexOf(it) === idx))
              }
              rightElement={
                <Button
                  icon="cross"
                  minimal={true}
                  onClick={() => setTags([])}
                />
              }
            />
          </FormGroup>
        </div>

        <Switch
          checked={!simpleMode}
          label="Enhanced mode"
          onChange={() => setSimpleMode(!simpleMode)}
          disabled={lines.length != 2}
        />
        {simpleMode ? (
          <div>
            <div>
              <Select
                defaultValue={lines[0].account}
                options={accountOptions}
                onChange={(inputValue, actionMeta) =>
                  handleAccountChange(inputValue, 0)
                }
              />
              <Select
                defaultValue={lines[1].account}
                options={accountOptions}
                onChange={(inputValue, actionMeta) =>
                  handleAccountChange(inputValue, 1)
                }
              />
            </div>
            <div>
              <input
                type="number"
                placeholder="Amount"
                className="input"
                value={lines[1].amount}
                onChange={(e) => handleSimpleModeAmountInput(e)}
              />

              <select
                name="select"
                id="exampleSelect"
                defaultValue={lines[0].commodity}
                onChange={(e) => {
                  handleLineChange(e, 0, "commodity");
                  handleLineChange(e, 1, "commodity");
                }}
              >
                {lines[0].commodity_candidates
                  .filter(
                    (it) => lines[1].commodity_candidates.indexOf(it) !== -1
                  )
                  .map((candidate) => (
                    <option key={`${candidate}`} value={candidate}>
                      {candidate}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        ) : (
          <>
            <h3>Lines</h3>
            <button onClick={newLine}>new Lines</button>
            <HTMLTable style={{ width: "100%" }}>
              <tbody>
                {lines.map((one, index) => (
                  <tr>
                    <td width="50%">
                      <Select
                        defaultValue={one.account}
                        options={accountOptions}
                        onChange={(inputValue, actionMeta) =>
                          handleAccountChange(inputValue, index)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        placeholder="desc"
                        className="input"
                        value={one.desc}
                        onChange={(e) => handleLineChange(e, index, "desc")}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        placeholder="Amount"
                        className="input"
                        value={one.amount}
                        onChange={(e) => handleLineChange(e, index, "amount")}
                      />
                    </td>
                    <td>
                      <select
                        name="select"
                        id="exampleSelect"
                        className="input"
                        defaultValue={one.commodity}
                        onChange={(e) =>
                          handleLineChange(e, index, "commodity")
                        }
                      >
                        {one.commodity_candidates.map((candidate) => (
                          <option
                            key={`${index}-${candidate}`}
                            value={candidate}
                          >
                            {candidate}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      {canDeleteLine && (
                        <button onClick={() => deleteLine(index)}>
                          delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </HTMLTable>
          </>
        )}
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button onClick={() => setModalStatus(false)}>Close</Button>
          <Button
            intent={Intent.PRIMARY}
            disabled={!canBeSubmit}
            onClick={submit}
          >
            update
          </Button>
        </div>
      </div>
    </div>
  );
}
