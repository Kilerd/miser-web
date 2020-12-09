
<script lang="ts">
    import Sidebar from "../notus/Sidebar/Sidebar.svelte";
    import AdminNavbar from "../notus/Navbars/AdminNavbar.svelte";

    export let title: string;
</script>
<div>
    <Sidebar />
    <div class="relative md:ml-64 bg-gray-200 flex flex-col">
        <AdminNavbar {title}/>
        <slot/>
    </div>
</div>
