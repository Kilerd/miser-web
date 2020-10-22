<script context="module" lang="ts">
    import { count } from "../stores";
    export async function preload(this, page, session) {
        count.update(n => n+1);
        return {token: session.token};
    }
</script>


<script lang="ts">
    import { stores } from "@sapper/app";
    const { preloading, page, session } = stores();

    console.log("normal session", session);
    function submit() {
        session.user = "hello";
        console.log("submit", session.token);
    }

    export let token;
</script>

<div>
    <p>count {$count}</p>
    <p>token {token}</p>
    <button on:click={submit}>login</button>
</div>
