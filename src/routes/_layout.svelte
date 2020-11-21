<script lang="ts">

	import Nav from "../components/Nav.svelte";

	import {onMount} from "svelte";
	import {stores} from "@sapper/app";
	import {api} from "../http";
	import {accounts, entries} from "../stores";

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
		let t = {};
		for (let entry of fetchedEntries) {
			t[entry.id] = entry;
		}
		entries.update(n => t);

		let fetchedAccounts = (await api.getAccounts()).data.data;
		accounts.update(n=> fetchedAccounts)
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