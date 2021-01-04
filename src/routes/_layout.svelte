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


    import {onMount} from "svelte";
    import {stores} from "@sapper/app";
    import {getCookie} from "../http";
    import {accounts, currentLedger, entries, segment as storedSegment} from "../stores";

    export let segment;
    const {session} = stores();

    storedSegment.update(n => segment);


    const UNAUTHENTICATED_PAGE = [undefined, "login", "register"]
    const needAuthenticated = !UNAUTHENTICATED_PAGE.includes(segment)


    onMount(async () => {
        if ($session.authenticated) {

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


        }
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
        background-color: #f4f4f4;
    }

    main {
        flex: 1;

        background-color: white;
        padding: 2em;
        box-sizing: border-box;
        border-left: 1px solid #e2e8f0;
    }
</style>

<slot segment={segment}/>


