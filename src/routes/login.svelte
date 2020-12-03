<script lang="ts">
    import {goto, stores} from "@sapper/app";
    import {api} from "../http";

    const {session} = stores();

    let email = "";
    let password = "";
    let error = null;

    if ($session.user) {
        goto("/journals", {})
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
            await goto("/", {})
        } catch (e) {
            error = "error on login"
        }

    }
</script>

<h1>Login form</h1>
{#if error}
    <p>{error}</p>
{/if}
<input type="email" bind:value={email} placeholder="your email"/>
<br/>

<input type="password" bind:value={password} placeholder="your password"/>
<br/>

<button on:click={submit}>Login</button>
