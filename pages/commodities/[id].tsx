import { useRouter } from "next/router";
import React, { useState } from "react";
import { HTMLTable } from "@blueprintjs/core";
import useSWR from "swr";
import dayjs from "dayjs";
import { ProtectRoute } from "../../contexts/auth";
import AuthenticationLayout from "../../components/AuthenticationLayout";
import { useLedger } from "../../contexts/ledger";
import api, { get } from "../../api";

function Page() {
  const router = useRouter();
  const id = parseInt(router.query.id as string, 10);

  const ledgerContext = useLedger();
  const targetCommodity = Object.values(ledgerContext.commodities).find(
    (it) => it.id === id
  );
  if (targetCommodity === undefined) {
    return <div>404</div>;
  }

  const { data: fetchedPrices } = useSWR(
    `/ledgers/${ledgerContext.ledger_id}/commodities/${id}/prices`,
    get
  );

  const prices = fetchedPrices || [];

  // settings
  const [precision, setPrecision] = useState(targetCommodity.precision);
  const [prefix, setPrefix] = useState(targetCommodity.prefix);
  const [postfix, setPostfix] = useState(targetCommodity.postfix);

  const update = async () => {
    await api.updateCommodity(
      id,
      precision,
      prefix === "" ? null : prefix,
      postfix === "" ? null : postfix
    );
    ledgerContext.update("COMMODITY");
  };
  return (
    <>
      <AuthenticationLayout>
        <div className="container">
          <div className="header">
            <h1>{targetCommodity.name}</h1>
          </div>
          <div>
            <h2>Prices</h2>
            <HTMLTable bordered striped style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>ACCOUNT</th>
                  <th>COST</th>
                </tr>
              </thead>
              <tbody>
                {prices.map((it) => (
                  <tr key={`${it.time}-${it.target}`}>
                    <td>{dayjs(it.time).format("MMM DD, YYYY, HH:mm")}</td>
                    <td>{it.amount}</td>
                    <td>{it.target}</td>
                  </tr>
                ))}
              </tbody>
            </HTMLTable>
          </div>
          <div>
            <h2>Setting</h2>

            <input
              type="number"
              value={precision}
              placeholder="name"
              onChange={(e) => setPrecision(parseInt(e.target.value, 10))}
            />
            <input
              type="text"
              value={prefix}
              placeholder="name"
              onChange={(e) => setPrefix(e.target.value)}
            />
            <input
              type="text"
              value={postfix}
              placeholder="alias"
              onChange={(e) => setPostfix(e.target.value)}
            />
            <button onClick={update}>update</button>
          </div>
        </div>
      </AuthenticationLayout>
      <style jsx>{`
        .header {
          display: flex;
          justify-content: space-between;

          .left {
            flex: 1;
          }

          .right {
            padding: 2em 1em 1em;
          }
        }
      `}</style>
    </>
  );
}

export default ProtectRoute(Page);
