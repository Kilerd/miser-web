<script context="module" lang="ts">
    import { count } from "../stores";
</script>

<script lang="ts">
    import { goto, stores } from "@sapper/app";

    const { session } = stores();

    let email = "";
    let password = "";
    import { api } from "../http";

    let userinfo = api.getUserInfo().then(() => {
        goto("/");
    });

    async function submit() {
        goto("/");
    }
</script>

<h1>Login form</h1>

<input type="email" bind:value={email} placeholder="your email" />
<br />

<input type="password" bind:value={password} placeholder="your password" />
<br />

<button on:click={submit}>Login</button>
