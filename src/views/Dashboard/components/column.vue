<template>
  <div ref="lineChartRef" style="height: 400px"></div>
</template>

<script setup>
import * as echarts from "echarts";
import { ref, onMounted, watch } from "vue";

const props = defineProps(["data"]);

const lineChartRef = ref(null);

const initCharts = () => {
  // Line Chart
  const lineChart = echarts.init(lineChartRef.value);
  const lineOption = {
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
  lineChart.setOption(lineOption);
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
    const lineChart = echarts.getInstanceByDom(lineChartRef.value);
    lineChart?.resize();
  });
});
</script>

<style scoped lang="scss"></style>
