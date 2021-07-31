import React from "react";
import Select from 'react-select';
import {useLedger} from "../contexts/ledger";


interface Props {
    value: number,

    onChange(value): void
}

export default function AccountSelector(props: Props) {
    const {value, onChange} = props;
    const {accounts} = useLedger();
    const accountOptions = Object.values(Object.values(accounts)
        .filter(it => it.status === "Open")
        .reduce((ret, it) => {
            const type = it.name.split(":")[0];
            const item = {label: it.name, value: it.id};
            ret[type] = ret[type] || {label: type.toUpperCase(), options: []}
            ret[type].options.push(item);
            return ret;
        }, {})).sort();
    return (
        <Select
            defaultValue={value || ""}
            options={accountOptions}
            onChange={(selectItem) => onChange(selectItem.value)}
        />
    )

}