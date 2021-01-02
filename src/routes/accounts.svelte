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
    import Modal from '../components/base/Modal.svelte';
    import ModalButton from '../components/ModalButton.svelte';

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
                <div>
                    <Modal key="newAccountModal" size="l">
                        <ModalButton modalContext="newAccountModal" content={NewAccountModal} text="new Account"/>
                    </Modal>
                </div>
            </div>
            {#each Object.values(accountTree) as one}
                <AccountListItem item={one}/>
            {/each}

            <FooterAdmin/>
        </div>
    </div>
</AuthenticatedLayout>
