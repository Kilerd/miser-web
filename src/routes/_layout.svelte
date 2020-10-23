<script lang="ts">
	import Nav from "../components/Nav.svelte";

	import { onMount } from "svelte";
	import { stores } from "@sapper/app";
	import { api } from "../http";
	import axios from "axios";
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
			console.log(`Something went wrong`);
			$session.user = false;
			return;
		}
		console.log("doen");
	});
</script>

<style>
	main {
		position: relative;
		max-width: 56em;
		background-color: white;
		padding: 2em;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>

<Nav {segment} />

<main>
	<slot />
</main>
