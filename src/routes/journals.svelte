<script context="module" lang="ts">
    import {api} from "../http";

    export async function preload(page, session) {
        if (!session.authenticated) {
            return this.redirect(302, "/login")
        }
    }
</script>

<script lang="ts">
    import {goto, stores} from "@sapper/app";
    import {onMount} from "svelte";
    import {currentLedger, directives} from "../stores";
    import DirectiveLine from "../components/DirectiveLine.svelte";
    import {Button, ListGroup} from "sveltestrap/src";
    import NewTransactionModal from "../components/NewTransactionModal.svelte";
    import {isToday} from "../helper";
    import dayjs from 'dayjs';

    const {page, session} = stores();

    onMount(async () => {
        currentLedger.subscribe(async id => {
            if (id !== undefined) {
                let raw_directives = (await api.getJournal()).data.data;

                let groupedTransactions = {}

                for (let it of raw_directives) {
                    const date = dayjs(it.create_time).format("YYYY-MM-DD");
                    if (groupedTransactions[date] === undefined) {
                        groupedTransactions[date] = []
                    }
                    groupedTransactions[date].push(it)
                }
                directives.update(() => {
                    return groupedTransactions;
                })
            }
        })
    })
    const today = dayjs().format("YYYY-MM-DD");

    $: sortedJournals = Object.keys($directives).sort().reverse().map((date) => ({
        date: date,
        content: $directives[date]
    }));

    let newTransactionStatus = false;
    const toggle = () => (newTransactionStatus = !newTransactionStatus);
</script>
<div>
    <h1>Journals</h1>
    <div>
        <Button on:click={toggle}>new</Button>
        <NewTransactionModal isOpen={newTransactionStatus} toggle={toggle}/>
    </div>
</div>

{#each sortedJournals as {date, content},i }
    <h2>
        {#if isToday(date)}Today{:else}{date}{/if}
    </h2>
    <ListGroup>
        {#each content as directive}
            <DirectiveLine directive={directive}/>
        {/each}
    </ListGroup>
{/each}


