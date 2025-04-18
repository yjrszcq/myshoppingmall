<script setup>
import Line from "./components/line.vue";
import pie from "./components/pie.vue";
import Column from "./components/column.vue";
import { ref, onMounted, computed } from "vue";
import * as echarts from "echarts";
import { getSalesTrendData } from "@/apis/dashboard";

const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth() + 1);

const value1 = ref(new Date());
const size = ref("large");

const handleSearch = () => {
  // console.log(getCurrentMonth(value1.value));
  
  getDataList(getCurrentMonth(value1.value));
};

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

const getData = async ({ year, month }) => {
  const res = await getSalesTrendData({
    year,
    month,
  });
  return res;
};


// 获取当前月份
const getCurrentMonth = (newDate = new Date()) => {
  const date = new Date(newDate);

  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
  };
};

const dataList = ref({});

const getDataList = async (CurrentMonth  = getCurrentMonth()) => {

  try {
    const res = await getData(CurrentMonth);
  
    const summaryData = {
      totalSales: res.summary.totalSales,
      totalOrders: res.summary.totalOrders,
      avgRating: res.summary.avgRating,
      topProductName: res.summary.topProduct.name,
    };

    // 将提取的数据构造成表格需要的格式
    const summaryTableData = [summaryData];
    dataList.value = { ...res, summaryTableData };

   // dataList.value = res;
    // console.log(dataList.value);
    console.log("==========>", res);
  } catch {
    console.log("error");
    getDataList();
    value1.value = new Date();
  }
};
getDataList();

const ChartData = computed(() => {
  const arr = {
    line: {
      xData: [],
      yData: [],
    },
    pie: [],
    column: {
      xData: [],
      yData: [],
    },
  };

  dataList.value.details?.forEach((item, idx) => {
    arr.line.xData.push(item.name);
    arr.line.yData.push(item.totalRevenue);

    arr.pie.push({
      value: item.salesCount,
      name: item.name,
    });

    arr.column.xData.push(item.name);
    arr.column.yData.push(item.avgRating);
  });
  console.log(arr);

  return arr;
});

// console.log("ChartData", ChartData.value);
</script>

<template>
  <div class="dashboard">
    <div class="Month">
      <el-date-picker
        v-model="value1"
        type="month"
        placeholder="Pick a day"
        :size="size"
        @change="handleSearch"
      />
    </div>

    <div class="charts-container">
      <el-card class="chart-card">
        <Line :data="ChartData.line" />
      </el-card>
      <el-card class="chart-card">
        <pie :data="ChartData.pie" />
      </el-card>
      <el-card class="chart-card">
        <Column :data="ChartData.column" />
     
      </el-card>
    </div>

    <el-card class="table-section1">
      <div class="table-title">SUMMARY</div>
      <el-table :data="dataList?.summaryTableData" style="width: 100%">
        <el-table-column prop="totalSales" label="totalSales" align="center"/>
        <el-table-column prop="totalOrders" label="totalOrders" align="center"/>
        <el-table-column prop="avgRating" label="avgRating" align="center"/>
        <el-table-column prop="topProductName" label="topProduct" align="center" />
       
      </el-table>
    </el-card>

    <el-card class="table-section">
      <div class="table-title">DETAILS</div>
      <el-table :data="dataList?.details" style="width: 100%">
        <el-table-column prop="productId" label="productId" align="center"/>
        <el-table-column prop="name" label="name" align="center"/>
        <el-table-column prop="salesCount" label="salesCount"align="center" />
        <el-table-column prop="totalRevenue" label="totalRevenue" align="center"/>
        <el-table-column
          prop="promotionEffect.promotionId"
          label="promotionEffect" align="center"
        />
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
  min-height: 400px;
}

.table-title {
  font-size: 18px;
  font-weight: bold;
  color: #000000;
  margin-bottom: 10px; 
  padding: 10px 0px;
}

.table-section1 {
  margin-top: 20px;
}

.table-section {
  margin-top: 20px;
}

.Month {
  margin-bottom: 15px;
  display: flex;
  justify-content: flex-end;
}
</style>
