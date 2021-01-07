<script lang="ts">
    import {api} from '../http'
    import {commodities} from "../stores";

    export let modalClose;


    let isSubmitting = false;
    let name = "";
    $: canBeSubmit = name !== "";

    async function submit() {
        isSubmitting = true;

        await api.createCommodity(name)
        isSubmitting = false;
        commodities.fetchLatest();
        modalClose()
    }

</script>

<style>
    div.line {
        display: flex;
        flex-direction: row;
    }

    div :global(.autocomplete) {
        flex: 1 auto;
    }
</style>


        <div>
            <div class="line">

                    <input bind:value={name} placeholder="Name" class="input"/>

            </div>
        </div>

        <button color="primary" disabled={!canBeSubmit || isSubmitting} on:click={submit} class="button">
            {#if isSubmitting}
               loading...
            {:else}
                Create
            {/if}
        </button>
        <button color="secondary" on:click={modalClose} class="button">Cancel</button>

