<script context="module" lang="ts">
    import {api} from "../http";

    export async function preload(page, session) {
        if (!session.authenticated) {
            return this.redirect(302, "/login")
        }
    }
</script>

<script lang="ts">
    import {goto, stores} from "@sapper/app";
    import {onMount} from "svelte";
    import {accounts, currentLedger, directives} from "../stores";
    import DirectiveLine from "../components/DirectiveLine.svelte";
    import {Button, ListGroup} from "sveltestrap/src";
    import NewTransactionModal from "../components/NewTransactionModal.svelte";
    import {isToday} from "../helper";

    const {page, session} = stores();

    onMount(async () => {
        currentLedger.subscribe(async id => {
            let fetchedAccount = (await api.getAccounts()).data.data;

            let accountsMap = {}

            for (let it of fetchedAccount) {
                accountsMap[it.id] = it
            }

            accounts.update(() => {
                return accountsMap;
            })
        })

    })
    let newTransactionStatus = false;
    const toggle = () => (newTransactionStatus = !newTransactionStatus);
</script>
<div>
    <h1>Accounts</h1>
    <div>
        <Button on:click={toggle}>new</Button>
        <NewTransactionModal isOpen={newTransactionStatus} toggle={toggle}/>
    </div>
</div>

<div class="account-list">
    {#each Object.values($accounts) as account }
        <div class="account">
            [{account.status}][{account.full_name}]{account.name}
        </div>
    {/each}
</div>



