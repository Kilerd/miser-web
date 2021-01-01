<script context="module" lang="ts">
    import {api} from '../http';

    export async function preload(page, session) {
        if (!session.authenticated) {
            return this.redirect(302, '/login')
        }
    }
</script>

<script lang="ts">
    import {goto, stores} from '@sapper/app';
    import {onMount} from 'svelte';
    import {accounts, currentLedger, directives} from '../stores';
    import DirectiveLine from '../components/DirectiveLine.svelte';
    import {Button, ListGroup, Table} from 'sveltestrap/src';
    import NewTransactionModal from '../components/NewTransactionModal.svelte';
    import {isToday, subscriptStore} from '../helper';
    import NewAccountModal from '../components/NewAccountModal.svelte';
    import AuthenticatedLayout from '../components/AuthenticatedLayout.svelte';
    import FooterAdmin from '../notus/Footers/FooterAdmin.svelte';
    import type {AccountTree, AccountTreeItem} from '../types';
    import AccountListItem from '../components/AccountListItem.svelte';

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
    let accountTree: AccountTree = {
        assets: {
            name: 'Assets',
            fullName: 'Assets',
            isAvailable: false,
            children: {}
        }, equity: {
            name: 'Equity',
            fullName: 'AsEquitysets',
            isAvailable: false,
            children: {}
        }, expense: {
            name: 'Expense',
            fullName: 'Expense',
            isAvailable: false,
            children: {}
        }, income: {
            name: 'Income',
            fullName: 'Income',
            isAvailable: false,
            children: {}
        }
    };
    accounts.subscribe(newStore => {
        let ret: AccountTree = {
            assets: {
                name: 'Assets',
                fullName: 'Assets',
                isAvailable: false,
                children: {}
            }, equity: {
                name: 'Equity',
                fullName: 'AsEquitysets',
                isAvailable: false,
                children: {}
            }, expense: {
                name: 'Expense',
                fullName: 'Expense',
                isAvailable: false,
                children: {}
            }, income: {
                name: 'Income',
                fullName: 'Income',
                isAvailable: false,
                children: {}
            }
        };
        Object.values(newStore).forEach(it => {
            let strings = it.full_name.split(':');
            let accountType = strings[0].toLocaleLowerCase();
            let targetCategory: AccountTreeItem = ret[accountType];
            for (let i = 1; i < strings.length - 1; i++) {
                let item = strings[i];
                if (!(item in targetCategory.children)) {
                    targetCategory.children[item] = {
                        name: item,
                        fullName: strings.slice(0, i + 1).join(':'),
                        isAvailable: false,
                        children: {}
                    }
                }
                targetCategory = targetCategory.children[item];
            }
            let leafItem = strings[strings.length - 1];
            targetCategory.children[leafItem] = {
                name: leafItem,
                fullName: it.full_name,
                isAvailable: true,
                alias: it.alias,
                commodities:it.commodities,
                id: it.id,
                children: {}
            }
        })
        accountTree = ret;
    })
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
