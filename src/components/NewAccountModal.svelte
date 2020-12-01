<script lang="ts">


    import {Button, FormGroup, Input, Modal, ModalBody, ModalFooter, ModalHeader, Spinner, Label} from 'sveltestrap/src'
    import AutoComplete from 'simple-svelte-autocomplete';
    import {accounts, commodities, entries} from '../stores';
    import {api} from '../http'

    export let isOpen: boolean;
    export let toggle: () => boolean;


    let isSubmitting = false;
    let name = "";
    let alias = "";
    let commoditiesSelectStatus: { [commodity: string]: boolean } = {};

    let initChecked = true;
    let amount = "";
    let commodity = "CNY";
    let pad = undefined;


    accounts.subscribe(value => {
        let find = Object.values(value).find(value => value.full_name === 'Equity:Opening-Balances');
        if (pad === undefined) {
            pad = find?.id;
        }
    })
    commodities.subscribe(value => {
        let a = {};
        Object.keys(value).forEach(commodity => {
            a[commodity] = false;
        })
        commoditiesSelectStatus = a;
    })

    function clickCommodity(commodity: any) {
        commoditiesSelectStatus[commodity] = !commoditiesSelectStatus[commodity];
    }

    $: canBeSubmit = ['Income:', "Assets:", "Equity:", "Liabilities:", "Expenses:"].some(value => name.startsWith(value));

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

<Modal isOpen={isOpen} centered={true} fade={true} backdrop={false} size="lg" {toggle}>
    <ModalHeader {toggle}>New Commodity</ModalHeader>
    <ModalBody>
        <div>
            <div class="line">
                <FormGroup>
                    <Input bind:value={name} placeholder="Name"/>
                </FormGroup>
                <FormGroup>
                    <Input bind:value={alias} placeholder="alias"/>
                </FormGroup>
            </div>
            <div class="line">
                {#each Object.keys(commoditiesSelectStatus) as commodity}
                    <div on:click={clickCommodity(commodity)}>{commodity}
                        {#if commoditiesSelectStatus[commodity]}yes{:else}no{/if}
                    </div>
                {/each}
            </div>
            <div class="line">
                <FormGroup check>
                    <Label check>
                        <Input type="checkbox" bind:checked={initChecked} on:click={() => initChecked = !initChecked}/>
                        init
                    </Label>
                </FormGroup>
            </div>
            {#if initChecked}
                <div class="line">
                    <FormGroup>
                        <Label for="exampleSelect">Select</Label>
                        <Input type="select" name="select" id="exampleSelect" bind:value={pad}>
                            {#if pad === undefined}
                                <option value="{undefined}">Pls select pad accoutn</option>
                            {/if}
                            {#each Object.values($accounts) as account }
                                <option value="{account.id}">[{account.name}] [{account.full_name}]</option>
                            {/each}
                        </Input>
                    </FormGroup>
                </div>
                <div class="line">
                    <FormGroup>
                        <Input bind:value={amount} pattern="[0-9]{4}"/>
                    </FormGroup>
                </div>
                <div class="line">
                    <FormGroup>
                        <Input type="select" name="select" id="exampleSelect2" bind:value={commodity}>
                            <option>CNY</option>
                        </Input>
                    </FormGroup>
                </div>
            {/if}
        </div>


    </ModalBody>
    <ModalFooter>
        {initChecked} {pad} {amount} {commodity}
        <Button color="primary" disabled={!canBeSubmit || isSubmitting} on:click={submit}>
            {#if isSubmitting}
                <Spinner color="light" size="sm"/>
            {:else}
                Create
            {/if}
        </Button>
        <Button color="secondary" on:click={toggle}>Cancel</Button>
    </ModalFooter>
</Modal>