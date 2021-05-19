import {ProtectRoute, useAuth} from "../contexts/auth";
import AuthenticationLayout from "../components/AuthenticationLayout";
import {useLedger} from "../contexts/ledger";
import {HTMLTable} from "@blueprintjs/core";
import React, {useState} from "react";
import api from "../api";


function Page() {
  const authContextType = useAuth();
  const {ledgers} = useLedger();

  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("");

  return (
    <AuthenticationLayout>
      <div>
        <h1>Ledgers</h1>
        <h2>ledger list</h2>
        <HTMLTable bordered={true} striped={true} style={{width: "100%"}}>
          <thead>
          <tr>
            <th>#</th>
            <th>description</th>
            <th>create at</th>
            <th/>
          </tr>
          </thead>
          <tbody>
          {Object.values(ledgers).map(it => (
            <tr key={it.id}>
              <td>{it.id}</td>
              <td>{it.name}</td>
            </tr>

          ))}
          </tbody>
        </HTMLTable>
        <h2>new ledger</h2>

        <input type="text" className="input" placeholder="name" value={name} onChange={event => setName(event.target.value)} />
        <input type="text" className="input" placeholder="currency" value={currency} onChange={event => setCurrency(event.target.value)}/>
        <button className="button" onClick={() => api.newLedger(name, currency)}>create</button>
      </div>
    </AuthenticationLayout>
  )
}


export default ProtectRoute(Page);
