<script>
    import {getContext} from 'svelte';


    export let modalContext;
    export let content;
    export let text;

    const {open, close} = getContext(modalContext);

    const showSurprise = () => {
        open(content, {modalClose: close});
    };
</script>

<p>
    <button on:click={showSurprise}>{text}</button>
</p>
