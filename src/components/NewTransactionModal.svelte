<script lang="ts">
    import {Button, FormGroup, Input, Modal, ModalBody, ModalFooter, ModalHeader, Spinner} from 'sveltestrap/src'
    import AutoComplete from 'simple-svelte-autocomplete';
    import {accounts} from '../stores';
    import {api} from '../http'
    import type {Account} from '../types';

    interface AccountSelectItem {
        id: number,
        keyword: string,
        alias: string
    }

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

    let isSubmit = false;
    let defaultDate = new Date();
    defaultDate.setMinutes(defaultDate.getMinutes() - defaultDate.getTimezoneOffset());
    let date = defaultDate.toJSON().slice(0, 10)
    let payee = '';
    let narration = '';

    let selectAccount: AccountSelectItem;
    let amount: string = '';
    let selectAccount2: AccountSelectItem;
    let amount2: string = '';

    $: canBeSubmit = selectAccount !== undefined && amount !== '' && selectAccount2 !== undefined && amount2 !== '';
    $: submitDisable = !canBeSubmit || isSubmit;

    async function submit() {
        isSubmit = true;
        let lines = [
            {
                account: selectAccount.id,
                amount: [
                    amount,
                    'CNY'
                ]
            },
            {
                account: selectAccount2.id,
                amount: [
                    amount2,
                    'CNY'
                ]
            }
        ]

        await api.createTransaction(date, payee, narration, [], [], lines)
        isSubmit = false;
    }

    function itemShow(item: Account) {
        return `${item.alias || ''} [${item.full_name}]`
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




<div class="p-8 m-4">
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
            <AutoComplete inputId="account1" className="account-input" items={accountList}
                          labelFunction={itemShow}
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
            <AutoComplete inputId="account2" items={accountList}
                          labelFunction={itemShow} valueFieldName="name"
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


    <Button color="primary" disabled={submitDisable} on:click={submit}>
        {#if isSubmit}
            <Spinner color="light" size="sm"/>
        {:else}
            Create
        {/if}
    </Button>
    <Button color="secondary">Cancel</Button>

</div>



<div
        class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-200 border-0"
>
    <div class="rounded-t bg-white mb-0 px-6 py-6">
        <div class="text-center flex justify-between">
            <h6 class="text-gray-800 text-xl font-bold">My account</h6>
            <button
                    class="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                    type="button"
            >
                Settings
            </button>
        </div>
    </div>
    <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
        <form>
            <h6 class="text-gray-500 text-sm mt-3 mb-6 font-bold uppercase">
                User Information
            </h6>
            <div class="flex flex-wrap">
                <div class="w-full lg:w-6/12 px-4">
                    <div class="relative w-full mb-3">
                        <label
                                class="block uppercase text-gray-700 text-xs font-bold mb-2"
                                for="grid-username"
                        >
                            Username
                        </label>
                        <input
                                id="grid-username"
                                type="text"
                                class="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                                value="lucky.jesse"
                        />
                    </div>
                </div>
                <div class="w-full lg:w-6/12 px-4">
                    <div class="relative w-full mb-3">
                        <label
                                class="block uppercase text-gray-700 text-xs font-bold mb-2"
                                for="grid-email"
                        >
                            Email address
                        </label>
                        <input
                                id="grid-email"
                                type="email"
                                class="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                                value="jesse@example.com"
                        />
                    </div>
                </div>
                <div class="w-full lg:w-6/12 px-4">
                    <div class="relative w-full mb-3">
                        <label
                                class="block uppercase text-gray-700 text-xs font-bold mb-2"
                                for="grid-first-name"
                        >
                            First Name
                        </label>
                        <input
                                id="grid-first-name"
                                type="text"
                                class="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                                value="Lucky"
                        />
                    </div>
                </div>
                <div class="w-full lg:w-6/12 px-4">
                    <div class="relative w-full mb-3">
                        <label
                                class="block uppercase text-gray-700 text-xs font-bold mb-2"
                                for="grid-last-name"
                        >
                            Last Name
                        </label>
                        <input
                                id="grid-last-name"
                                type="text"
                                class="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                                value="Jesse"
                        />
                    </div>
                </div>
            </div>

            <hr class="mt-6 border-b-1 border-gray-400" />

            <h6 class="text-gray-500 text-sm mt-3 mb-6 font-bold uppercase">
                Contact Information
            </h6>
            <div class="flex flex-wrap">
                <div class="w-full lg:w-12/12 px-4">
                    <div class="relative w-full mb-3">
                        <label
                                class="block uppercase text-gray-700 text-xs font-bold mb-2"
                                for="grid-address"
                        >
                            Address
                        </label>
                        <input
                                id="grid-address"
                                type="text"
                                class="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                                value="Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09"
                        />
                    </div>
                </div>
                <div class="w-full lg:w-4/12 px-4">
                    <div class="relative w-full mb-3">
                        <label
                                class="block uppercase text-gray-700 text-xs font-bold mb-2"
                                for="grid-city"
                        >
                            City
                        </label>
                        <input
                                id="grid-city"
                                type="email"
                                class="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                                value="New York"
                        />
                    </div>
                </div>
                <div class="w-full lg:w-4/12 px-4">
                    <div class="relative w-full mb-3">
                        <label
                                class="block uppercase text-gray-700 text-xs font-bold mb-2"
                                for="grid-country"
                        >
                            Country
                        </label>
                        <input
                                id="grid-country"
                                type="text"
                                class="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                                value="United States"
                        />
                    </div>
                </div>
                <div class="w-full lg:w-4/12 px-4">
                    <div class="relative w-full mb-3">
                        <label
                                class="block uppercase text-gray-700 text-xs font-bold mb-2"
                                for="grid-postal-code"
                        >
                            Postal Code
                        </label>
                        <input
                                id="grid-postal-code"
                                type="text"
                                class="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                                value="Postal Code"
                        />
                    </div>
                </div>
            </div>

            <hr class="mt-6 border-b-1 border-gray-400" />

            <h6 class="text-gray-500 text-sm mt-3 mb-6 font-bold uppercase">
                About Me
            </h6>
            <div class="flex flex-wrap">
                <div class="w-full lg:w-12/12 px-4">
                    <div class="relative w-full mb-3">
                        <label
                                class="block uppercase text-gray-700 text-xs font-bold mb-2"
                                for="grid-about-me"
                        >
                            About me
                        </label>
                        <textarea
                                id="grid-about-me"
                                type="text"
                                class="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                                rows="4"
                                value="A beautiful UI Kit and Admin for Svelte & Tailwind CSS. It is Free
                and Open Source."
                        />
                    </div>
                </div>
            </div>
        </form>
    </div>
</div>
