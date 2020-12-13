<script lang="ts">
    import type {Transaction} from '../types';

    export let transaction: Transaction;
</script>
<div class="p-8 m-4">
    <div>
        <span>#{transaction.id}</span>
        <h2>{transaction.payee}</h2>
        <h2>{transaction.narration}</h2>
    </div>
    <div>
        {#each transaction.tags as tag}
            <div>{tag}</div>
        {/each}
    </div>
    <div>
        {#each transaction.links as link}
            <div>{link}</div>
        {/each}
    </div>

    <div>
        <h2>detail</h2>
        {#each transaction.lines as line}
            <div>
                <span>{line.account}</span>
                <span>{line.cost}</span>
            </div>
        {/each}
    </div>
    <div>
        <h2>Doucments</h2>
        <div>
            <a href="#"> file.file</a>
            <a href="#"> file.file</a>
            <a href="#"> file.file</a>
        </div>
    </div>
</div>
