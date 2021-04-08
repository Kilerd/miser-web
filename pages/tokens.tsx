import {ProtectRoute, useAuth} from "../contexts/auth";
import {useAsync} from "react-async-hook";
import AuthenticationLayout from "../components/AuthenticationLayout";
import api from "../api";
import {Button, ControlGroup, H1, H3, H5, HTMLTable, InputGroup, Intent} from "@blueprintjs/core";
import React, {useState} from "react";
import {Classes, Popover2} from "@blueprintjs/popover2";
import dayjs from "dayjs";


function Page() {
  const authContextType = useAuth();

  const [tokens, setTokens] = useState([]);
  const [newTokenDescription, setNewTokenDescription] = useState("");
  const [newToken, setNewToken] = useState(null);
  const {
    result,
    loading,
    error,
    execute
  } = useAsync(async () => {
    const res = await api.getTokens();
    setTokens(res.data.data);
  }, []);

  async function deleteToken(id: string) {
    await api.deleteToken(id);
    setTokens(tokens.filter(it => it.id !== id))
  }

  async function createNewToken() {
    const token = await api.newToken(newTokenDescription);
    setNewToken(token);
    await execute()
  }


  return (
    <AuthenticationLayout>
      <div className="container">
        <H1>Tokens</H1>

        <H3>New</H3>
        {newToken && <div>
            <p>please remember this token value, it would not be showed again.</p>
            <p>value: {newToken.value}</p>
        </div>}

        <ControlGroup fill={false} vertical={false}>
          <InputGroup placeholder="description" value={newTokenDescription} onChange={e=>setNewTokenDescription(e.target.value)} />
          <Button icon="small-plus" onClick={createNewToken}>Create</Button>
        </ControlGroup>

        {loading ? <p>loading...</p> :
          error ? <div>{error}</div> :
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
              {tokens.map(it => (
                <tr key={it.id}>
                  <td>{it.id}</td>
                  <td>{it.description}</td>
                  <td>{dayjs(it.create_at).format()}</td>
                  <td>
                    <Popover2 content={<div key="text" style={{padding: "1rem"}}>
                      <H5>Confirm deletion</H5>
                      <div style={{display: "flex", justifyContent: "flex-end", marginTop: 15}}>
                        <Button className={Classes.POPOVER2_DISMISS} style={{marginRight: 10}}>
                          Cancel
                        </Button>
                        <Button intent={Intent.DANGER} onClick={() => deleteToken(it.id)}
                                className={Classes.POPOVER2_DISMISS}>
                          Delete
                        </Button>
                      </div>
                    </div>}>
                      <Button minimal icon="trash"/>
                    </Popover2>
                  </td>
                </tr>
              ))}
              </tbody>
            </HTMLTable>
        }


      </div>

    </AuthenticationLayout>
  )
}


export default ProtectRoute(Page);
