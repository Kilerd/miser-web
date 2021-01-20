<script lang="ts">
    import {accounts, commodities} from '../stores';
    import {api} from '../http'
    import type{AccountTreeItem} from "../types";

    export let modalClose;
    export let account: AccountTreeItem;


    let isSubmitting = false;
    let commoditiesSelectStatus: { [commodity: string]: boolean } = {};


    commodities.subscribe(value => {
        let a: { [name: string]: boolean } = {};
        Object.keys(value).forEach(commodity => {
            a[commodity] = account.commodities.indexOf(commodity) !== -1;
        })
        commoditiesSelectStatus = a;
    })

    function clickCommodity(commodity: any) {
        commoditiesSelectStatus[commodity] = !commoditiesSelectStatus[commodity];
    }

    $: canBeSubmit = ['Income:', 'Assets:', 'Equity:', 'Liabilities:', 'Expenses:'].some(value => account.fullName.startsWith(value));

    async function submit() {
        isSubmitting = true;
        const selectedCommodities = Object.keys(commoditiesSelectStatus).filter(key => commoditiesSelectStatus[key] === true);
        await api.updateAccount(account.id, account.fullName, account.alias === "" ? null : account.alias, selectedCommodities)
        isSubmitting = false;
        accounts.fetchLatest();
        modalClose();
    }

</script>

<style>
    div.line {
        display: flex;
        flex-direction: row;
    }

    div :global(.autocomplete) {
        flex: 1 auto;
    }
</style>

<div>
    <h1>EDIT ACCOUNT</h1>
    <div class="line">
        <label for="name">Account name</label>
        <input bind:value={account.fullName} placeholder="Name" id="name" class="input"/>

    </div>
    <div class="line">
        <label for="alias">Alias</label>
        <input bind:value={account.alias} placeholder="alias" id="alias" class="input"/>
    </div>
    <div class="line">
        {#each Object.keys(commoditiesSelectStatus) as commodity}
            <input type="checkbox" bind:checked={commoditiesSelectStatus[commodity]} class="input"
                   id="commodity-{commodity}"> <label
                for="commodity-{commodity}">{commodity}</label>
        {/each}
    </div>

</div>

<button disabled={!canBeSubmit || isSubmitting} on:click={submit} class="button">
    {#if isSubmitting}
        loading....
    {:else}
        Update
    {/if}
</button>
<button color="secondary" on:click={modalClose} class="button">Cancel</button>
