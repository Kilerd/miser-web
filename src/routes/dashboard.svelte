
<script context="module" lang="ts">
    export async function preload(page, session) {
        if (!session.authenticated) {
            return this.redirect(302, '/login')
        }
    }
</script>

<script lang="ts">
    import Dashboard from "../../src/views/admin/Dashboard.svelte";
    import HeaderStats from "../notus/Headers/HeaderStats.svelte";
    import FooterAdmin from "../notus/Footers/FooterAdmin.svelte";
    import AuthenticatedLayout from "../components/AuthenticatedLayout.svelte";

    export let segment: string;
</script>


<AuthenticatedLayout {segment}>
    <HeaderStats/>
    <div class="px-4 md:px-10 mx-auto w-full -m-24">
        <Dashboard/>
        <FooterAdmin/>
    </div>

</AuthenticatedLayout>

