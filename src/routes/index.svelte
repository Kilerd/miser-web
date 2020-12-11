<script context="module" lang="ts">
    import {BASE_URL} from "../http";

    export async function preload(page, session) {
        let res = await this.fetch(`${BASE_URL}/statics`);
        let statics = await res.json();


        return {authenticated: session.authenticated, user: session.user, statics: statics.data};
    }

</script>

<script lang="ts">


    // core components
    import IndexNavbar from "../notus/Navbars/IndexNavbar.svelte";
    import Footer from "../notus/Footers/Footer.svelte";

    const patternVue = "/assets/img/pattern_svelte.png";
    const componentBtn = "/assets/img/component-btn.png";
    const componentProfileCard = "/assets/img/component-profile-card.png";
    const componentInfoCard = "/assets/img/component-info-card.png";
    const componentInfo2 = "/assets/img/component-info-2.png";
    const componentMenu = "/assets/img/component-menu.png";
    const componentBtnPink = "/assets/img/component-btn-pink.png";
    const documentation = "/assets/img/documentation.png";
    const login = "/assets/img/login.jpg";
    const profile = "/assets/img/profile.jpg";
    const landing = "/assets/img/landing.jpg";
    export let location;
    export let statics: { users: number, ledgers: number, transactions: number };
    export let authenticated: boolean = false;
    export let user;
</script>


<!--<IndexNavbar />-->
<section class="header relative items-center flex h-screen max-h-860-px overflow-hidden">
    <div class="container mx-auto items-center flex flex-wrap">
        <div class="w-full md:w-8/12 lg:w-6/12 xl:w-6/12 px-4 z-50">
            <div class="pt-32 sm:pt-0">
                <h2 class="font-semibold text-4xl text-gray-700">
                    {#if authenticated}
                        Hi {user.username}, welcome to Project Miser.
                    {:else}
                        Project Miser - A double-entry accounting tool.
                    {/if}
                </h2>
                <p class="mt-4 text-lg leading-relaxed text-gray-600">
                    Project Miser is a double-entry accounting tool with friendly ui and powerful statistics graphic. it
                    integrates with popular Beancount ecosystem and provides user-friendly UI.
                </p>
                <div class="mt-12">
                    {#if authenticated}
                        <a href="/dashboard"
                           class="get-started text-white font-bold px-6 py-4 rounded outline-none focus:outline-none mr-1 mb-1 bg-red-500 active:bg-red-600 uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150">
                            Goto Dashboard
                        </a>
                    {:else}
                        <a href="/login"
                           class="get-started text-white font-bold px-6 py-4 rounded outline-none focus:outline-none mr-1 mb-1 bg-red-500 active:bg-red-600 uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150">
                            Sign in
                        </a>
                        <a href="/register"
                           class="github-star ml-1 text-white font-bold px-6 py-4 rounded outline-none focus:outline-none mr-1 mb-1 bg-gray-800 active:bg-gray-700 uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150">
                            Register
                        </a>
                    {/if}

                </div>
            </div>
        </div>
        <div class="w-full md:w-4/12 px-4 mr-auto ml-auto mt-32 relative">
            <i class="fa fa-money-check-alt text-gray-200 text-55 absolute -top-225-px -right-75 left-auto opacity-80 "></i>
        </div>
    </div>

</section>

<section class=" relative bg-gray-200">
    <div class="-mt-20 top-0 bottom-auto left-0 right-0 w-full absolute h-20" style="transform: translateZ(0);">
        <svg
                class="absolute bottom-0 overflow-hidden"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                version="1.1"
                viewBox="0 0 2560 100"
                x="0"
                y="0"
        >
            <polygon class="text-gray-200 fill-current" points="2560 0 2560 100 0 100"></polygon>
        </svg>
    </div>

    <div class="container mx-auto overflow-hidden pb-20">
        <div class="flex flex-wrap items-center pt-20">
            <div class="w-full md:w-6/12 px-4 mr-auto ml-auto mt-32">
                <div class="justify-center flex flex-wrap relative">
                    <div class="my-4 w-full lg:w-6/12 px-4">

                        <div class="bg-blue-500 shadow-lg rounded-lg text-center p-8 mt-8">
                            <i class="fa fa-user-astronaut text-5xl mx-auto text-white"></i>
                            <p class="text-lg text-white mt-4 font-semibold">
                                {statics.users} users
                            </p>
                        </div>


                        <div class="bg-gray-800 shadow-lg rounded-lg text-center p-8 mt-8">
                            <i class="fa fa-wallet text-5xl mx-auto text-white"></i>
                            <p class="text-lg text-white mt-4 font-semibold">
                                {statics.ledgers} ledgers
                            </p>
                        </div>

                    </div>
                    <div class="my-4 w-full lg:w-6/12 px-4 lg:mt-16">
                        <div class="bg-red-700 shadow-lg rounded-lg text-center p-8 mt-8">
                            <i class="fa fa-money-check-alt text-5xl mx-auto text-white"></i>
                            <p class="text-lg text-white mt-4 font-semibold">
                                {statics.transactions} transactions
                            </p>
                        </div>
                        <div class="bg-green-500 shadow-lg rounded-lg text-center p-8 mt-8">
                            <i class="fa fa-question text-5xl mx-auto text-white"></i>
                            <p class="text-lg text-white mt-4 font-semibold">
                                undefined
                            </p>
                        </div>

                    </div>
                </div>
            </div>

            <div class="w-full md:w-4/12 px-12 md:px-4 ml-auto mr-auto mt-48">
                <h3 class="text-3xl mb-2 font-semibold leading-normal">
                    Premium Plan
                </h3>
                <p class="text-lg font-light leading-relaxed mt-4 mb-4 text-gray-700">
                    In the future, we would provide premium plan for users. within this plan, Miser would automatically
                    backup your data and send you ledgers' statics or budget status.
                </p>
                <p class="text-lg font-light leading-relaxed mt-4 mb-4 text-gray-700">
                    We do care about your data.
                </p>
            </div>
        </div>
    </div>

    <div class="container mx-auto px-4 pb-32 pt-32">
        <div class="items-center flex flex-wrap">
            <div class="w-full md:w-5/12 ml-auto px-12 md:px-4">
                <div class="md:pr-12">
                    <h3 class="text-3xl font-semibold">
                        Feature Preview
                    </h3>
                    <p class="mt-4 text-lg leading-relaxed text-gray-600">
                        Rather than Beancount and other accounting tool, what Miser wanna do is balancing user
                        experience between professional accounting tools and easy daily tool.
                    </p>

                </div>
            </div>

            <div class="w-full md:w-6/12 mr-auto px-4 pt-24 md:pt-0">
                <ul class="list-none mt-6">
                    <li class="py-2">
                        <div class="flex items-center">
                            <div>
                                  <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-gray-600 bg-gray-100 mr-3">
                                    <i class="fas fa-circle-notch"></i>
                                  </span>
                            </div>
                            <div>
                                <h4 class="text-gray-600">
                                    Support scheduler transaction for periodic trading
                                </h4>
                            </div>
                        </div>
                    </li>
                    <li class="py-2">
                        <div class="flex items-center">
                            <div>
                                  <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-gray-600 bg-gray-100 mr-3">
                                    <i class="fab fa-bitcoin"></i>
                                  </span>
                            </div>
                            <div>
                                <h4 class="text-gray-600">
                                    Update commodity's price automatically for multiple commodities ledger
                                </h4>
                            </div>
                        </div>
                    </li>
                    <li class="py-2">
                        <div class="flex items-center">
                            <div>
                                  <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-gray-600 bg-gray-100 mr-3">
                                    <i class="fa fa-receipt"></i>
                                  </span>
                            </div>
                            <div>
                                <h4 class="text-gray-600">
                                    Link document to transaction like receipts & invoices
                                </h4>
                            </div>
                        </div>
                    </li>
                    <li class="py-2">
                        <div class="flex items-center">
                            <div>
                                  <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-gray-600 bg-gray-100 mr-3">
                                    <i class="fa fa-magic"></i>
                                  </span>
                            </div>
                            <div>
                                <h4 class="text-gray-600">
                                    Support fully API for developer for automation ecosystem
                                </h4>
                            </div>
                        </div>
                    </li>
                    <li class="py-2">
                        <div class="flex items-center">
                            <div>
                                  <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-gray-600 bg-gray-100 mr-3">
                                    <i class="fa fa-ethernet"></i>
                                  </span>
                            </div>
                            <div>
                                <h4 class="text-gray-600">
                                    Beancount integration
                                </h4>
                            </div>
                        </div>
                    </li>
                    <li class="py-2">
                        <div class="flex items-center">
                            <div>
                                  <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-gray-600 bg-gray-100 mr-3">
                                    <i class="fa fa-lock"></i>
                                  </span>
                            </div>
                            <div>
                                <h4 class="text-gray-600">
                                    Encrypted date in server
                                </h4>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</section>


<section class="py-20 bg-gray-700 overflow-hidden">
    <div class="container mx-auto pb-64">
        <div class="flex flex-wrap justify-center">
            <div class="w-full md:w-5/12 px-12 md:px-4 ml-auto mr-auto md:mt-64">
                <div class="text-gray-600 p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-full bg-white">
                    <i class="fas fa-code-branch text-xl"></i>
                </div>
                <h3 class="text-3xl mb-2 font-semibold leading-normal text-white">
                    Open Source
                </h3>
                <p class="text-lg font-light leading-relaxed mt-4 mb-4 text-gray-500">
                    The frontend of Project Miser is open source in Github. the backend would be open source in the
                    future when most of features had been implemented and stabled.
                </p>
                <p class="text-lg font-light leading-relaxed mt-0 mb-4 text-gray-500">
                    Self-hosted configuration would also be coming in the further future.
                </p>
                <a href="https://github.com/kilerd/miser-web?ref=miser-web" target="_blank"
                   class="github-star mt-4 inline-block text-white font-bold px-6 py-4 rounded outline-none focus:outline-none mr-1 mb-1 bg-gray-800 active:bg-gray-700 uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150">
                    Github Star
                </a>
            </div>

            <div class="w-full md:w-4/12 px-4 mr-auto ml-auto mt-32 relative">
                <i class="fab fa-github text-gray-800 text-55 absolute -top-150-px -right-100 left-auto opacity-80"></i>
            </div>
        </div>
    </div>
</section>

<section class="pb-16 bg-gray-300 relative pt-32">
    <div class="-mt-20 top-0 bottom-auto left-0 right-0 w-full absolute h-20" style="transform: translateZ(0);">
        <svg
                class="absolute bottom-0 overflow-hidden"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                version="1.1"
                viewBox="0 0 2560 100"
                x="0"
                y="0"
        >
            <polygon
                    class="text-gray-300 fill-current"
                    points="2560 0 2560 100 0 100"
            ></polygon>
        </svg>
    </div>

    <div class="container mx-auto">
        <div
                class="flex flex-wrap justify-center bg-white shadow-xl rounded-lg -mt-64 py-16 px-12 relative z-10"
        >
            <div class="w-full text-center lg:w-8/12">
                <p class="text-4xl text-center">
          <span role="img" aria-label="love">
            😍
          </span>
                </p>
                <h3 class="font-semibold text-3xl">
                    Do you love Project Miser?
                </h3>
                <p class="text-gray-600 text-lg leading-relaxed mt-4 mb-4">
                    this project is now totally <strong>WIP</strong>, and the register page is hidden. if you wanna try
                    the project, you
                    can register it and then taste, if you can find how to register(PS: I promise that the api of
                    registering is working
                    well). any bug, recommendation, feedback or features are welcome.
                </p>
                <div class="sm:block flex flex-col mt-10">
                    <a href="mailto://blove694@gmail.com" target="_blank"
                       class="get-started text-white font-bold px-6 py-4 rounded outline-none focus:outline-none mr-1 mb-2 bg-red-500 active:bg-red-600 uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150"
                    >
                        Mail to me!
                    </a>
                    <a href="https://github.com/kilerd/miser-web?ref=miser-web" target="_blank"
                       class="github-star sm:ml-1 text-white font-bold px-6 py-4 rounded outline-none focus:outline-none mr-1 mb-1 bg-gray-800 active:bg-gray-700 uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150"
                    >
                        <i class="fab fa-github text-lg mr-1"></i>
                        <span>Help With a Star</span>
                    </a>
                </div>
                <div class="text-center mt-16"></div>
            </div>
        </div>
    </div>
</section>
<Footer/>