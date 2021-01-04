<script lang="ts">
    import {accounts, commodities} from '../stores';
    import {api} from '../http'

    export let isOpen: boolean;
    export let toggle: () => boolean;


    let isSubmitting = false;
    let name = '';
    let alias = '';
    let commoditiesSelectStatus: { [commodity: string]: boolean } = {};

    let initChecked = true;
    let amount = '';
    let commodity = 'CNY';
    let pad: string | undefined = undefined;


    accounts.subscribe(value => {
        let find = Object.values(value).find(value => value.full_name === 'Equity:Opening-Balances');
        if (pad === undefined) {
            pad = find?.id;
        }
    })
    commodities.subscribe(value => {
        let a: { [name: string]: boolean } = {};
        Object.keys(value).forEach(commodity => {
            a[commodity] = false;
        })
        commoditiesSelectStatus = a;
    })

    function clickCommodity(commodity: any) {
        commoditiesSelectStatus[commodity] = !commoditiesSelectStatus[commodity];
    }

    $: canBeSubmit = ['Income:', 'Assets:', 'Equity:', 'Liabilities:', 'Expenses:'].some(value => name.startsWith(value));

    async function submit() {
        isSubmitting = true;
        const selectedCommodities = Object.keys(commoditiesSelectStatus).filter(key => commoditiesSelectStatus[key] === true);
        await api.createAccount(name, alias, selectedCommodities, initChecked, pad, amount, commodity)
        isSubmitting = false;
        toggle()
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
    <div class="line">
            <input bind:value={name} placeholder="Name"/>
            <input bind:value={alias} placeholder="alias"/>
    </div>
    <div class="line">
        {#each Object.keys(commoditiesSelectStatus) as commodity}
            <div on:click={clickCommodity(commodity)}>{commodity}
                {#if commoditiesSelectStatus[commodity]}yes{:else}no{/if}
            </div>
        {/each}
    </div>
    <div class="line">
                <input type="checkbox" bind:checked={initChecked} on:click={() => initChecked = !initChecked}/>
                init
    </div>
    {#if initChecked}
        <div class="line">

                <input type="select" name="select" id="exampleSelect" bind:value={pad}>
                    {#if pad === undefined}
                        <option value="{undefined}">Pls select pad account</option>
                    {/if}
                    {#each Object.values($accounts) as account }
                        <option value="{account.id}">[{account.name}] [{account.full_name}]</option>
                    {/each}
        </div>
        <div class="line">

                <input bind:value={amount} pattern="[0-9]{4}"/>

        </div>
        <div class="line">

                <input type="select" name="select" id="exampleSelect2" bind:value={commodity}>
                    <option>CNY</option>
        </div>
    {/if}
</div>


{initChecked} {pad} {amount} {commodity}
<button color="primary" disabled={!canBeSubmit || isSubmitting} on:click={submit}>
    {#if isSubmitting}
        loading....
    {:else}
        Create
    {/if}
</button>
<button color="secondary" on:click={toggle}>Cancel</button>
