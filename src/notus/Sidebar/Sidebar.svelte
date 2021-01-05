<script lang="ts">


    // core components
    import NotificationDropdown from '../Dropdowns/NotificationDropdown.svelte';
    import UserDropdown from '../Dropdowns/UserDropdown.svelte';
    import {currentLedger, entries, segment} from '../../stores';
    import {stores} from '@sapper/app'
    import {api, setCookie} from '../../http';

    let collapseShow = 'hidden';

    function toggleCollapseShow(classes) {
        collapseShow = classes;
    }

    const {session} = stores()

    function changeLedger(ledgerId: number) {
        api.setCurrentLedgerId(ledgerId.toString());
        currentLedger.update(n => ledgerId.toString())
        setCookie('CURRENT_LEDGER_ID', ledgerId.toString())
    }

    function changeSegment(nextSegment: string) {
        segment.update(_ => nextSegment);
    }

    const TOP_LINK = [
        {link: 'dashboard', name: 'Dashboard'},
        {link: 'journals', name: 'Journals'},
        {link: 'commodities', name: 'Commodities'},
        {link: 'accounts', name: 'Accounts'},
        {link: 'periodic', name: 'Periodic Bills'},

    ]
</script>

<nav
        class="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-no-wrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6"
>
    <div
            class="md:flex-col md:items-stretch md:min-h-full md:flex-no-wrap px-0 flex flex-wrap items-center justify-between w-full mx-auto"
    >
        <!-- Toggler -->
        <button
                class="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                type="button"
                on:click={() => toggleCollapseShow('bg-white m-2 py-3 px-6')}
        >
            <i class="fas fa-bars"></i>
        </button>
        <!-- Brand -->
        <a
                class="md:block text-left md:pb-2 text-gray-700 mr-0 inline-block whitespace-no-wrap text-sm uppercase font-bold p-4 px-0"
                href="/"
        >
            Project Miser
        </a>
        <!-- User -->
        <ul class="md:hidden items-center flex flex-wrap list-none">
            <li class="inline-block relative">
                <NotificationDropdown/>
            </li>
            <li class="inline-block relative">
                <UserDropdown/>
            </li>
        </ul>
        <!-- Collapse -->
        <div
                class="md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded {collapseShow}"
        >
            <!-- Collapse header -->
            <div
                    class="md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-gray-300"
            >
                <div class="flex flex-wrap">
                    <div class="w-6/12">
                        <a

                                class="md:block text-left md:pb-2 text-gray-700 mr-0 inline-block whitespace-no-wrap text-sm uppercase font-bold p-4 px-0"
                                href="/"
                        >
                            Notus Svelte
                        </a>
                    </div>
                    <div class="w-6/12 flex justify-end">
                        <button
                                type="button"
                                class="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                                on:click={() => toggleCollapseShow('hidden')}
                        >
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            </div>
            <!-- Form -->
            <form class="mt-6 mb-4 md:hidden">
                <div class="mb-3 pt-0">
                    <input
                            type="text"
                            placeholder="Search"
                            class="px-3 py-2 h-12 border border-solid border-gray-600 placeholder-gray-400 text-gray-700 bg-white rounded text-base leading-snug shadow-none outline-none focus:outline-none w-full font-normal"
                    />
                </div>
            </form>

            <!-- Divider -->
            <hr class="my-4 md:min-w-full"/>
            <!-- Heading -->
            <h6 class="md:min-w-full text-gray-600 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
                Ledgers
            </h6>
            <!-- Navigation -->
            <ul class="md:flex-col md:min-w-full flex flex-col list-none">
                {#each Object.values($entries) as entry, i}
                    <li class="items-center">
                        <a href="{`/${$segment}`}" on:click={changeLedger(entry.id)}
                           class="text-xs uppercase py-3 font-bold block text-gray-800 hover:text-gray-600 {entry.id.toString()===$currentLedger ? 'text-red-500 hover:text-red-600' : 'text-gray-800 hover:text-gray-600'}">
                            <i class="fas fa-newspaper mr-2 text-sm text-gray-400 {entry.id.toString()===$currentLedger ? 'opacity-75' : 'text-gray-400'}"></i>
                            {entry.name}
                        </a>
                    </li>
                {/each}
            </ul>


            <!-- Divider -->
            <hr class="my-4 md:min-w-full"/>
            <!-- Heading -->
            <h6 class="md:min-w-full text-gray-600 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
                {$segment}
            </h6>
            <!-- Navigation -->

            <ul class="md:flex-col md:min-w-full flex flex-col list-none">
                {#each TOP_LINK as item, i}
                    <li class="items-center">
                        <a href="{`/${item.link}`}" on:click={()=>changeSegment(item.link)}
                           class="text-xs uppercase py-3 font-bold block text-gray-800 hover:text-gray-600 {item.link === $segment ? 'text-red-500 hover:text-red-600' : 'text-gray-800 hover:text-gray-600'}">
                            <i class="fas fa-tv mr-2 text-sm text-gray-400 {item.link === $segment ? 'opacity-75' : 'text-gray-400'}"></i>
                            {item.name}
                        </a>
                    </li>
                {/each}
            </ul>
        </div>
    </div>
</nav>
