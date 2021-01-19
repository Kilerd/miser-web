<script lang="ts">
    import AutoComplete from 'simple-svelte-autocomplete';
    import {accounts, directives} from '../stores';
    import {api} from '../http'
    import type {Account} from '../types';
    import {subscriptStore} from '../helper';
    import NewTransactionModalLIne from "./NewTransactionModalLIne.svelte";

    export let modalClose;

    export let transaction;

    interface AccountSelectItem {
        id: number,
        keyword: string,
        alias: string
    }

    interface LineWithId {
        id?: number,
        account?: AccountSelectItem,
        amount: string,
        currency: string,
    }

    let accountList = subscriptStore(accounts, [], newStore => Object.values(newStore));

    async function getItems(keyword: string) {
        return [
            ...accountList,
            {id: -1, name: keyword, alias: keyword}
        ]
    }

    let base = {
        date: new Date(transaction.create_time).toJSON().slice(0, 10),
        payee: transaction.payee,
        narration: transaction.narration
    };

    let lines = transaction.lines.map(it => ({
        id: it.id,
        account: accountList.find(account => account.id === it.account),
        amount: it.cost[0],
        currency: it.cost[1]
    }))

    let isSubmit = false;
    $: lineHasEmpty = lines.filter(it => it.account === undefined || it.amount === '' || it.amount === null).length > 0;
    $: canBeSubmit = !lineHasEmpty;
    $: submitDisable = !canBeSubmit || isSubmit;

    async function submit() {
        isSubmit = true;

        let lineRes = lines.map(it => ({
            id: it.id,
            account: it.account.id,
            amount: [it.amount, it.currency],
            description: '' // todo implement description
        }));

        await api.updateTransaction(transaction.id, new Date(base.date), base.payee, base.narration, [], [], lineRes)
        isSubmit = false;
        directives.fetchLatest();
        modalClose()
    }

    function itemShow(item: Account) {
        return `${item.alias || ''} [${item.full_name}]`
    }

    function addLine() {
        lines = [
            ...lines,
            {
                account: undefined,
                amount: '',
                currency: 'CNY'
            }
        ]
    }


</script>

<style>

    div :global(.autocomplete) {
        flex: 1 auto;
    }
</style>

<div class="relative flex flex-col min-w-0 break-words w-full shadow-lg rounded-lg bg-gray-200 border-0">
    <div class="rounded-t bg-white mb-0 px-6 py-6">
        <div class="text-center flex justify-between">
            <h6 class="text-gray-800 text-xl font-bold">EDIT #{transaction.id}</h6>
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
                               bind:value={base.date}
                               placeholder="2020-10-10"/>
                    </div>
                </div>
                <div class="w-full lg:w-4/12 px-4">
                    <div class="relative w-full mb-3">

                        <input bind:value={base.payee} placeholder="Payee"
                               type="text"
                               class="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                        />
                    </div>
                </div>
                <div class="w-full lg:w-4/12 px-4">
                    <div class="relative w-full mb-3">
                        <input bind:value={base.narration} placeholder="Narration"
                               type="text"
                               class="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                        />
                    </div>
                </div>

            </div>

            <hr class="mt-6 border-b-1 border-gray-400"/>

            <h6 class="text-gray-500 text-sm mt-3 mb-6 font-bold uppercase">
                Detail <a on:click={addLine}><i class="fa fa-plus-circle"></i></a>
            </h6>
            {#each lines as line}
                <NewTransactionModalLIne bind:selectedItem={line.account} bind:amount={line.amount} commodity="CNY"/>
            {/each}


            <hr class="mt-6 mb-2 border-b-1 border-gray-400"/>

            <div class="flex flex-wrap justify-end">
                <button
                        class="text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                        class:bg-gray-700={!canBeSubmit}
                        class:bg-red-500={canBeSubmit}
                        disabled='{submitDisable}'
                        on:click={submit}
                        type="button"
                >
                    {#if isSubmit}
                        Updating....
                    {:else}
                        Update
                    {/if}
                </button>
            </div>
        </form>
    </div>
</div>
