<script lang="ts">
    import {directives} from '../stores';
    import {api} from '../http'
    import NewTransactionModalLIne from './NewTransactionModalLIne.svelte';
    import {getNotificationsContext} from 'svelte-notifications';

    const {addNotification} = getNotificationsContext();

    export let modalClose;

    interface AccountSelectItem {
        id: number,
        keyword: string,
        alias: string
    }

    interface Line {
        account?: AccountSelectItem,
        amount: string,
        currency: string,
    }

    let tags: string[] = [];
    let inputTag = '';

    let defaultDate = new Date();
    defaultDate.setMinutes(defaultDate.getMinutes() - defaultDate.getTimezoneOffset());


    let base = {date: defaultDate.toISOString().substring(0, 16), payee: '', narration: ''};
    let lines: Line[] = [{
        account: undefined,
        amount: '',
        currency: 'CNY'
    }, {
        account: undefined,
        amount: '',
        currency: 'CNY'
    }]
    let isSubmit = false;

    $: lineHasEmpty = lines.filter(it => it.account === undefined || it.amount === '' || it.amount === null).length > 0;
    $: canBeSubmit = !lineHasEmpty;
    $: submitDisable = !canBeSubmit || isSubmit;

    async function submit() {
        isSubmit = true;

        let lineRes = lines.map(it => ({
            account: it.account.id,
            amount: [it.amount, it.currency]
        }));
        console.log(base.date)

        await api.createTransaction(new Date(base.date), base.payee, base.narration, tags, [], lineRes)
        isSubmit = false;
        directives.fetchLatest();
        addNotification({text: 'Create Transaction Successfully', position: 'bottom-right', removeAfter: 4000})
        modalClose();
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

    function deleteLine(idx: number) {
        lines = lines.filter((value, i) => i !== idx)
    }

    function handleInputTag(e) {
        if (e.code == 'Enter') {
            if (inputTag.trim() !== '') {
                if (tags.indexOf(inputTag.trim()) === -1) {
                    tags = [...tags, inputTag.trim()];
                }
                inputTag = ''
            }
        }
    }

    function deleteTag(value) {
        tags = tags.filter((it) => it !== value)
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
                               type="datetime-local"
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
                Tags
            </h6>
            <div>
                {#each tags as tag}
                    <span class="text-xs font-semibold inline-block py-1 px-2 rounded-full text-orange-600 bg-orange-200 last:mr-0 mr-1">
                        {tag} <a on:click={()=>deleteTag(tag)}><i class="fa fa-trash-alt"></i></a>
                    </span>
                {/each}
            </div>
            <div>
                <input type="text" class="input" placeholder="please input new tag here..." bind:value={inputTag}
                       on:keyup|preventDefault={handleInputTag}>
            </div>
            <hr class="mt-6 border-b-1 border-gray-400"/>

            <h6 class="text-gray-500 text-sm mt-3 mb-6 font-bold uppercase">
                Detail
                <a on:click={addLine}><i class="fa fa-plus-circle"></i></a>
            </h6>

            {#each lines as line, i}

                <NewTransactionModalLIne bind:selectedItem={line.account} bind:amount={line.amount} commodity="CNY"
                                         deleteLineCallback={()=>deleteLine(i)}/>
            {/each}


            <hr class="mt-6 mb-2 border-b-1 border-gray-400"/>

            <div class="flex flex-wrap justify-end">
                <button
                        disabled={submitDisable}
                        on:click={submit}
                        class:bg-red-500={canBeSubmit}
                        class:bg-gray-700={!canBeSubmit}
                        class="text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                        type="button"
                >
                    {#if isSubmit}
                        Creating....
                    {:else}
                        Create
                    {/if}
                </button>
            </div>
        </form>
    </div>
</div>
