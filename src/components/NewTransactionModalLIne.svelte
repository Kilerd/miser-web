<script lang="ts">
    import AutoComplete from 'simple-svelte-autocomplete';
    import type {Account} from "../types";
    import {accounts} from "../stores";

    export let selectedItem: Account | undefined;
    export let amount;
    export let commodity;


    let accountList: Account[] = [];
    accounts.subscribe((storeValue) => {
        accountList = Object.values(storeValue);
    })

    async function getItems(keyword: string) {
        return [
            ...accountList,
            {id: -1, name: keyword, alias: keyword}
        ]
    }

    function itemShow(item?: Account) {
        if (item === undefined) {
            return "please select"
        }
        return `${item.alias || ''} [${item.full_name}]`
    }
</script>


<div class="flex flex-wrap">
    <div class="w-full lg:w-4/12 px-4">
        <div class="relative w-full mb-3">
            <AutoComplete inputId="account1" className="account-input" items={accountList}
                          labelFunction={itemShow}
                          valueFieldName="name"
                          bind:selectedItem={selectedItem}
                          searchFunction={getItems} showClear={true}/>
        </div>
    </div>
    <div class="w-full lg:w-4/12 px-4">
        <div class="relative w-full mb-3">
            <input bind:value={amount} type="number"
                   class="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"/>


        </div>
    </div>
    <div class="w-full lg:w-4/12 px-4">
        <div class="relative w-full mb-3">
            <select name="select" id="exampleSelect"
                    class="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150">
                <option>CNY</option>
            </select>
        </div>
    </div>
</div>
