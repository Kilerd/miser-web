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
    import {entries} from "../stores";
    export let modalClose;

    const {page, session} = stores();

    let name: string = "";
    let default_operating_commodity: string = "";

    $: canBeSumbit = name !== "" && default_operating_commodity !== "";

    async function submit() {
        let axiosResponse = await api.createLedger(name, default_operating_commodity);
        let fetchedEntries = (await api.getEntries()).data.data;
        let t = {};
        for (let entry of fetchedEntries) {
            t[entry.id] = entry;
        }
        entries.update(n => t);
        modalClose();
    }
</script>


<h1>new ledger</h1>


<label>
    Ledger Name
    <input bind:value={name} placeholder="ledger name" class="input"/>
</label>
<br/>

<label>
    Default Commodity
    <input bind:value={default_operating_commodity} class="input" placeholder="default operating commodity"/>
</label>
<br/>
{canBeSumbit}
<button on:click={submit} disabled={!canBeSumbit} class="button">Create</button>


