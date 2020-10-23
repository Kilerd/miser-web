<script context="module" lang="ts">
    export async function preload(this, page, session) {
        if(!session.user) {
            this.redirect(302, `/login?page=${page.path}`)
        }
    }
</script>

<script lang="ts">
    
    import { api } from "../http";
    import { stores, goto } from "@sapper/app";
    const { page, session } = stores();
    // let a = await api.getUserInfo();
    // console.log(a);
    console.log("dashboard load", $session.user);
</script>

<div>protected</div>
<div>hello {$session.user.username}</div>
