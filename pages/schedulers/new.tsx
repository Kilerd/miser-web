import { Button, FormGroup, H1, InputGroup, TagInput } from "@blueprintjs/core";
import React, { useState } from "react";
import AuthenticationLayout from "../../components/AuthenticationLayout";
import { ProtectRoute } from "../../contexts/auth";
import { DateInput, TimePrecision } from "@blueprintjs/datetime";
import dayjs from "dayjs";
import Select from "react-select";
import { useLedger } from "../../contexts/ledger";
import api from "../../api";
import { useRouter } from "next/router";
import AccountSelector from "../../components/AccountSelector";

function Page() {
  let router = useRouter();
  let ledgerContext = useLedger();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [times, setTimes] = useState("0");
  const [crontab, setCrontab] = useState("");
  const [payee, setPayee] = useState("");
  const [narration, setNarration] = useState("");
  const [lines, setLines] = useState([
    {
      account: null,
      amount: undefined,
      commodity: null,
      commodity_candidates: [],
    },
    {
      account: null,
      amount: undefined,
      commodity: null,
      commodity_candidates: [],
    },
  ]);

  const canDeleteLine = lines.length > 2;
  const canBeSubmit =
    name.trim() !== "" &&
    parseInt(times) > 0 &&
    crontab.trim() !== "" &&
    !(payee.trim() === "" && narration === "");
  const handleLineChange = (e, index, fieldId) => {
    const newLines = [...lines];
    newLines[index][fieldId] = e.target.value;
    setLines(newLines);
  };

  const newLine = () => {
    setLines([
      ...lines,
      { account: null, amount: "", commodity: null, commodity_candidates: [] },
    ]);
  };
  const deleteLine = (target_index) => {
    setLines(lines.filter((value, index) => index != target_index));
  };

  function handleAccountChange(newAccountId: number, index: number) {
    const newLines = [...lines];
    newLines[index].account = newAccountId;
    const commodityCandidates =
      ledgerContext.accounts[newAccountId]?.commodities || [];
    newLines[index].commodity_candidates = commodityCandidates;
    newLines[index].commodity =
      commodityCandidates.length > 0 ? commodityCandidates[0] : null;
    setLines(newLines);
  }

  const submit = async () => {
    let linesReq = lines.map((it) => ({
      account: it.account,
      amount: [it.amount, it.commodity],
    }));
    await api.createNewSchedulerTask({
      name,
      description,
      end_flag: parseInt(times),
      schedule_rule: crontab,
      payee,
      narration,
      tags: [],
      links: [],
      lines: linesReq,
    });
    await router.push("/schedulers");
  };

  return (
    <AuthenticationLayout>
      <div className="container">
        <H1>New Scheduler</H1>

        <div>
          <FormGroup label="name" labelFor="text-name">
            <InputGroup
              id="text-name"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormGroup>

          <FormGroup label="description" labelFor="text-description">
            <InputGroup
              id="text-description"
              placeholder="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormGroup>
          <FormGroup label="times" labelFor="text-times">
            <InputGroup
              id="text-times"
              placeholder="times"
              value={times}
              onChange={(e) => setTimes(e.target.value)}
            />
          </FormGroup>
          <FormGroup label="crontab" labelFor="text-crontab">
            <InputGroup
              id="text-crontab"
              placeholder="crontab"
              value={crontab}
              onChange={(e) => setCrontab(e.target.value)}
            />
          </FormGroup>
          <FormGroup label="payee" labelFor="text-payee">
            <InputGroup
              id="text-payee"
              placeholder="payee"
              value={payee}
              onChange={(e) => setPayee(e.target.value)}
            />
          </FormGroup>

          <FormGroup label="narration" labelFor="text-narration">
            <InputGroup
              id="text-narration"
              placeholder="narration"
              value={narration}
              onChange={(e) => setNarration(e.target.value)}
            />
          </FormGroup>

          <h3>Lines</h3>
          <button onClick={newLine}>new Lines</button>
          {lines.map((one, index) => (
            <div className="line" key={index}>
              <AccountSelector
                value={one.amount}
                onChange={(newAccountId) =>
                  handleAccountChange(newAccountId, index)
                }
              />
              <input
                type="number"
                placeholder="Amount"
                className="input"
                value={one.amount}
                onChange={(e) => handleLineChange(e, index, "amount")}
              />

              <select
                name="select"
                id="exampleSelect"
                defaultValue={one.commodity}
                onChange={(e) => handleLineChange(e, index, "commodity")}
              >
                {one.commodity_candidates.map((candidate) => (
                  <option key={`${index}-${candidate}`} value={candidate}>
                    {candidate}
                  </option>
                ))}
              </select>
              {canDeleteLine && (
                <button onClick={() => deleteLine(index)}>delete</button>
              )}
            </div>
          ))}
          <Button disabled={!canBeSubmit} onClick={submit}>
            Create
          </Button>
        </div>
      </div>
    </AuthenticationLayout>
  );
}

export default ProtectRoute(Page);
