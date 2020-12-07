<script lang="ts">
    import {isToday} from "../helper";
    import DirectiveLine from "./DirectiveLine.svelte";
    import type {Transaction} from "../types";
    import type Big from 'big.js';

    export let data: { date: string, content: Transaction[], debit: Big, credit: Big };
    let {date, content, debit, credit} = data;
</script>

<style>
</style>

<div class="group">
    <div class="header">
        <div class="date">
            {#if isToday(date)}Today <span>{date}</span>{:else}{date}{/if}
        </div>
        <div class="statics">
            <div class="item">Debit:{debit}</div>
            <div class="item">Credit:{credit}</div>
        </div>
    </div>
    <div class="lines">
        {#each content as directive}
            <DirectiveLine directive={directive}/>
        {/each}
    </div>
</div>
