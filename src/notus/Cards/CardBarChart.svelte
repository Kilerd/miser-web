<script lang="ts">
    import {onMount} from 'svelte';
    import Chart from 'chart.js';
    import Dayjs from 'dayjs';
    import Big from 'big.js'
    import {accounts, directives} from '../../stores';
    import type {Transaction} from '../../types';


    // init chart
    onMount(async () => {
        let data = {};
        for (let i = 0; i < 30; i++) {
            let today = Dayjs();
            let day = today.subtract(i, 'day');
            data[day.format('YYYY-MM-DD')] = {day: day, label: day.format('MM-DD'), amount: new Big(0)};
        }

        for (let [day, dayTransactions] of $directives.entries) {
            let targetDay = data[day];
            if (targetDay !== undefined) {
                for (let it of dayTransactions) {
                    for (let line of it.lines) {
                        const accountId = line.account;
                        const type = $accounts[accountId]?.full_name.split(':')[0];
                        const cost = new Big(line.cost[0]);
                        switch (type) {
                            case 'Income':
                                targetDay.amount = targetDay.amount.sub(cost);
                                break;
                            case 'Expenses':
                                targetDay.amount = targetDay.amount.sub(cost);
                                break;
                            case 'Liabilities':
                                targetDay.amount = targetDay.amount.sub(cost);
                                break;
                            case 'Equity':
                                break;
                            case 'Assets':
                                // targetDay.amount = targetDay.amount.sub(cost);
                                break;
                        }
                    }
                }
            }
        }

        let labels = Object.values(data).sort((a, b) => a.day - b.day).map(it => it.label);
        let dataset = Object.values(data).sort((a, b) => a.day - b.day).map(it => it.amount);
        let config = {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: new Date().getFullYear(),
                        backgroundColor: 'rgba(237,100,166, 0.5)',
                        borderColor: 'rgba(237,100,166, 1)',
                        data: dataset,
                        fill: false,
                        borderWidth: 1,
                    }
                ]
            },
            options: {
                maintainAspectRatio: false,
                responsive: true,
                title: {
                    display: true,
                    text: 'Orders Chart',
                },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                },
                hover: {
                    mode: 'nearest',
                    intersect: true,
                },
                legend: {
                    labels: {
                        fontColor: 'rgba(0,0,0,.4)',
                    },
                    align: 'end',
                    position: 'bottom',
                },
                scales: {
                    xAxes: [
                        {
                            display: true,
                            scaleLabel: {
                                display: false,
                                labelString: 'Month',
                            },
                            gridLines: {
                                borderDash: [2],
                                borderDashOffset: [0],
                                color: 'rgba(33, 37, 41, 0.3)',
                                zeroLineColor: 'rgba(33, 37, 41, 0.3)',
                                zeroLineBorderDash: [2],
                                zeroLineBorderDashOffset: [0],
                            },
                        },
                    ],
                    yAxes: [
                        {
                            display: true,
                            scaleLabel: {
                                display: false,
                                labelString: 'Value',
                            },
                            gridLines: {
                                borderDash: [2],
                                drawBorder: false,
                                borderDashOffset: [2],
                                color: 'rgba(33, 37, 41, 0.2)',
                                zeroLineColor: 'rgba(33, 37, 41, 0.15)',
                                zeroLineBorderDash: [3],
                                zeroLineBorderDashOffset: [2],
                            },
                        },
                    ],
                },
            },
        };
        let ctx = document.getElementById('bar-chart').getContext('2d');
        let chart = new Chart(ctx, config);
        window.myBar = chart;

        directives.subscribe(newStoreValue=> {
            let data = {};
            for (let i = 0; i < 30; i++) {
                let today = Dayjs();
                let day = today.subtract(i, 'day');
                data[day.format('YYYY-MM-DD')] = {day: day, label: day.format('MM-DD'), amount: new Big(0)};
            }

            for (let [day, dayTransactions] of $directives.entries) {
                let targetDay = data[day];
                if (targetDay !== undefined) {
                    for (let it of dayTransactions) {
                        for (let line of it.lines) {
                            const accountId = line.account;
                            const type = $accounts[accountId]?.full_name.split(':')[0];
                            const cost = new Big(line.cost[0]);
                            switch (type) {
                                case 'Income':
                                    targetDay.amount = targetDay.amount.sub(cost);
                                    break;
                                case 'Expenses':
                                    targetDay.amount = targetDay.amount.sub(cost);
                                    break;
                                case 'Liabilities':
                                    targetDay.amount = targetDay.amount.sub(cost);
                                    break;
                                case 'Equity':
                                    break;
                                case 'Assets':
                                    // targetDay.amount = targetDay.amount.sub(cost);
                                    break;
                            }
                        }
                    }
                }
            }

            let labels = Object.values(data).sort((a, b) => a.day - b.day).map(it => it.label);
            let updatedDataset = Object.values(data).sort((a, b) => a.day - b.day).map(it => it.amount);
            chart.data.labels = labels;
            chart.data.datasets.forEach((dataset)=> {
                dataset.data = updatedDataset;
            })
            chart.update();
        })


    });
</script>

<div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
    <div class="p-4 flex-auto">
        <div class="relative h-350-px">
            <canvas id="bar-chart"></canvas>
        </div>
    </div>
</div>
