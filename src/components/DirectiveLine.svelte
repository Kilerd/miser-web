<script lang="ts">
    import type {Transaction} from "../types";
    import TableDropdown from "../notus/Dropdowns/TableDropdown.svelte";
    import Big from 'big.js'
    import {accounts} from "../stores";

    export let directive: Transaction;
    $: outAccounts = directive.lines
        .filter(value => {
            let big = new Big(value.cost[0]);
            return big.s === -1;
        })
        .map(value => value.account);
    $: inAccounts = directive.lines
        .filter(value => {
            let big = new Big(value.cost[0]);
            return big.s === 1;
        })
        .map(value => value.account);

    $: outAccount = outAccounts.length > 1 ? `${outAccounts.length} Accounts` : accounts.getAlias(outAccounts[0])
    $: inAccount = inAccounts.length > 1 ? `${inAccounts.length} Accounts` : accounts.getAlias(inAccounts[0])
    $: outAmount = directive.lines
        .filter(value => {
            let big = new Big(value.cost[0]);
            return big.s === -1;
        })
        .map(value => value.cost[0])
        .reduce((sum, cur) => sum.add(cur), new Big(0))

</script>


<tr class="border-b">
    <th class="border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-2 text-left flex flex-col items-baseline">

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
    <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-2 w-16">
        <div class="flex items-center">
            <span class="text-xs font-semibold inline-block py-1 px-2 rounded-l-full text-blue-600 bg-blue-200 last:mr-0">
          {outAccount}
        </span>
            <span class="text-xs font-semibold inline-block py-1 px-2 text-gray-800 bg-gray-200 last:mr-0 inline-flex items-center font-bold">
          <svg width="12" height="12" fill="#38A169" class="inline-block">
            <path d="M 10 5.4 L 10 6.6 H 0 V 5.4 z"></path>
        </svg>
            ¥{outAmount.mul(-1).toFixed(2)}
                <svg width="12" height="12" fill="#38A169" class="inline-block">
            <path d="M9.703 5.4L6.061 1.757 6.909.91 12 6l-.424.424-4.667 4.667-.848-.848L9.703 6.6H0V5.4h9.703z"></path>
        </svg>
        </span>
            <span class="text-xs font-semibold inline-block py-1 px-2 rounded-r-full text-orange-600 bg-orange-200 last:mr-0">
          {inAccount}
        </span>
        </div>
    </td>
    <td class="border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-2 text-right w-5">
        <TableDropdown/>
    </td>
</tr>

