<script context="module" lang="ts">
    export async function preload(page, session) {
        if (!session.authenticated) {
            return this.redirect(302, "/login")
        }
    }
</script>

<script lang="ts">
    import {stores} from "@sapper/app";
    import {onMount} from 'svelte';
    import {commodities, currentLedger} from "../stores";
    import NewCommodityModal from "../components/NewCommodityModal.svelte";
    import FooterAdmin from "../notus/Footers/FooterAdmin.svelte";
    import AuthenticatedLayout from "../components/AuthenticatedLayout.svelte";

    const {page, session} = stores();

    onMount(async () => {
        await commodities.fetchLatest()
    })

</script>

<AuthenticatedLayout title="Journals">
    <div class="">
        <div class="px-4 md:px-10 mx-auto w-full">
            <div>
                <h1>Commodities</h1>
                <div>
                    <NewCommodityModal/>
                </div>
            </div>

            <div>
                {#each Object.values($commodities) as commodity }

                    <div class="line flex border bg-white px-2 py-1 justify-between">
                        <div class="">
                            {commodity.name}
                        </div>
                        <div class="flex">

                            <div class="ml-3">
                                {commodity.last_price}
                            </div>
                            <div class="ml-3">{commodity.last_price_update_time}</div>
                            <div class="action ml-3">
                                <a class="text-gray-600 py-1 px-3">
                                    <i class="fas fa-edit"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>

            <FooterAdmin/>
        </div>
    </div>

</AuthenticatedLayout>
