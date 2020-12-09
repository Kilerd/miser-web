<script lang="ts">
    import type {Transaction} from "../types";
    import TableDropdown from "../notus/Dropdowns/TableDropdown.svelte";

    export let directive: Transaction;
</script>

<style>
    div.directive-line {
        display: flex;
        flex-direction: column;
        border: 1px solid #e2e8f0;
    }

    div.header {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }

    div.left {
        display: flex;
        flex-direction: column;
        flex: 1;
    }

    div.name {
        font-size: 1.1rem;
        margin-bottom: 5px;
    }
</style>


<tr class="border-b">
    <th class="border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-3 text-left flex flex-col items-baseline">
        <span class="ml-3 font-normal btext-gray-700 text-base">
            {#if directive.flag !== 'Complete'}<span>!</span>{/if}
            {directive.payee}
            {directive.narration}
        </span>
        {#if directive.tags.length > 0}
            <div class="meta ml-3">
                {#each directive.tags as line}
                    <span class="text-xs font-semibold inline-block px-2 rounded text-gray-600 bg-gray-200 last:mr-0 mr-1">
                        {line}
                    </span>
                {/each}

            </div>
        {/if}
    </th>
    <td class="border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-3 text-right">
        <TableDropdown/>
    </td>
</tr>

