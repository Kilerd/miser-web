<script lang="ts">
    import type {Transaction} from "../types";

    export let directive: Transaction;
</script>

<style>
    div.directive-line {
        display: flex;
        flex-direction: column;
        border: 1px solid #e2e8f0;
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
</style>

<div class="directive-line">
    <div class="header">
        <div class="left">
            <div class="name">
                <div>
                    {#if directive.flag !== 'Complete'}<span>!</span>{/if}
                    {directive.payee}
                    {directive.narration}
                </div>
            </div>
            <div class="meta">
                <span class="tag">Journals</span>
                <span class="tag">Success</span>
            </div>
        </div>
        <div class="right">
            <div class="statics" />
            <div class="action" />
        </div>
    </div>
</div>
