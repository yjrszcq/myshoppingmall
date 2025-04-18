<template>
  <div ref="pieChartRef" style="height: 400px"></div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import * as echarts from "echarts";

const props = defineProps(["data"]);

const pieChartRef = ref(null);

const initCharts = () => {
  // Pie Chart
  const pieChart = echarts.init(pieChartRef.value);
  const pieOption = {
    color: ["#FFC0CB", "#FFB6C1", "#FFDAB9", "#F08080", "#DB7093"], 
    title: {
      text: "totalOrders",
    },
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "vertical",
      left: "left",
      top: "15%",
    },
    series: [
      {
        type: "pie",
        radius:  ['25%', '60%'],
        avoidLabelOverlap: false,
        center: ['60%', '50%'], 
        data: props.data,
        label: {
        show: false,
        left: "90%",
        
      },
        emphasis: {
          label: {
          show: true,
          fontSize: 20,
          fontWeight: 'bold'
        }
        },
      },
    ],
  };
  pieChart.setOption(pieOption);
};

watch(
  () => props.data,
  () => {
    initCharts();
  }
);

onMounted(() => {
  initCharts();
  const pieChart = echarts.getInstanceByDom(pieChartRef.value);
  pieChart?.resize();
});
</script>

<style scoped lang="scss"></style>
