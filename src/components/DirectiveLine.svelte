<script lang="ts">
    import {Label, ListGroupItem, Badge} from 'sveltestrap/src';
    import {accounts} from "../stores";

    export let directive;
    const type = directive.type;

    let showLineInfo = false;

    function toggle() {
        showLineInfo = !showLineInfo;
    }
</script>

<style>
    div.directive-line {
        display: flex;
        flex-direction: column;
    }

    div.header {
        display: flex;
        flex-direction: row;
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
        display: flex;
        font-size: 1.3rem;
    }

    div.from-to {
        display: flex;
    }
    div.line-info {
        display: flex;
        flex-direction: row;
    }
</style>

{#if type === 'Transaction'}
    <ListGroupItem>
        <div class="directive-line">
            <div class="header" on:click={toggle}>
                <div class="left">
                    <div class="name">
                        <Label size={"tiny"}>
                            {#if directive.raw.flag !== 'Complete'}
                                <span>!</span>
                            {/if}
                            {directive.raw.payee} {directive.raw.narration}
                        </Label>
                        <div class="from-to">
<!--                            <div class="from">-->
<!--                                {#each directive.from as it}-->
<!--                                    <Badge pill color="light">{it}</Badge>-->
<!--                                {/each}-->
<!--                            </div>-->
<!--                            <div class="to">-->
<!--                                {#each directive.to as it}-->
<!--                                    <Badge pill color="light">{it}</Badge>-->
<!--                                {/each}-->
<!--                            </div>-->
                        </div>
                    </div>
                </div>
                <div>
                    <div class="amount">
                        {#each Object.keys(directive.summaries).filter((it)=> directive.summaries[it][0] !== "0") as idx}
                            <div>
                                <div>{directive.summaries[idx][0]}<span>{directive.summaries[idx][1]}</span></div>
                                <Badge pill color="light">{accounts.getAlias(idx)}</Badge>
                            </div>
                        {/each}
                    </div>
                </div>
            </div>
            {#if showLineInfo}
                <div class="content">
                    {#each directive.raw.lines as line}

                        <div class="line-info">
                            <div class="line-info left">
                                {line.account}
                            </div>
                            <div class="line-info right">
                                {line.amount[0]} {line.amount[1]}
                            </div>
                        </div>

                    {/each}
                </div>
            {/if}
        </div>
    </ListGroupItem>
{:else}
    <ListGroupItem>
        other
    </ListGroupItem>
{/if}