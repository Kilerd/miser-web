<script context="module">
    import {api} from "../http";

    export async function preload(page, session) {
        try {
            if (session.token) {
                api.setAuthenticateToken(session, session.token);
                let user_info = await api.getUserInfo();
                session.user = user_info.data.data;
            }
        } catch (e) {
            console.log(e)
        }
    }
</script>

<script lang="ts">

    import Nav from "../components/Nav.svelte";

    import {onMount} from "svelte";
    import {stores} from "@sapper/app";
    import {getCookie} from "../http";
    import {accounts, currentLedger, entries} from "../stores";

    export let segment;
    const {session} = stores();

    onMount(async () => {
        console.log("onmount");

        let currentLedgerId: string = undefined;
        let fetchedEntries = (await api.getEntries()).data.data;
        let t = {};
        for (let entry of fetchedEntries) {
            if (currentLedgerId === undefined) {
                currentLedgerId = entry.id.toString();
            }
            t[entry.id] = entry;
        }
        entries.update(n => t);

        let ledgerIdCookie = getCookie("CURRENT_LEDGER_ID");
        if (ledgerIdCookie !== undefined) {
            currentLedgerId = ledgerIdCookie;
        }
        currentLedger.update(() => {
            api.setCurrentLedgerId(currentLedgerId)
            return currentLedgerId;
        })

        let fetchedAccounts = (await api.getAccounts()).data.data;
        let a = {};
        for (let it of fetchedAccounts) {
            a[it.id] = it;
        }
        accounts.update(n => a);
    });
</script>

<style>
    section {
        display: flex;
        min-height: 100vh;
        align-items: stretch;
    }

    side {
        flex: 0 0 17rem;
    }

    main {
        flex: 1;

        background-color: white;
        padding: 2em;
        box-sizing: border-box;
    }
</style>

<svelte:head>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
</svelte:head>
<section>
    <side>
        <Nav {segment}/>
    </side>

    <main>
        <slot/>
    </main>

</section>