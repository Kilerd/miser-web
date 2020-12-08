<script>


    // components for this layout
    import AdminNavbar from "../notus/Navbars/AdminNavbar.svelte";
    import Sidebar from "../notus/Sidebar/Sidebar.svelte";
    import HeaderStats from "../notus/Headers/HeaderStats.svelte";
    import FooterAdmin from "../notus/Footers/FooterAdmin.svelte";

    // pages for this layout
    import Dashboard from "../../src/views/admin/Dashboard.svelte";
    import Settings from "../../src/views/admin/Settings.svelte";
    import Tables from "../../src/views/admin/Tables.svelte";
    import Maps from "../../src/views/admin/Maps.svelte";

    export let location;
    export let admin = "";
</script>

<div>
    <Sidebar location={location}/>
    <div class="relative md:ml-64 bg-gray-200">
        <AdminNavbar />
        <HeaderStats />
        <div class="px-4 md:px-10 mx-auto w-full -m-24">
<!--            <a url="admin">-->
<!--                <a path="dashboard" component="{Dashboard}" />-->
<!--                <a path="settings" component="{Settings}" />-->
<!--                <a path="tables" component="{Tables}" />-->
<!--                <a path="maps" component="{Maps}" />-->
<!--            </a>-->
            <Dashboard />
            <Settings />
            <Tables/>
            <Maps/>
            <FooterAdmin />
        </div>
    </div>
</div>
