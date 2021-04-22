import {ProtectRoute} from "../contexts/auth";
import {useAsync} from "react-async-hook";
import AuthenticationLayout from "../components/AuthenticationLayout";
import api from "../api";
import {Button, H1, HTMLTable} from "@blueprintjs/core";
import React, {useState} from "react";
import dayjs from "dayjs";


function Page() {

  const [schedulers, setSchedulers] = useState([]);
  const {
    loading,
    error,
    execute
  } = useAsync(async () => {
    const res = await api.getSchedulerSummaries();
    setSchedulers(res);
  }, []);

  async function switchActiveStatus(id: string, currentStatus: boolean) {
    if (currentStatus) {
      await api.deactivateSchedulerTask(id);
    } else {
      await api.activateSchedulerTask(id);
    }
    await execute()
  }


  return (
    <AuthenticationLayout>
      <div className="container">
        <H1>Schedulers</H1>

        {loading ? <p>loading...</p> :
          error ? <div>{error}</div> :
            <HTMLTable bordered={true} striped={true} style={{width: "100%"}}>
              <thead>
              <tr>
                <th>name</th>
                <th>description</th>
                <th>active</th>
                <th>End flag</th>
                <th>last schedule at</th>
                <th>schedule times</th>
                <th/>
              </tr>
              </thead>
              <tbody>
              {schedulers.map(it => (
                <tr key={it.id}>
                  <td>{it.name}</td>
                  <td>{it.description}</td>
                  <td>{it.active.toString()}</td>
                  <td>{it.end_flag} {it.end_date} {it.end_times}</td>
                  <td>{it.last_schedule_time === null ? "" : dayjs(it.last_schedule_time).format()}</td>
                  <td>{it.schedule_times}</td>
                  <td>
                    <Button onClick={()=>switchActiveStatus(it.id, it.active)}>{it.active? "Stop": "Active"}</Button>
                    <Button>delete</Button>
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
