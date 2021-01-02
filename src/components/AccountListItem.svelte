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
                {#each item.commodities as commodity}
                    <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-orange-600 bg-orange-200 uppercase last:mr-0 mr-1">
                        {commodity}
                    </span>
                {/each}
            </div>
        {/if}
    </div>
    <div class="child pl-4">
        {#each Object.values(item.children) as child}
            <svelte:self item={child}/>
        {/each}
    </div>
</div>
