<script lang="ts">
    import type {Transaction} from '../types';
    import {accounts} from "../stores";
    import {api, BASE_URL} from "../http"

    export let transaction: Transaction;
    import {currentLedger} from "../stores";

    async function getdata() {
        let res = await api.getDocumentByTransaction(transaction.id);
        return res.data.data;
    }

    let documentFetching = getdata();

</script>
<div class="p-8 m-4">
    <div class="text-base text-gray-700">
        {transaction.create_time}
    </div>
    <div class="flex items-end mt-2">
        <span class="text-gray-500 text-base">#{transaction.id}</span>
        <h2 class="text-gray-900 text-xl font-semibold ml-2">{transaction.payee}</h2>
        <h2 class="text-gray-900 text-xl ml-1">{transaction.narration}</h2>
    </div>
    <div>
        {#each transaction.tags as tag}
            <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-gray-600 bg-gray-200 uppercase last:mr-0 mr-1">
              {tag}
            </span>
        {/each}
        {#each transaction.links as link}
            <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-gray-600 bg-gray-200 uppercase last:mr-0 mr-1">
              {link}
            </span>
        {/each}
    </div>

    <hr class="mt-6 border-b-1 border-gray-400">
    <div>
        <h2 class="uppercase text-xs mt-3 text-gray-500 font-bold mb-3">detail</h2>
        {#each transaction.lines as line}
            <div class="flex justify-between">
                <span>{accounts.getAlias(line.account)} [{$accounts[line.account].full_name}]</span>
                <span>{line.cost}</span>
            </div>
        {/each}
    </div>

    {#await documentFetching}
        <div> documents loading...</div>
    {:then data}
        {#if data.length > 0}
            <hr class="mt-6 border-b-1 border-gray-400">
            <div>
                <h2 class="uppercase text-xs mt-3 text-gray-500 font-bold mb-3">documents</h2>
                <div>
                    {#each data as one_document}
                        <div class="flex justify-between">
                            <div class="flex">
                                <a href="{BASE_URL}/ledgers/{$currentLedger}/transactions/{transaction.id}/documents/{one_document.id}/download"
                                   target="_blank"
                                   class="text-base ml-1 text-gray-700 hover:text-gray-900">{one_document.filename}</a>
                            </div>
                            <div class="flex text-gray-600">

                                <!--                            <span class="ml-2">11.2KB</span>-->
                                <!--                            <span class="ml-2"><i class="fa fa-cloud-download-alt"></i> 10</span>-->
                                <span class="ml-2">{one_document.create_time}</span>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        {/if}
    {/await}

</div>
