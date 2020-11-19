<script lang="ts">

	import Nav from "../components/Nav.svelte";

	import {onMount} from "svelte";
	import {stores} from "@sapper/app";
	import {api} from "../http";
	import {entries} from "../stores";

	export let segment;
	const { session } = stores();

	onMount(async () => {
		console.log("onmount");
		try {
			if ($session.token) {
				api.setAuthenticateToken($session.token);
			}
			let user_info = await api.getUserInfo();
			$session.user = user_info.data.data;
		} catch (e) {
			e
			console.log(`Something went wrong`);
			$session.user = false;
			return;
		}
		let fetchedEntries = (await api.getEntries()).data.data;
		console.log(fetchedEntries);
		let t = {};
		for (let entry of fetchedEntries) {
			t[entry.id] = entry;
		}
		console.log(t);
		entries.update(n => t);
	});
</script>

<style>
	section {
		display: flex;
		min-height: 100vh;
		align-items: stretch;
	}
	side {
		flex: 0 0 17rem;
	}
	main {
		flex: 1;

		background-color: white;
		padding: 2em;
		box-sizing: border-box;
	}
</style>

<svelte:head>
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
</svelte:head>
<section>
	<side>
		<Nav {segment} />
	</side>

	<main>
		<slot />
	</main>

</section>