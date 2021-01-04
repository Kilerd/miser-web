<script lang="ts">
    import {stores} from '@sapper/app'

    import {entries, currentLedger} from '../stores';
    import {api, setCookie} from '../http';


    export let segment: string;
    const {session} = stores()

    function changeLedger(ledgerId: number) {
        api.setCurrentLedgerId(ledgerId.toString());
        currentLedger.update(n => ledgerId.toString())
        setCookie('CURRENT_LEDGER_ID', ledgerId.toString())
    }


</script>

<style>
    aside {

    }

    div.user {
        display: flex;
        flex-direction: column;
        align-items: baseline;
        padding: 1.5rem;
    }

    div.user nav {
        display: flex;
        flex-direction: column;
        align-items: baseline;
    }

    div.list {
        display: flex;
        flex-direction: column;
        align-items: baseline;
        border-top: 1px solid #e2e8f0;
        padding: 1.5rem 1rem;
    }

    div.list div.header {
        padding: 4px 10px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
        font-size: 18px;
        color: #333;
        text-transform: uppercase;
    }

    div.list div.header a {
        color: #333;
        text-decoration: none;
        text-transform: uppercase;
    }

    div.list nav {
        display: flex;
        flex-direction: column;
        align-items: baseline;
        font-size: 16px;
        width: 100%;

    }

    div.list nav a {
        margin: 2px 0;
        padding: 4px 10px;
        border-radius: 3px;
        width: 100%;
        color: #666;
        cursor: pointer;
        text-decoration: none;
    }

    div.list nav a:hover {
        background-color: #eee;
        color: #333;
    }

    div.list nav a.actived {
        background: rgba(251, 183, 120, .25);
        color: #333;
    }
</style>


{#if $session.user}
    <aside>
        <div class="user">
            <img src="https://secure.gravatar.com/avatar/0ef2d17d4b179f70e13b35ec11a185bb" alt="avatar">
            <div class="username">{$session.user.username}</div>
            <nav>
                <a href="/setting">Settings</a>
                <a href="/logout">Sign out</a>
            </nav>
        </div>
        <div class="list">
            <div class="header">
                Ledgers
                <span><a href="/new_ledger">+</a></span>
            </div>
            <nav>
                {#each Object.values($entries) as entry, i}
                    <a href="{segment}" on:click={changeLedger(entry.id)}
                       class:actived={entry.id.toString()===$currentLedger}>{entry.name}</a>
                {/each}
            </nav>
        </div>
        <div class="list">
            <nav>
                <a href="/journals"> journals</a>
                <a href="/commodities"> Commodities</a>
            </nav>
        </div>
        <div class="list">
            <div class="header">
                <a href="/accounts">accounts</a>
                <span>+</span>
            </div>
        </div>
    </aside>
{/if}
