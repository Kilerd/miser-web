<style>
    h1, figure, p {
        margin: 0 auto;
    }

    h1 {
        font-size: 2.8em;
        text-transform: uppercase;
        font-weight: 700;
        margin: 0 0 0.5em 0;
    }

    figure {
        margin: 0 0 1em 0;
    }


    p {
        margin: 1em auto;
    }

    @media (min-width: 480px) {
        h1 {
            font-size: 4em;
        }
    }
</style>

<script lang="ts">
    import {stores} from "@sapper/app"

    const {session} = stores()

</script>

<svelte:head>
    <title>Project Miser</title>
</svelte:head>

<h1>Project Miser</h1>

<figure>
    <figcaption>Hello Miser</figcaption>
</figure>

<p><strong>An double-entry accounting tool with friendly ui and powerful statistics graphic</strong></p>
<p>aim to:</p>
<ul>
    <li>scheduler transaction supported</li>
    <li>auto commodity's price update</li>
    <li>transactions' documents supported</li>
    <li>developer friendly, fully api supported for automation tool</li>
    <li>beancount exportation supported</li>
    <li>encrypted payee and narration supported</li>
</ul>

<p>this project is now totally <strong>WIP</strong>, and the register page is hidden. if you wanna try the project, you can register it and then taste, if you can find how to register(PS: I promise that the api of registering is working well). any bug, recommendation, feedback or features are welcome via blove694@gmail.com.</p>