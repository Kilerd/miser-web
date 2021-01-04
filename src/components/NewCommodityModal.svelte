<script lang="ts">
    import {api} from '../http'

    export let isOpen: boolean;
    export let toggle: () => boolean;


    let isSubmitting = false;
    let name = "";
    $: canBeSubmit = name !== "";

    async function submit() {
        isSubmitting = true;

        await api.createCommodity(name)
        isSubmitting = false;
        toggle()
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

                    <input bind:value={name} placeholder="Name"/>

            </div>
        </div>

        <button color="primary" disabled={!canBeSubmit || isSubmitting} on:click={submit}>
            {#if isSubmitting}
               loading...
            {:else}
                Create
            {/if}
        </button>
        <button color="secondary" on:click={toggle}>Cancel</button>

