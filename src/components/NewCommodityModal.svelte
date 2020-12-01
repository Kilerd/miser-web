<script lang="ts">
    import {Button, FormGroup, Input, Modal, ModalBody, ModalFooter, ModalHeader, Spinner} from 'sveltestrap/src'
    import AutoComplete from 'simple-svelte-autocomplete';
    import {accounts, entries} from '../stores';
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

<Modal isOpen={isOpen} centered={true} fade={true} backdrop={false} size="lg" {toggle}>
    <ModalHeader {toggle}>New Commodity</ModalHeader>
    <ModalBody>
        <div>
            <div class="line">
                <FormGroup>
                    <Input bind:value={name} placeholder="Payee"/>
                </FormGroup>
            </div>



        </div>


    </ModalBody>
    <ModalFooter>
        <Button color="primary" disabled={!canBeSubmit || isSubmitting} on:click={submit}>
            {#if isSubmitting}
                <Spinner color="light" size="sm"/>
            {:else}
                Create
            {/if}
        </Button>
        <Button color="secondary" on:click={toggle}>Cancel</Button>
    </ModalFooter>
</Modal>