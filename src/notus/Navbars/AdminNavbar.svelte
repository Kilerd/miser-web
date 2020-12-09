<script lang="ts">
  // core components
  import UserDropdown from "../Dropdowns/UserDropdown.svelte";

  export let title: string;
</script>

<!-- Navbar -->
<nav class="w-full z-10 bg-red-500 md:flex-row md:flex-no-wrap md:justify-start flex items-center p-4">
  <div class="w-full mx-autp items-center flex justify-between md:flex-no-wrap flex-wrap md:px-10 px-4">
    <!-- Brand -->
    <h2 class="text-white text-3xl uppercase hidden lg:inline-block font-semibold">
      {title}
    </h2>
    <!-- Form -->
    <form class="md:flex hidden flex-row flex-wrap items-center lg:ml-auto mr-3">
      <div class="relative flex w-full flex-wrap items-stretch">
        <span class="z-10 h-full leading-snug font-normal absolute text-center text-gray-400 absolute bg-transparent rounded text-base items-center justify-center w-8 pl-3 py-3">
          <i class="fas fa-search"></i>
        </span>
        <input type="text" placeholder="Search here..." class="px-3 py-3 placeholder-gray-400 text-gray-700 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full pl-10"/>
      </div>
    </form>
    <!-- User -->
    <ul class="flex-col md:flex-row list-none items-center hidden md:flex">
      <UserDropdown />
    </ul>
  </div>
</nav>
<!-- End Navbar -->
