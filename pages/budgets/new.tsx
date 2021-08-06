import {
  Button,
  Checkbox,
  FormGroup,
  H1,
  InputGroup,
  Radio,
  RadioGroup,
} from "@blueprintjs/core";
import React, { useState } from "react";
import { useRouter } from "next/router";
import AuthenticationLayout from "../../components/AuthenticationLayout";
import { ProtectRoute } from "../../contexts/auth";
import { useLedger } from "../../contexts/ledger";
import api from "../../api";
import { IdMap } from "../../types";

const PERIODIC = ["Daily", "Weekly", "Monthly", "Quarterly", "Yearly"];

function Page() {
  const router = useRouter();
  const ledgerContext = useLedger();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [periodic, setPeriodic] = useState(PERIODIC[0]);
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("CNY");

  const [accounts, setAccounts] = useState(() => {
    const init: IdMap<boolean> = {};
    Object.keys(ledgerContext.accounts).forEach((it) => {
      init[it] = false;
    });
    return init;
  });

  const handleAccountClick = (id: number) => {
    const newAccount = { ...accounts };
    newAccount[id] = !accounts[id];
    setAccounts(newAccount);
  };

  const submit = async () => {
    const targetAccounts = Object.keys(accounts)
      .filter((it) => accounts[it])
      .map((it) => parseInt(it, 10));
    await api.createBudget(
      name,
      description,
      periodic,
      amount,
      currency,
      targetAccounts
    );

    await router.push("/budgets");
  };

  return (
    <AuthenticationLayout>
      <div className="container">
        <H1>New budget</H1>

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
          <RadioGroup
            inline
            label="Periodic"
            onChange={(e) => setPeriodic(e.target.value)}
            selectedValue={periodic}
          >
            {PERIODIC.map((it) => (
              <Radio key={it} label={it} value={it} />
            ))}
          </RadioGroup>

          <FormGroup label="amount" labelFor="text-amount">
            <InputGroup
              id="text-amount"
              placeholder="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </FormGroup>
          <FormGroup label="currency" labelFor="text-currency">
            <InputGroup
              id="text-currency"
              placeholder="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            />
          </FormGroup>
          <div>
            {Object.keys(accounts).map((it) => (
              <Checkbox
                checked={accounts[it]}
                label={ledgerContext.getAccountAlias(parseInt(it, 10))}
                onChange={() => handleAccountClick(parseInt(it, 10))}
              />
            ))}
          </div>

          <Button onClick={submit}>Create</Button>
        </div>
      </div>
    </AuthenticationLayout>
  );
}

export default ProtectRoute(Page);
