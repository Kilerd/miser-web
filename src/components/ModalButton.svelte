<script>
    import { getContext } from 'svelte';
    import NewTransactionModal from "./NewTransactionModal.svelte";

    const { open } = getContext('simple-modal');

    const showSurprise = () => {
        open(NewTransactionModal, { message: "It's a modal!" });
    };
</script>

<p><button on:click={showSurprise}>Show me a surprise!</button></p>