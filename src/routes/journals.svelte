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
    import {accounts, currentLedger, directives} from '../stores';
    import {Button} from 'sveltestrap/src';
    import NewTransactionModal from '../components/NewTransactionModal.svelte';
    import dayjs from 'dayjs';
    import Big from 'big.js'
    import TransactionGroup from '../components/TransactionGroup.svelte';
    import type {Transaction} from '../types';
    import FooterAdmin from '../notus/Footers/FooterAdmin.svelte';
    import AuthenticatedLayout from '../components/AuthenticatedLayout.svelte';
    import HeaderStats from '../notus/Headers/HeaderStats.svelte';

    const {page, session} = stores();

    onMount(async () => {
        currentLedger.subscribe(async id => {
            if (id !== undefined) {
                let raw_directives = (await api.getJournal()).data.data;

                let groupedTransactions: { [key: string]: Transaction[] } = {}

                for (let it of raw_directives) {
                    const date = dayjs(it.create_time).format('YYYY-MM-DD');
                    if (groupedTransactions[date] === undefined) {
                        groupedTransactions[date] = []
                    }
                    groupedTransactions[date].push(it)
                }
                directives.update(() => {
                    return groupedTransactions;
                })
            }
        })
    })
    const today = dayjs().format('YYYY-MM-DD');

    $: sortedJournals = Object.keys($directives).sort().reverse().map((date) => {
        const dateTransactions = $directives[date];
        let debit = new Big(0.00)
        let credit = new Big(0.00)
        for (let it of dateTransactions) {
            for (let line of it.lines) {
                const accountId = line.account;
                const type = $accounts[accountId].full_name.split(':')[0];
                const cost = new Big(line.cost[0]);
                console.log(cost, cost.s);
                switch (type) {
                    case 'Income':
                        // if (cost.s === 1) {
                        //     credit = credit.add(cost)
                        // } else {
                        //     debit = debit.add(cost.mul(-1))
                        // }
                        break;
                    case 'Expenses':
                        // if (cost.s === 1) {
                        //     credit = credit.add(cost)
                        // } else {
                        //     debit = debit.add(cost.mul(-1))
                        // }
                        break;
                    case 'Liabilities':
                        if (cost.s === 1) {
                            debit = debit.add(cost)
                        } else {
                            credit = credit.add(cost.mul(-1))
                        }
                        break;
                    case 'Equity':
                        break;
                    case 'Assets':
                        if (cost.s === 1) {
                            debit = debit.add(cost)
                        } else {
                            credit = credit.add(cost.mul(-1))
                        }
                        break;
                }
            }
        }
        return {
            date: date,
            content: dateTransactions,
            credit,
            debit
        }
    });

    let newTransactionStatus = false;
    const toggle = () => (newTransactionStatus = !newTransactionStatus);
</script>






<AuthenticatedLayout title="Journals">
    <div class="">
        <div class="px-4 md:px-10 mx-auto w-full">
            <div>
                <h1>Journals</h1>
                <div>
                    <Button on:click={toggle}>new</Button>
                    <NewTransactionModal isOpen={newTransactionStatus} toggle={toggle}/>
                </div>
            </div>

            {#each sortedJournals as datedGroup,i }

                <TransactionGroup data={datedGroup}/>
            {/each}
            <FooterAdmin/>
        </div>
    </div>

</AuthenticatedLayout>

