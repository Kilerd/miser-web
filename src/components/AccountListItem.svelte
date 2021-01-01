<script lang="ts">
    import type {AccountTreeItem} from '../types';

    export let item: AccountTreeItem;

</script>

<div>
    <div class="line flex border bg-white px-2 py-1">
        <div class="">
            {#if item.alias}
                {item.alias} ({item.name})
            {:else}
                {item.name}
            {/if}
        </div>
        {#if item.commodities}
            <div>
                {item.commodities}
            </div>
        {/if}
    </div>
    <div class="child pl-4">
        {#each Object.values(item.children) as child}
            <svelte:self item={child}/>
        {/each}
    </div>
</div>
