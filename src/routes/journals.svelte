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
    import {currentLedger, directives} from '../stores';
    import dayjs from 'dayjs';

    import TransactionGroup from '../components/TransactionGroup.svelte';
    import type {Transaction} from '../types';
    import FooterAdmin from '../notus/Footers/FooterAdmin.svelte';
    import AuthenticatedLayout from '../components/AuthenticatedLayout.svelte';
    import ModalButton from "../components/ModalButton.svelte";
    import Modal from "../components/base/Modal.svelte";

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


<AuthenticatedLayout title="Journals">
    <div class="">
        <div class="px-4 md:px-10 mx-auto w-full">
            <div>
                <div>
                    <Modal size="l">
                        <ModalButton/>
                    </Modal>

                </div>
            </div>

            <Modal key="transaction-detail">
                {#each $directives.entries as [key, value], i }
                    <TransactionGroup date={key} items={value}/>
                {/each}
            </Modal>
            <FooterAdmin/>
        </div>
    </div>

</AuthenticatedLayout>

