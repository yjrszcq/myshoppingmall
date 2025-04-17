<script setup lang="ts">
import Line from "./components/line.vue";
import pic from "./components/pie.vue";
import Column from "./components/column.vue";
import { ref, onMounted, computed } from "vue";
import * as echarts from "echarts";
import { getSalesTrendData } from "@/apis/dashboard";

const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth() + 1);
const years = ref([...Array(5)].map((_, i) => currentYear.value - i));
const months = ref([...Array(12)].map((_, i) => i + 1));

// Mock data
const tableData = ref([
  {
    date: "2024-03-01",
    sales: 2530,
    orders: 156,
    customers: 98,
  },
  {
    date: "2024-03-02",
    sales: 3250,
    orders: 187,
    customers: 120,
  },
  {
    date: "2024-03-03",
    sales: 2890,
    orders: 167,
    customers: 105,
  },
]);

const handleSearch = () => {
  // Here you would typically make an API call with the selected year and month
  console.log(
    `Searching for data in ${currentYear.value}-${currentMonth.value}`
  );
};

const getData = async ({ year, month }) => {
  const res = await getSalesTrendData({
    year,
    month,
  });
  // console.log(res);
  return res;
};

/**获取当月及过去12个月 */
function getPastYearMonthsIncludingCurrent() {
  const months = [];
  const date = new Date();
  let currentDate = new Date(date.getFullYear(), date.getMonth(), 1); // 从当前月份开始

  for (let i = 0; i < 12; i++) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    months.push({
      year,
      month,
    });
    currentDate.setMonth(currentDate.getMonth() - 1);
  }

  return months.reverse();
}

const dataList = ref([]);

const getDataList = async () => {
  const List = getPastYearMonthsIncludingCurrent();

  for (let key of List) {
    const res = await getData(key);
    // console.log(res);
    dataList.value.push(res);
    console.log(dataList.value);
  }
};
getDataList();

const ChartData = computed(() => {
  const arr = {
    line: {
      xData: [],
      yData: [],
    },
    pic: [],
    column: {
      xData: [],
      yData: [],
    },
  };

  dataList.value.forEach((item, idx) => {
    arr.line.xData.push(item.period);
    arr.line.yData.push(item.summary.totalSales);

    arr.pic.push({
      value: item.summary.totalOrders,
      name: item.period,
    });

    arr.column.xData.push(item.period);
    arr.column.yData.push(item.summary.avgRating);
  });

  return arr;
});

console.log("ChartData", ChartData.value);
</script>

<template>
  <div class="dashboard">
    <div class="charts-container">
      <el-card class="chart-card">
        <Line :data="ChartData.line" />
      </el-card>
      <el-card class="chart-card">
        <pic :data="ChartData.pic" />
      </el-card>
      <el-card class="chart-card">
        <Column :data="ChartData.column" />
      </el-card>
    </div>

    <el-card class="table-section">
      <el-table :data="dataList" style="width: 100%">
        <el-table-column prop="reportId" label="report Id" />
        <el-table-column prop="period" label="period" />
        <el-table-column prop="summary.totalSales" label="totalSales" />
        <el-table-column prop="summary.totalOrders" label="totalOrders" />
        <el-table-column prop="summary.avgRating" label="avgRating" />
        <el-table-column prop="summary.topProduct.name" label="topProduct" />
      </el-table>
    </el-card>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 20px;
}

.filter-section {
  margin-bottom: 20px;
}

.filters {
  display: flex;
  gap: 16px;
}

.charts-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.chart-card {
  min-height: 450px;
}

.table-section {
  margin-top: 20px;
}
</style>
