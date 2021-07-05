import {HTMLTable} from "@blueprintjs/core";
import React, {useState} from "react";
import Link from 'next/link'
import {ProtectRoute} from "../contexts/auth";
import AuthenticationLayout from "../components/AuthenticationLayout";
import {useLedger} from "../contexts/ledger";
import NewCommodityModal from "../components/NewCommodityModal";

function Commodities() {
    const ledgerContext = useLedger();
    const [modalIsOpen, setIsOpen] = useState(false);

    return (
        <>
            <AuthenticationLayout>
                <NewCommodityModal modalStatus={modalIsOpen} setModalStatus={setIsOpen}/>

                <div className="container">
                    <div className="header">
                        <h1>Commodities</h1>
                        <button type="submit" onClick={() => setIsOpen(true)} className="button"> new</button>
                    </div>

                    <HTMLTable bordered striped style={{width: "100%"}}>
                        <thead>
                        <tr>
                            <th>name</th>
                            <th>precision</th>
                            <th>prefix</th>
                            <th>postfix</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {Object.values(ledgerContext.commodities).map(it => (
                            <tr key={it.id}>
                                <td><Link href={`/commodities/${it.id}`}>{it.name}</Link></td>
                                <td>{it.precision}</td>
                                <td>{it.prefix}</td>
                                <td>{it.postfix}</td>
                                <td/>
                            </tr>
                        ))}
                        </tbody>
                    </HTMLTable>
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
