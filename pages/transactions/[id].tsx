import AuthenticationLayout from "../../components/AuthenticationLayout";
import {ProtectRoute} from "../../contexts/auth";
import {useRouter} from "next/router";
import {useLedger} from "../../contexts/ledger";
import {useAsync} from "react-async-hook";
import api from "../../api";
import React, {useCallback, useEffect, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import {GetServerSideProps} from 'next'
import Loadable from "../../components/Loadable";


function SingleTransactionPage() {
  const router = useRouter()
  const id = router.query.id as string;
  const ledgerContext = useLedger();
  const targetTransaction = ledgerContext.transactions[id];
  if (targetTransaction === undefined) {
    return <div>404</div>
  }

  const {
    result: documents,
    loading,
    error,
    execute
  } = useAsync(async () => await api.getDocuments(targetTransaction.id), [targetTransaction.id]);


  const [file, setFile] = useState(undefined);
  const [fileLoading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (file !== undefined) {
        setLoading(true);
        await api.uploadDocument(targetTransaction.id, file);
        setLoading(false);
        await execute();
      }
    })()
  }, [file])

  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
    setFile(acceptedFiles);
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <AuthenticationLayout>
      <div className="container">
        <div className="transaction">
          <h1>#{targetTransaction.id} {targetTransaction.payee} {targetTransaction.narration} </h1>
          <p className="desc">{targetTransaction.description}</p>

          <div className="tags">
            {targetTransaction.tags.map(it => (
              <span key={it} className="tag">{it}</span>
            ))}
          </div>

          <div className="lines">
            <h2>lines</h2>
            <table>
              <thead>
              <tr>
                <th>#</th>
                <th>ACCOUNT</th>
                <th>COST</th>
              </tr>
              </thead>
              <tbody>
              {targetTransaction.lines.map(it => (
                <tr key={it.id}>
                  <td>{it.id}</td>
                  <td>{ledgerContext.getAccountAlias(it.account)}</td>
                  <td>{it.cost[0]} {it.cost[1]}</td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
          <div className="documents">
            <h2>documents</h2>
            {fileLoading ? <div>uploading...</div> :
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                {
                  isDragActive ?
                    <p>Drop the files here ...</p> :
                    <p>Drag 'n' drop some files here, or click to select files</p>
                }
              </div>
            }
            {loading ? <p>loading...</p> :
              error ? <div>{error}</div> :
                <table>
                  <thead>
                  <tr>
                    <th>#</th>
                    <th>NAME</th>
                    <th>DATE</th>
                    <th/>
                  </tr>
                  </thead>
                  <tbody>
                  {console.log(documents)}
                  {documents.data.data.map(it => (
                    <tr key={it.id}>
                      <td>{it.id}</td>
                      <td>{it.filename}</td>
                      <td>{it.create_time}</td>
                      <td><a href="#">download</a></td>
                    </tr>
                  ))}
                  </tbody>
                </table>
            }
          </div>
        </div>
      </div>

    </AuthenticationLayout>
  )
}

export default ProtectRoute(SingleTransactionPage)
