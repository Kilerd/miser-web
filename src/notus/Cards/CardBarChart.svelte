<script>
  import { onMount } from "svelte";
  // library that creates chart objects in page
  import Chart from "chart.js";

  // init chart
  onMount(async () => {
    let config = {
      type: "bar",
      data: {
        labels: [
          "2020-12-31",
          "2020-12-21",
          "2020-12-20",
          "2020-12-12",
          "2020-12-11",
          "2020-12-10",
          "2020-12-30",
          "2020-12-30",
          "2020-12-30",
          "2020-12-30",
          "2020-12-30",
          "2020-12-30",
          "2020-12-30",
          "2020-12-30",
          "2020-12-30",
          "2020-12-30",
          "2020-12-30",
          "2020-12-30",
          "2020-12-30",
          "2020-12-30",
          "2020-12-30",
          "2020-12-30",
          "2020-12-30",
          "2020-12-30",
          "2020-12-30",
          "2020-12-30",
          "2020-12-30",
        ],
        datasets: [
          {
            label: new Date().getFullYear(),
            backgroundColor: "#ed64a6",
            borderColor: "#ed64a6",
            data: [30.2, 78, 56, 34, 100, 10000, 13.0, 13.0, 13.0, 13.0, 13.0, 13.0, 13.0, 13.0, 13.0, 13.0, 13.0, 13.0, 13.0, 13.0, 13.0, 13.0, 13.0, 13.0, 13.0, 13.0, 13.0],
            fill: false,
            barThickness: 8
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        title: {
          display: true,
          text: "Orders Chart",
        },
        tooltips: {
          mode: "index",
          intersect: false,
        },
        hover: {
          mode: "nearest",
          intersect: true,
        },
        legend: {
          labels: {
            fontColor: "rgba(0,0,0,.4)",
          },
          align: "end",
          position: "bottom",
        },
        scales: {
          xAxes: [
            {
              display: true,
              scaleLabel: {
                display: false,
                labelString: "Month",
              },
              gridLines: {
                borderDash: [2],
                borderDashOffset: [0],
                color: "rgba(33, 37, 41, 0.3)",
                zeroLineColor: "rgba(33, 37, 41, 0.3)",
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
                labelString: "Value",
              },
              gridLines: {
                borderDash: [2],
                drawBorder: false,
                borderDashOffset: [2],
                color: "rgba(33, 37, 41, 0.2)",
                zeroLineColor: "rgba(33, 37, 41, 0.15)",
                zeroLineBorderDash: [2],
                zeroLineBorderDashOffset: [2],
              },
            },
          ],
        },
      },
    };
    let ctx = document.getElementById("bar-chart").getContext("2d");
    window.myBar = new Chart(ctx, config);
  });
</script>

<div
  class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded"
>
  <div class="p-4 flex-auto">
    <div class="relative h-350-px">
      <canvas id="bar-chart"></canvas>
    </div>
  </div>
</div>
