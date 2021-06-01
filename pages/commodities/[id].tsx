import {ProtectRoute} from "../../contexts/auth";
import {useRouter} from "next/router";
import AuthenticationLayout from "../../components/AuthenticationLayout";
import {useLedger} from "../../contexts/ledger";
import React from "react";


function Page() {
  const router = useRouter();
  const id = router.query.id as string;


  const ledgerContext = useLedger();
  const targetAccount = ledgerContext.commodities[id];
  if (targetAccount === undefined) {
    return <div>404</div>
  }


  return (
    <>
      <AuthenticationLayout>
        <div className="container">
          <div className="header">
            <h1>commodity</h1>
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
  )


}

export default ProtectRoute(Page)
