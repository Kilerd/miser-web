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

    const {page, session} = stores();

    onMount(async () => {
        currentLedger.subscribe(async id => {
            if (id !== undefined) {
                let raw_directives = (await api.getJournal()).data.data;

                let fetched = Object.keys(raw_directives).sort().reverse().map((date) => ({
                    date: date,
                    content: raw_directives[date]
                }));
                directives.update(() => {
                    return fetched;
                })
            }
        })

    })
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

{#each $directives as {date, content},i }
    <h2>
        {#if isToday(date)}Today{:else}{date}{/if}
    </h2>
    <ListGroup>
        {#each content as directive}
            <DirectiveLine directive={directive}/>
        {/each}
    </ListGroup>
{/each}


