<script context="module" lang="ts">
    import {api} from '../http';

    export async function preload(page, session) {
        if (!session.authenticated) {
            return this.redirect(302, '/login')
        }
    }
</script>

<script lang="ts">
    import {stores} from '@sapper/app';
    import {onMount} from 'svelte';
    import {accounts, currentLedger, test} from '../stores';
    import {Button, Table} from 'sveltestrap/src';
    import NewAccountModal from '../components/NewAccountModal.svelte';
    import AuthenticatedLayout from '../components/AuthenticatedLayout.svelte';
    import FooterAdmin from '../notus/Footers/FooterAdmin.svelte';
    import type {AccountTree, AccountTreeItem} from '../types';
    import AccountListItem from '../components/AccountListItem.svelte';
    import {accountTreeGenerator} from '../helper';

    const {page, session} = stores();

    onMount(async () => {
        currentLedger.subscribe(async id => {
            if (id !== undefined) {
                let fetchedAccount = (await api.getAccounts()).data.data;

                let accountsMap = {}

                for (let it of fetchedAccount) {
                    accountsMap[it.id] = it
                }
                accounts.update(() => {
                    return accountsMap;
                })
            }
        })
    })

    $: accountTree = accountTreeGenerator($accounts);
    let newTransactionStatus = false;
    const toggle = () => (newTransactionStatus = !newTransactionStatus);
</script>


<AuthenticatedLayout title="Accounts">
    <div class="">
        <div class="px-4 md:px-10 mx-auto w-full">
            <div>
                <h1>Accounts</h1>

                <div>
                    <Button on:click={toggle}>new</Button>
                    <NewAccountModal isOpen={newTransactionStatus} toggle={toggle}/>
                </div>
            </div>

            <Table bordered>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Status</th>
                    <th>Name</th>
                    <th>Alias</th>
                    <th>Full Name</th>
                    <th>Commodities</th>
                </tr>
                </thead>
                <tbody>
                {#each Object.values($accounts) as account }
                    <tr>
                        <th scope="row">{account.id}</th>
                        <td>{account.status}</td>
                        <td>{account.name}</td>
                        <td>{account.alias}</td>
                        <td>{account.full_name}</td>
                        <td>{account.commodities}</td>
                    </tr>
                {/each}

                </tbody>
            </Table>

            {#each Object.values(accountTree) as one}
                <AccountListItem item={one}/>
            {/each}

            <FooterAdmin/>
        </div>
    </div>
</AuthenticatedLayout>
