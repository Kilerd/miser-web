import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Tag } from "@blueprintjs/core";
import useSWR from "swr";
import { ProtectRoute } from "../../contexts/auth";
import AuthenticationLayout from "../../components/AuthenticationLayout";
import { useLedger } from "../../contexts/ledger";
import api, { BASE_URL, get } from "../../api";
import dayjs from "dayjs";
import Amount from "../../components/Amount";
import DarkCard from "../../basic/DarkCard";

function SingleTransactionPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { ledger_id, getAccountAlias } = useLedger();

  const { isValidating, data: transaction } = useSWR(
    `/ledgers/${ledger_id}/transactions/${id}`,
    get
  );

  const {
    isValidating: documentValidating,
    data: documents,
    revalidate: revalidateDocument,
  } = useSWR(`/ledgers/${ledger_id}/transactions/${id}/documents`, get);

  const [file, setFile] = useState(undefined);
  const [fileLoading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (file !== undefined) {
        setLoading(true);
        await api.uploadDocument(transaction.id, file);
        setLoading(false);
        revalidateDocument();
      }
    })();
  }, [file]);

  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    setFile(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <>
      <AuthenticationLayout>
        <div className="container">
          <div className="transaction">
            {transaction && (
              <>
                <div className="info">
                  <div className="left">
                    <div className="time">
                      {dayjs(transaction.time).format(
                        "HH:mm MMMM D YYYY , dddd"
                      )}
                    </div>
                    <div className="payee-narration">
                      <span className="payee">{transaction.payee}</span>
                      <span className="narration">{transaction.narration}</span>
                    </div>

                    <div className="desc">{transaction.description}</div>
                    <div className="tags">
                      {transaction.tags.map((it) => (
                        <Tag key={it} style={{ marginRight: "0.2rem" }}>
                          {it}
                        </Tag>
                      ))}
                    </div>
                  </div>
                  <div className="right">
                    <Amount amount={100.0} commodity="CNY" size={1.5} color />
                  </div>
                </div>
                <div className="detail">
                  <div className="left">
                    <div className="lines">
                      <DarkCard title="Lines">
                        {transaction.postings.map((it) => (
                          <div key={it.id} className="line">
                            <div className="account">
                              {getAccountAlias(it.account)}
                              {it.description && (
                                <span className="desc">{it.description}</span>
                              )}
                            </div>
                            <div className="amount">
                              <Amount
                                amount={it.cost[0]}
                                commodity={it.cost[1]}
                              />
                            </div>
                          </div>
                        ))}
                      </DarkCard>
                    </div>
                    {documents && (
                      <DarkCard title="Documents">
                        <div className="documents">
                          {fileLoading ? (
                            <div>uploading...</div>
                          ) : (
                            <div {...getRootProps()}>
                              <input {...getInputProps()} />
                              {isDragActive ? (
                                <p>Drop the files here ...</p>
                              ) : (
                                <p>
                                  Drag drop some files here, or click to select
                                  files
                                </p>
                              )}
                            </div>
                          )}
                          <table>
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>NAME</th>
                                <th>DATE</th>
                                <th />
                              </tr>
                            </thead>
                            <tbody>
                              {documents.map((it) => (
                                <tr key={it.id}>
                                  <td>{it.id}</td>
                                  <td>{it.filename}</td>
                                  <td>{it.create_time}</td>
                                  <td>
                                    <a
                                      target="_blank"
                                      href={`${BASE_URL}/ledgers/${ledger_id}/transactions/${id}/documents/${it.id}/download`}
                                      rel="noreferrer"
                                    >
                                      download
                                    </a>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </DarkCard>
                    )}
                  </div>
                  <div className="right">
                    <div className="metas">
                      <div className="header">Metas</div>
                      {transaction &&
                        transaction.metas.map((one) => (
                          <div className="meta">
                            <div className="key">{one.key}</div>
                            <div className="value">{one.value}</div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </AuthenticationLayout>
      <style jsx>{`
        div.transaction {
          margin-top: 3rem;
        }

        div.info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 3rem;

          div.left {
            .time {
              color: rgba(92, 112, 128, 0.7);
              margin-bottom: 0.4rem;
            }

            .payee {
              font-size: 1.7rem;
              font-weight: 500;

              :after {
                content: "•";
                margin: 0 0.2rem;
              }
            }

            .narration {
              font-size: 1.7rem;
            }
          }
        }

        div.line {
          display: flex;
          justify-content: space-between;
          //align-items: center;
          margin-bottom: 1rem;
          div.account {
            span.desc {
              color: rgba(92, 112, 128, 0.7);
              :before {
                content: "(";
                margin: 0 0.2rem;
              }
              :after {
                content: ")";
                margin: 0 0.2rem;
              }
            }
          }
        }

        div.detail {
          display: flex;

          div.left {
            flex: 0 60%;
            margin-right: 5rem;
          }

          div.right {
            flex: 0 30%;
          }
        }

        div.metas {
          .header {
            font-weight: 500;
            font-size: 1.2rem;
            margin-bottom: 1rem;
          }

          .meta {
            margin-bottom: 1rem;

            div.key {
              font-weight: 500;
              margin-bottom: 0.3rem;
            }

            div.value {
              font-size: 1.1rem;
            }
          }

          margin-bottom: 2rem;
        }
      `}</style>
    </>
  );
}

export default ProtectRoute(SingleTransactionPage);
