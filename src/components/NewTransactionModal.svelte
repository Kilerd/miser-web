<script lang="ts">
    import {Button, FormGroup, Input, Modal, ModalBody, ModalFooter, ModalHeader, Spinner} from 'sveltestrap/src'
    import AutoComplete from 'simple-svelte-autocomplete';
    import {accounts, entries} from '../stores';
    import {api} from '../http'



    export let isOpen: boolean;
    export let toggle: () => boolean;

    let accountList= [];
    accounts.subscribe((storeValue) => {
        accountList = Object.values(storeValue);
    })

    async function getItems(keyword: string) {
        return [
            ...accountList,
            {id: -1, name: keyword, alias: keyword}
        ]
    }

    let isSubmit = false;
    let defaultDate = new Date();
    defaultDate.setMinutes(defaultDate.getMinutes() - defaultDate.getTimezoneOffset());
    let date = defaultDate.toJSON().slice(0, 10)
    let payee = "";
    let narration = "";

    let selectAccount;
    let amount: string = "";
    let selectAccount2;
    let amount2: string = "";

    $: canBeSubmit = selectAccount !== undefined && amount !== "" && selectAccount2 !== undefined && amount2 !== "";
    $: submitDisable = !canBeSubmit || isSubmit;

    async function submit() {
        isSubmit = true;
        let lines = [
            {
                account: selectAccount.id,
                amount: [
                    amount,
                    "CNY"
                ]
            },
            {
                account: selectAccount2.id,
                amount: [
                    amount2,
                    "CNY"
                ]
            }
        ]

        await api.createTransaction(date, payee, narration, [], [], lines)
        isSubmit = false;
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
    <ModalHeader {toggle}>New Transaction</ModalHeader>
    <ModalBody>
        <div>
            <div class="line">
                <FormGroup>
                    <Input
                            type="date"
                            name="date"
                            id="exampleDate"
                            bind:value={date}
                            placeholder="2020-10-10"/>
                </FormGroup>
                <FormGroup>
                    <Input bind:value={payee} placeholder="Payee"/>
                </FormGroup>
                <FormGroup>
                    <Input bind:value={narration} placeholder="Narration"/>
                </FormGroup>
            </div>


            <div class="line">
                <AutoComplete inputId="account1" className="account-input" items={accountList} labelFunction={item => `${item.alias || ""} [${item.full_name}]`}
                              valueFieldName="name"
                              bind:selectedItem={selectAccount}
                              searchFunction={getItems} showClear={true}/>
                <FormGroup>
                    <Input bind:value={amount}/>
                </FormGroup>
                <FormGroup>
                    <Input type="select" name="select" id="exampleSelect">
                        <option>CNY</option>
                    </Input>
                </FormGroup>
            </div>
            <div class="line">
                <AutoComplete inputId="account2" items={accountList} labelFunction={item => `${item.alias || ""} [${item.full_name}]`} valueFieldName="name"
                              bind:selectedItem={selectAccount2}
                              searchFunction={getItems} showClear={true}/>
                <FormGroup>
                    <Input bind:value={amount2} pattern="[0-9]{4}"/>
                </FormGroup>
                <FormGroup>
                    <Input type="select" name="select" id="exampleSelect2">
                        <option>CNY</option>
                    </Input>
                </FormGroup>
            </div>
        </div>


    </ModalBody>
    <ModalFooter>
        <Button color="primary" disabled={submitDisable} on:click={submit}>
            {#if isSubmit}
                <Spinner color="light" size="sm"/>
            {:else}
                Create
            {/if}
        </Button>
        <Button color="secondary" on:click={toggle}>Cancel</Button>
    </ModalFooter>
</Modal>