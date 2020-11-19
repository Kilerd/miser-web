<script lang="ts">
    import {api} from "../http";
    import {stores, goto} from "@sapper/app";
    import {onMount} from "svelte";
    import {directives} from "../stores";
    import DirectiveLine from "../components/DirectiveLine.svelte";
    import {ListGroup, Button, Modal, ModalHeader, ModalBody, ModalFooter} from "sveltestrap/src";
    import Datepicker from "svelte-calendar";
    import NewTransactionModal from "../components/NewTransactionModal.svelte";

    const {page, session} = stores();
    if (!$session.user) {
        goto("/login", {})
    }
    onMount(async () => {
        let raw_directives = (await api.getJournal()).data.data;
        let fetched = Object.keys(raw_directives).sort().reverse().map((key) => {
            return {
                date: key,
                contents: raw_directives[key]
            }
        });
        directives.update(() => {
            return fetched;
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

{#each $directives as {date, contents}, i }
    <h2>{date}</h2>
    <ListGroup>
        {#each contents as directive}
            <DirectiveLine directive={directive}/>
        {/each}
    </ListGroup>
{/each}


