<template>
  <div ref="columnChartRef" style="height: 400px"></div>
</template>

<script setup>
import * as echarts from "echarts";
import { ref, onMounted, watch } from "vue";

const props = defineProps(["data"]);

const columnChartRef = ref(null);

const initCharts = () => {
  // Line Chart
  const columnChart = echarts.init(columnChartRef.value);
  const columnOption = {
    color: ["#F688AD"],
    title: {
      text: "avgRating",
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: props.data.xData,
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: props.data.yData,
        type: "bar",
        smooth: true,
      },
    ],
  };
  columnChart.setOption(columnOption);
};



watch(
  () => props.data,
  () => {
    initCharts();
  }
);

onMounted(() => {
  initCharts();
  window.addEventListener("resize", () => {
    const columnChart = echarts.getInstanceByDom(columnChartRef.value);
    columnChart?.resize();
  });
});
</script>

<style scoped lang="scss"></style>
