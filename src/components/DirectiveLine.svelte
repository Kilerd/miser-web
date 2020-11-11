<script>
    export let directive;

    const type = directive.type;
</script>

{#if type === 'Transaction'}
    <div>
        {#if directive.flag !== 'Complete'}
            <span>!</span>
        {/if}
        <p>{directive.payee} {directive.narration}</p>
    </div>
{:else}
    <div>other</div>
{/if}