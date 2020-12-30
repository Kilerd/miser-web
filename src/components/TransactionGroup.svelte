<script lang="ts">
    import {isToday} from '../helper';
    import DirectiveLine from './DirectiveLine.svelte';
    import type {Transaction} from '../types';
    import Big from 'big.js'
    import {accounts} from '../stores';

    export let date:string;
    export let items: Transaction[] = [];

    let debit = new Big(0.00);
    let credit = new Big(0.00);
    for (let it of items) {
        for (let line of it.lines) {
            const accountId = line.account;
            const type = $accounts[accountId]?.full_name.split(':')[0];
            const cost = new Big(line.cost[0]);
            switch (type) {
                case 'Income':
                    break;
                case 'Expenses':
                    break;
                case 'Liabilities':
                    if (cost.s === 1) {
                        debit = debit.add(cost)
                    } else {
                        credit = credit.add(cost.mul(-1))
                    }
                    break;
                case 'Equity':
                    break;
                case 'Assets':
                    if (cost.s === 1) {
                        debit = debit.add(cost)
                    } else {
                        credit = credit.add(cost.mul(-1))
                    }
                    break;
            }
        }
    }

    export let color = 'light';
</script>

<style>
</style>

<div class="flex flex-wrap">
    <div class="w-full px-4">
        <div class="flex items-end">
            <h6 class="text-xl font-normal leading-normal mt-0 mb-2 text-gray-800">
                {#if isToday(date)}Today{:else}{date}{/if}
            </h6>
            {#if !debit.eq(0)}
                <h6 class="font-normal leading-normal mt-0 mb-2 text-gray-800 ml-2">
                    Debit:{debit}
                </h6>
            {/if}
            {#if !credit.eq(0)}
                <h6 class="font-normal leading-normal mt-0 mb-2 text-gray-800 ml-2">
                    Credit:{credit}
                </h6>
            {/if}

        </div>

        <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
            <div class="rounded-t mb-0 border-0"></div>
            <div class="block w-full overflow-x-auto">
                <!-- Projects table -->
                <table class="items-center w-full bg-transparent border-collapse">
                    <tbody>
                    {#each items as directive}
                        <DirectiveLine directive={directive}/>
                    {/each}
                    </tbody>
                </table>
            </div>
        </div>

    </div>

</div>
