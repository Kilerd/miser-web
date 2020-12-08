<script lang="ts">
    import {goto, stores} from "@sapper/app";
    import {api} from "../http";
    import AuthNavbar from "../notus/Navbars/AuthNavbar.svelte";
    import FooterSmall from "../notus/Footers/FooterSmall.svelte";

    const {session} = stores();

    const github = "../assets/img/github.svg";
    const google = "../assets/img/google.svg";

    let email = "";
    let password = "";
    let error = null;

    if ($session.user) {
        goto("/dashboard", {})
    }

    async function submit() {
        try {
            let axiosResponse = await api.login(email, password);
            const token = axiosResponse.data.data;
            document.cookie = `AUTH=${token}`;
            api.setAuthenticateToken($session, token);
            let axiosResponse1 = await api.getUserInfo();
            $session.user = axiosResponse1.data.data;
            $session.authenticated = true;
            await goto("/dashboard", {})
        } catch (e) {
            error = "error on login"
        }

    }
</script>

<!--<h1>Login form</h1>-->
<!--{#if error}-->
<!--    <p>{error}</p>-->
<!--{/if}-->
<!--<input type="email" bind:value={email} placeholder="your email"/>-->
<!--<br/>-->

<!--<input type="password" bind:value={password} placeholder="your password"/>-->
<!--<br/>-->

<!--<button on:click={submit}>Login</button>-->


<div>
    <AuthNavbar/>
    <main>
        <section class="relative w-full h-full py-40 min-h-screen">
            <div
                    class="absolute top-0 w-full h-full bg-gray-900 bg-no-repeat bg-full"
            ></div>
            <div class="container mx-auto px-4 h-full">
                <div class="flex content-center items-center justify-center h-full">
                    <div class="w-full lg:w-4/12 px-4">
                        <div
                                class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-300 border-0"
                        >
                            <div class="rounded-t mb-0 px-6 py-6">
                                <div class="text-center mb-3">
                                    <h6 class="text-gray-600 text-sm font-bold">
                                        Sign in with
                                    </h6>
                                </div>
                                <div class="btn-wrapper text-center">
                                    <button
                                            class="bg-white active:bg-gray-100 text-gray-800 font-normal px-4 py-2 rounded outline-none focus:outline-none mr-2 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs ease-linear transition-all duration-150"
                                            type="button"
                                    >
                                        <img alt="..." class="w-5 mr-1" src="{github}"/>
                                        Github
                                    </button>
                                    <button
                                            class="bg-white active:bg-gray-100 text-gray-800 font-normal px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs ease-linear transition-all duration-150"
                                            type="button"
                                    >
                                        <img alt="..." class="w-5 mr-1" src="{google}"/>
                                        Google
                                    </button>
                                </div>
                                <hr class="mt-6 border-b-1 border-gray-400"/>
                            </div>
                            <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
                                <div class="text-gray-500 text-center mb-3 font-bold">
                                    <small>Or sign in with credentials</small>
                                </div>
                                <form>
                                    <div class="relative w-full mb-3">
                                        <label
                                                class="block uppercase text-gray-700 text-xs font-bold mb-2"
                                                for="grid-email"
                                        >
                                            Email
                                        </label>
                                        <input
                                                id="grid-email"
                                                type="email"
                                                class="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                                                placeholder="Email"
                                                bind:value={email}
                                        />
                                    </div>

                                    <div class="relative w-full mb-3">
                                        <label
                                                class="block uppercase text-gray-700 text-xs font-bold mb-2"
                                                for="grid-password"
                                        >
                                            Password
                                        </label>
                                        <input
                                                id="grid-password"
                                                type="password"
                                                class="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                                                placeholder="Password"
                                                bind:value={password}
                                        />
                                    </div>
                                    <div>
                                        <label class="inline-flex items-center cursor-pointer">
                                            <input
                                                    id="customCheckLogin"
                                                    type="checkbox"
                                                    class="form-checkbox text-gray-800 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                                            />
                                            <span class="ml-2 text-sm font-semibold text-gray-700">
                  Remember me
                </span>
                                        </label>
                                    </div>

                                    <div class="text-center mt-6">
                                        <button
                                                class="bg-gray-900 text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                                                type="button"
                                                on:click={submit}
                                        >
                                            Sign In
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div class="flex flex-wrap mt-6 relative">
                            <div class="w-1/2">
                                <a href="#pablo" on:click={(e) => e.preventDefault()} class="text-gray-300">
                                    <small>Forgot password?</small>
                                </a>
                            </div>
                            <div class="w-1/2 text-right">
                                <a  href="/auth/register" class="text-gray-300">
                                    <small>Create new account</small>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <FooterSmall absolute="true"/>
        </section>
    </main>
</div>

