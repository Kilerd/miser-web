
<script lang="ts">

    import { api } from "../http";
    import { stores, goto } from "@sapper/app";
    import {onMount} from "svelte";
    const { page, session } = stores();
    if(!$session.user) {
        goto("/login", {})
    }
    let direcitves;
    onMount(async () => {
        direcitves = await api.getJournal();
        console.log(direcitves);
    })
</script>

<div>protected</div>

