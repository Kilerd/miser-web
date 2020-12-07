<script>
  import { Router, Route } from "svelte-routing";

  // components for this layout
  import AdminNavbar from "../../src/notus/Navbars/AdminNavbar.svelte";
  import Sidebar from "../../src/notus/Sidebar/Sidebar.svelte";
  import HeaderStats from "../../src/notus/Headers/HeaderStats.svelte";
  import FooterAdmin from "../../src/notus/Footers/FooterAdmin.svelte";

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
      <Router url="admin">
        <Route path="dashboard" component="{Dashboard}" />
        <Route path="settings" component="{Settings}" />
        <Route path="tables" component="{Tables}" />
        <Route path="maps" component="{Maps}" />
      </Router>
      <FooterAdmin />
    </div>
  </div>
</div>
