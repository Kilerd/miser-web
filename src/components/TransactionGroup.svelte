<script lang="ts">
    import {isToday} from '../helper';
    import DirectiveLine from './DirectiveLine.svelte';
    import type {Transaction} from '../types';
    import type Big from 'big.js';
    import CardTable from '../notus/Cards/CardTable.svelte';
    import CardSocialTraffic from '../notus/Cards/CardSocialTraffic.svelte';
    import TableDropdown from "../notus/Dropdowns/TableDropdown.svelte";

    export let data: { date: string, content: Transaction[], debit: Big, credit: Big };
    let {date, content, debit, credit} = data;


    const bootstrap = "../assets/img/bootstrap.jpg";
    const angular = "../assets/img/angular.jpg";
    const sketch = "../assets/img/sketch.jpg";
    const react = "../assets/img/react.jpg";
    const vue = "../assets/img/react.jpg";

    const team1 = "../assets/img/team-1-800x800.jpg";
    const team2 = "../assets/img/team-2-800x800.jpg";
    const team3 = "../assets/img/team-3-800x800.jpg";
    const team4 = "../assets/img/team-4-470x470.png";
    export let color = "light";
</script>

<style>
</style>

<!--<div class="group">-->
<!--    <div class="header">-->
<!--        <div class="date">-->
<!--            {#if isToday(date)}Today <span>{date}</span>{:else}{date}{/if}-->
<!--        </div>-->
<!--        <div class="statics">-->
<!--            <div class="item">Debit:{debit}</div>-->
<!--            <div class="item">Credit:{credit}</div>-->
<!--        </div>-->
<!--    </div>-->
<!--    <div class="lines">-->
<!--        {#each content as directive}-->
<!--            <DirectiveLine directive={directive}/>-->
<!--        {/each}-->
<!--    </div>-->
<!--</div>-->
<div class="flex flex-wrap">
    <div class="w-full px-4">
        <div class="flex items-end">
            <h6 class="text-xl font-normal leading-normal mt-0 mb-2 text-gray-800">
                {#if isToday(date)}Today{:else}{date}{/if}
            </h6>
            {#if isToday(date)}
                <h6 class="font-normal leading-normal mt-0 mb-2 text-gray-500 ml-2">
                    {date}
                </h6>
            {/if}
            <h6 class="font-normal leading-normal mt-0 mb-2 text-gray-800 ml-2">
                Debit:{debit}
            </h6>
            <h6 class="font-normal leading-normal mt-0 mb-2 text-gray-800 ml-2">
                Credit:{credit}
            </h6>
        </div>

        <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
            <div class="rounded-t mb-0 border-0"></div>
            <div class="block w-full overflow-x-auto">
                <!-- Projects table -->
                <table class="items-center w-full bg-transparent border-collapse">
                    <tbody>
                            {#each content as directive}
                                <DirectiveLine directive={directive}/>
                            {/each}

                    </tbody>
                </table>
            </div>
        </div>

    </div>

</div>
