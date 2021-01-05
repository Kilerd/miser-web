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
    import {currentLedger, directives, periodicBills} from '../stores';
    import dayjs from 'dayjs';

    import TransactionGroup from '../components/TransactionGroup.svelte';
    import type {Transaction} from '../types';
    import FooterAdmin from '../notus/Footers/FooterAdmin.svelte';
    import AuthenticatedLayout from '../components/AuthenticatedLayout.svelte';
    import ModalButton from '../components/ModalButton.svelte';
    import Modal from '../components/base/Modal.svelte';
    import CardBarChart from '../notus/Cards/CardBarChart.svelte';
    import NewTransactionModal from '../components/NewTransactionModal.svelte';

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
</script>

<AuthenticatedLayout title="Periodic Bill">
    <div class="">
        <div class="px-4 md:px-10 mx-auto w-full">

            <div>
                {#each $periodicBills.values as bill }

                    <div class="line flex border bg-white px-2 py-1 justify-between">
                        <div class="">
                            [{bill.periodic}] {bill.name} ({bill.description})
                        </div>
                        <div class="flex">

                            <div class="ml-3">
                                {bill.amount} {bill.commodity}
                            </div>
                            <div class="action ml-3">
                                <a class="text-gray-600 py-1 px-3">
                                    <i class="fas fa-edit"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>

            <FooterAdmin/>
        </div>
    </div>

</AuthenticatedLayout>
