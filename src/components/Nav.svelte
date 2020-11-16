<script lang="ts">
    export let segment: string;
    import {stores} from "@sapper/app"

    const {session} = stores()

</script>

<style>
    nav {
        border-bottom: 1px solid rgba(255, 62, 0, 0.1);
        font-weight: 300;
        padding: 0 1em;
        position: sticky;
        top: 0;
    }

    ul {
        margin: 0;
        padding: 0;
    }

    /* clearfix */
    ul::after {
        content: "";
        display: block;
        clear: both;
    }

    li {
        display: block;
        float: left;
    }

    [aria-current] {
        position: relative;
        display: inline-block;
    }

    [aria-current]::after {
        position: absolute;
        content: "";
        width: calc(100% - 1em);
        height: 2px;
        background-color: rgb(255, 62, 0);
        display: block;
        bottom: -1px;
    }

    a {
        text-decoration: none;
        padding: 1em 0.5em;
        display: block;
    }
</style>

<nav>
    <a aria-current={segment === undefined ? 'page' : undefined} href=".">home</a>
    <a aria-current={segment === 'login' ? 'page' : undefined} href="login">login</a>
    <a aria-current={segment === 'journals' ? 'page' : undefined} href="journals">Journals</a>
    {#if $session.user}
        <a href="/logout">{$session.user.username}</a>
    {/if}
</nav>
