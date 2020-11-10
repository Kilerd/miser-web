
<script lang="ts">

    import { api } from "../http";
    import { stores, goto } from "@sapper/app";
    const { page, session } = stores();
    if(!$session.user) {
        goto("/login", {})
    }

</script>

<div>protected</div>
<div>hello {$session.user.username}</div>
