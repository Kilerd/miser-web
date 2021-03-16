import {ProtectRoute} from "../contexts/auth";
import {connect} from 'react-redux'
import React, {useState} from "react";
import AuthenticationLayout from "../components/AuthenticationLayout";
import {useLedger} from "../contexts/ledger";
import NewCommodityModal from "../components/NewCommodityModal";


function Commodities() {
  const ledgerContext = useLedger();
  const [modalIsOpen, setIsOpen] = useState(false);


  const commoditiesDOM = Object.values(ledgerContext.commodities).map(one => (
    <div key={one.id}>{one.name}</div>
  ));
  return (
    <>
      <AuthenticationLayout>
        <NewCommodityModal modalStatus={modalIsOpen} setModalStatus={setIsOpen}/>

        <div className="container">
          <div className="header">
            <h1>Commodities</h1>
            <button onClick={() => setIsOpen(true)} className="button"> new</button>
          </div>


          {commoditiesDOM}
        </div>

      </AuthenticationLayout>
      <style jsx>{`
        .header {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        }
      `}</style>
    </>

  )
}


export default ProtectRoute(Commodities)
