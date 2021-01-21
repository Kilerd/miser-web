<script context="module" lang="ts">

    import {api} from '../http';

    export async function preload(page, session) {
        if (!session.authenticated) {
            return this.redirect(302, "/login")
        }
    }
</script>

<script lang="ts">
    import {stores} from "@sapper/app";


    const {page, session} = stores();

    let name: string = "undefined";
    let default_operating_commodity: string = "";

    $: canBeSumbit = name !== "" && default_operating_commodity !== "";

    async function submit() {
        let axiosResponse = await api.createLedger(name, default_operating_commodity);
    }
</script>


<h1>new ledger</h1>

<input bind:value={name} placeholder="ledger name"/>
<br/>

<input bind:value={default_operating_commodity} placeholder="default operating commodity"/>
<br/>
{canBeSumbit}
<button on:click={submit} disabled={!canBeSumbit}>Create</button>


