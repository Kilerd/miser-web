<script lang="ts">
    export let isOpen;
    export let toggle;
    import {Modal, ModalHeader, ModalFooter, ModalBody, Button, FormGroup, Label, Input, Spinner} from "sveltestrap/src"
    import Datepicker from 'svelte-calendar';
    import AutoComplete from "simple-svelte-autocomplete";
    import {entries} from "../stores";
    import {api} from "../http"

    let accountList = []
    entries.subscribe(value => {
        let currentEntry = $entries['demo'];
        accountList = currentEntry?.accounts.map((account, index) => {
            return {
                id: index,
                name: account
            }
        })
    })

    async function getItems(keyword) {
        return [
            ...accountList,
            {id: -1, name: keyword}
        ]
    }

    let isSubmit = false;
    let defaultDate = new Date();
    defaultDate.setMinutes(defaultDate.getMinutes() - defaultDate.getTimezoneOffset());
    let date = defaultDate.toJSON().slice(0, 10)
    let payee = "";
    let narration = "";

    let selectAccount;
    let amount = "";
    let selectAccount2;
    let amount2 = "";

    $: canBeSubmit = selectAccount !== undefined && amount !== "" && selectAccount2 !== undefined && amount2 !== "";
    $: submitDisable = !canBeSubmit || isSubmit;

    async function submit() {
        isSubmit = true;
        let lines = [
            {
                account: selectAccount.name,
                amount: [
                    amount,
                    "CNY"
                ]
            },
            {
                account: selectAccount2.name,
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
                <AutoComplete inputId="account1" className="account-input" items={accountList} labelFieldName="name"
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
                <AutoComplete inputId="account2" items={accountList} labelFieldName="name" valueFieldName="name"
                              bind:selectedItem={selectAccount2}
                              searchFunction={getItems} showClear={true}/>
                <FormGroup>
                    <Input bind:value={amount2}/>
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