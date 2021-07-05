import AuthenticationLayout from "../../components/AuthenticationLayout";
import {ProtectRoute} from "../../contexts/auth";
import {useRouter} from "next/router";
import {useLedger} from "../../contexts/ledger";
import api, {get} from "../../api";
import React, {useCallback, useEffect, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import {HTMLTable, Spinner, Tag} from "@blueprintjs/core";
import useSWR from "swr";


function SingleTransactionPage() {
  const router = useRouter()
  const id = router.query.id as string;
  const {ledger_id, getAccountAlias} = useLedger();

  const {isValidating, data: transaction} = useSWR(`/ledgers/${ledger_id}/transactions/${id}`, get);

  const {
    isValidating: documentValidating,
    data: documents
  } = useSWR(`/ledgers/${ledger_id}/transactions/${id}/documents`, get);


  const [file, setFile] = useState(undefined);
  const [fileLoading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (file !== undefined) {
        setLoading(true);
        await api.uploadDocument(transaction.id, file);
        setLoading(false);
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
          {isValidating ? <Spinner/> :
            <>
              <h1>#{transaction.id} {transaction.payee} {transaction.narration} </h1>
              <p className="desc">{transaction.description}</p>

              <div className="tags">
                {transaction.tags.map(it => (
                  <Tag key={it} style={{marginRight: "0.2rem"}}>{it}</Tag>
                ))}
              </div>
              <div className="desc">
                {transaction.description}
              </div>

              <div className="lines">
                <h2>lines</h2>
                <HTMLTable bordered={true} striped={true} style={{width: "100%"}}>
                  <thead>
                  <tr>
                    <th>#</th>
                    <th>ACCOUNT</th>
                    <th>COST</th>
                  </tr>
                  </thead>
                  <tbody>
                  {transaction.postings.map(it => (
                    <tr key={it.id}>
                      <td>{it.id}</td>
                      <td>{getAccountAlias(it.account)}</td>
                      <td>{it.cost[0]} {it.cost[1]}</td>
                    </tr>
                  ))}
                  </tbody>
                </HTMLTable>
              </div>
            </>
          }
          {documentValidating ? <Spinner/> :
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
              {isValidating ? <Spinner/> :
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
                  {documents.map(it => (
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
            </div>}
        </div>
      </div>

    </AuthenticationLayout>
  )
}

export default ProtectRoute(SingleTransactionPage)
