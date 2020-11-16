<script>
    import {Button, Col, Row, Label, ListGroupItem} from 'sveltestrap/src';

    export let directive;
    const type = directive.type;

</script>

<style>
    div.directive-line {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    div.left {
        display: flex;
        flex-direction: column;
        flex: 1;
    }

    div.name {
        font-size: 1.1rem;
        margin-bottom: 5px;
    }

    div.amount {
        font-size: 1.3rem;
    }
</style>

{#if type === 'Transaction'}
    <ListGroupItem>
        <div class="directive-line">
            <div class="left">

                <div class="name">
                    <Label size={"tiny"}>
                        {#if directive.flag !== 'Complete'}
                            <span>!</span>
                        {/if}
                        {directive.payee} {directive.narration}
                    </Label>
                </div>
            </div>
            <div>
                <div class="amount">
                    TODO

                </div>
            </div>
        </div>

    </ListGroupItem>
{:else}
    <ListGroupItem>
        other
    </ListGroupItem>
{/if}