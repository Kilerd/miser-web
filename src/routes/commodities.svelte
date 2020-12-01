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
    import {Button, Table} from "sveltestrap/src";
    import NewTransactionModal from "../components/NewTransactionModal.svelte";
    import NewCommodityModal from "../components/NewCommodityModal.svelte";

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
    let newCommodityStatus = false;
    const toggle = () => (newCommodityStatus = !newCommodityStatus);
</script>
<div>
    <h1>Commodities</h1>
    <div>
        <Button on:click={toggle}>new</Button>
        <NewCommodityModal isOpen={newCommodityStatus} toggle={toggle}/>
    </div>
</div>


<Table bordered>
  <thead>
    <tr>
      <th>Name</th>
      <th>Last Price</th>
      <th>Last price update time</th>
    </tr>
  </thead>
  <tbody>
  {#each Object.values($commodities) as commodity }
        
        <tr>
      <th scope="row">{commodity.name}</th>
      <td>{commodity.last_price}</td>
      <td>{commodity.last_price_update_time}</td>
    </tr>
    {/each}
        
    
  </tbody>
</Table>


