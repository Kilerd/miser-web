<script lang="ts">
    import {Button, FormGroup, Input, Modal, ModalBody, ModalFooter, ModalHeader, Spinner} from 'sveltestrap/src'
    import AutoComplete from 'simple-svelte-autocomplete';
    import {accounts} from '../stores';
    import {api} from '../http'
    import type {Account} from '../types';

    export let modalClose;
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
        modalClose();
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

<div class="relative flex flex-col min-w-0 break-words w-full shadow-lg rounded-lg bg-gray-200 border-0">
    <div class="rounded-t bg-white mb-0 px-6 py-6">
        <div class="text-center flex justify-between">
            <h6 class="text-gray-800 text-xl font-bold">New Transaction</h6>
        </div>
    </div>
    <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
        <form>
            <h6 class="text-gray-500 text-sm mt-3 mb-6 font-bold uppercase">
                Basic Info
            </h6>
            <div class="flex flex-wrap">
                <div class="w-full lg:w-4/12 px-4">
                    <div class="relative w-full mb-3">
                        <input class="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                               type="date"
                               name="date"
                               bind:value={date}
                               placeholder="2020-10-10"/>
                    </div>
                </div>
                <div class="w-full lg:w-4/12 px-4">
                    <div class="relative w-full mb-3">

                        <input bind:value={payee} placeholder="Payee"
                               type="text"
                               class="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                        />
                    </div>
                </div>
                <div class="w-full lg:w-4/12 px-4">
                    <div class="relative w-full mb-3">
                        <input bind:value={narration} placeholder="Narration"
                               type="text"
                               class="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                        />
                    </div>
                </div>

            </div>

            <hr class="mt-6 border-b-1 border-gray-400"/>

            <h6 class="text-gray-500 text-sm mt-3 mb-6 font-bold uppercase">
                Detail
            </h6>
            <div class="flex flex-wrap">
                <div class="w-full lg:w-4/12 px-4">
                    <div class="relative w-full mb-3">
                        <AutoComplete inputId="account1" className="account-input" items={accountList}
                                      labelFunction={itemShow}
                                      valueFieldName="name"
                                      bind:selectedItem={selectAccount}
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

                <div class="w-full lg:w-4/12 px-4">
                    <div class="relative w-full mb-3">
                        <AutoComplete inputId="account1" className="account-input" items={accountList}
                                      labelFunction={itemShow}
                                      valueFieldName="name"
                                      bind:selectedItem={selectAccount2}
                                      searchFunction={getItems} showClear={true}/>
                    </div>
                </div>
                <div class="w-full lg:w-4/12 px-4">
                    <div class="relative w-full mb-3">
                        <input bind:value={amount2} type="number"
                               class="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"/>


                    </div>
                </div>
                <div class="w-full lg:w-4/12 px-4">
                    <div class="relative w-full mb-3">
                        <select name="select"
                                class="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150">
                            <option>CNY</option>
                        </select>
                    </div>
                </div>
            </div>

            <hr class="mt-6 mb-2 border-b-1 border-gray-400"/>

            <div class="flex flex-wrap justify-end">
                <button
                        disabled={submitDisable}
                        on:click={submit}
                        class="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                        type="button"
                >
                    {#if isSubmit}
                        <Spinner color="light" size="sm"/>
                    {:else}
                        Create
                    {/if}
                </button>
            </div>
        </form>
    </div>
</div>
