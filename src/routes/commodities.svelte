<script context="module" lang="ts">
    import {api} from "../http";

    export async function preload(page, session) {
        if (!session.authenticated) {
            return this.redirect(302, "/login")
        }
    }
</script>

<script lang="ts">
    import {stores} from "@sapper/app";
    import {onMount} from "svelte";
    import {commodities, currentLedger} from "../stores";
    import {Button} from "sveltestrap/src";
    import NewTransactionModal from "../components/NewTransactionModal.svelte";

    const {page, session} = stores();

    onMount(async () => {
        currentLedger.subscribe(async id => {
            let fetchedCommodities = (await api.getCommodities()).data.data;

            let commoditiesMap = {}

            for (let it of fetchedCommodities) {
                commoditiesMap[it.name] = it
            }

            commodities.update(() => {
                return commoditiesMap;
            })
        })

    })
    let newTransactionStatus = false;
    const toggle = () => (newTransactionStatus = !newTransactionStatus);
</script>
<div>
    <h1>Commodities</h1>
    <div>
        <Button on:click={toggle}>new</Button>
        <NewTransactionModal isOpen={newTransactionStatus} toggle={toggle}/>
    </div>
</div>

<div class="commodity-list">
    {#each Object.values($commodities) as commodity }
        <div class="commodity">
            [{commodity.name}][{commodity.last_price}]{commodity.last_price_update_time}
        </div>
    {/each}
</div>



