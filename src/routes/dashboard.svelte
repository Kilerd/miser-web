<script lang="ts">

    import {api} from "../http";
    import {stores, goto} from "@sapper/app";
    import {onMount} from "svelte";
    import {directives} from "../stores";
    import DirectiveLine from "../components/DirectiveLine.svelte";

    const {page, session} = stores();
    if (!$session.user) {
        goto("/login", {})
    }
    onMount(async () => {
        let raw_directives = (await api.getJournal()).data.data;
        let fetched = Object.keys(raw_directives).sort().reverse().map((key) => {

            return {
                date: key,
                contents: raw_directives[key]
            }
        });
        directives.update(() => {
            return fetched;
        })
    })
</script>

{#each $directives as {date, contents}, i }
    <h2>{date}</h2>
    {#each contents as directive}
        <DirectiveLine directive={directive} />
    {/each}
{/each}


