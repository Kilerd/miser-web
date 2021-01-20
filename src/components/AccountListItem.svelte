<script lang="ts">
    import type {AccountTreeItem} from '../types';
    import {getContext} from "svelte";
    import EditAccountModal from "./EditAccountModal.svelte";

    export let item: AccountTreeItem;


    const {open, close} = getContext("account-edit");

    function openEditModal() {
        open(EditAccountModal, {account: item, modalClose: close})
    }
</script>

<div>
    <div class="line flex border bg-white px-2 py-1 justify-between">
        <div class="">
            {#if item.alias}
                {item.alias} ({item.name})
            {:else}
                {item.name}
            {/if}
        </div>
        <div class="flex">
            {#if item.commodities}
                <div>
                    {#each item.commodities as commodity}

                    <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-gray-600 bg-gray-200 uppercase last:mr-0 mr-1">
                        {commodity}
                    </span>
                    {/each}
                </div>
            {/if}
            <div class="ml-3">
                <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-orange-600 bg-orange-200 uppercase last:mr-0 mr-1">
                    {item.amount} CNY
                </span>

            </div>
            <div class="action ml-3">
                {#if item.isAvailable}
                    <a class="text-gray-600 py-1 px-3" on:click={openEditModal}>
                        <i class="fas fa-edit"></i>
                    </a>
                {/if}
            </div>
        </div>

    </div>
    <div class="child pl-10 ml-3 border-dotted border-l border-gray-600">
        {#each Object.values(item.children) as child}
            <svelte:self item={child}/>
        {/each}
    </div>
</div>
