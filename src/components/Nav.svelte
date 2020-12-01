<script lang="ts">
    import AccountTree from "./AccountTree.svelte";
    import {stores} from "@sapper/app"
    import {Nav, NavItem, NavLink} from 'sveltestrap/src';
    import {entries, currentLedger} from "../stores";
    import {api, existCookie, setCookie} from "../http";


    export let segment: string;
    const {session} = stores()

    function changeLedger(ledgerId: number) {
        api.setCurrentLedgerId(ledgerId.toString());
        currentLedger.update(n => ledgerId.toString())
        setCookie("CURRENT_LEDGER_ID", ledgerId.toString())
    }


</script>

<style>
    nav {
        border-bottom: 1px solid rgba(255, 62, 0, 0.1);
        font-weight: 300;
        padding: 0 1em;
        position: sticky;
        top: 0;
    }

    [aria-current] {
        position: relative;
        display: inline-block;
    }

    [aria-current]::after {
        position: absolute;
        content: "";
        width: calc(100% - 1em);
        height: 2px;
        background-color: rgb(255, 62, 0);
        display: block;
        bottom: -1px;
    }

    a {
        text-decoration: none;
        padding: 1em 0.5em;
        display: block;
    }
</style>


{#if $session.user}
    <Nav vertical>
        <NavItem>
            <NavLink href="#">{$session.user.username}</NavLink>
        </NavItem>
    </Nav>
    <hr/>

    <p>current select: {$currentLedger}</p>
    <Nav vertical>
        {#each Object.values($entries) as entry, i}
            <NavItem>
                <NavLink href="/journals" on:click={changeLedger(entry.id)}>{entry.name}</NavLink>
            </NavItem>
        {/each}

        <NavItem>
            <NavLink href="/new_ledger" active={segment==='new_ledger'}>new ledger</NavLink>
        </NavItem>
    </Nav>
    <hr/>
    <Nav vertical>
        <NavItem>
            <NavLink href="/journals" active={segment==='journals'}>journals</NavLink>
        </NavItem>
        <NavItem>
            <NavLink href="/accounts" active={segment==='accounts'}>accounts</NavLink>
        </NavItem>
        <NavItem>
            <NavLink href="/commodities" active={segment==='commodities'}>commodities</NavLink>
        </NavItem>
    </Nav>
{:else}
    <Nav vertical>
        <NavItem>
            <NavLink href="/" active={segment===undefined}>Home</NavLink>
        </NavItem>
        <NavItem>
            <NavLink href="/login" active={segment==='login'}>login</NavLink>
        </NavItem>
    </Nav>
{/if}
