<script>
    import {getContext} from 'svelte';
    import NewTransactionModal from "./NewTransactionModal.svelte";

    const {open, close} = getContext('simple-modal');

    const showSurprise = () => {
        open(NewTransactionModal, {modalClose: close});
    };
</script>

<p>
    <button on:click={showSurprise}>new transaction</button>
</p>
