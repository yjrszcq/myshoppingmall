// createRouter：创建router实例对象
// createWebHistory：创建history模式的路由

import { createRouter, createWebHistory } from "vue-router";
import Layout from "@/views/layout/index.vue";
import Login from "@/views/login/customer.vue";
import Home from "@/views/Home/home.vue";
import Business from "@/views/Business/index.vue";
import Order from "@/views/Business/components/order.vue";
import Product from "@/views/Business/components/product.vue";
import businesshome from "@/views/Business/components/Home.vue";
import Detail from "@/views/Detail/index.vue";
import Search from "@/views/Home/components/HomeSearch.vue";
import Businesslogin from "@/views/login/business.vue";
import Cart from "@/views/Cart/index.vue";
import Checkout from "@/views/Checkout/index.vue";
import Member from "@/views/Member/index.vue";
import UserOrder from "@/views/Member/Components/UserOrder.vue";
import UserInfo from "@/views/Member/Components/UserInfo.vue";
import Payment from "@/views/Payment/index.vue"
import BankInfo from "@/views/BankInfo/index.vue"
import Address from "@/views/Member/Components/address.vue"
import Collection from "@/views/Member/Components/collection.vue"
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: Layout,
      children: [
        {
          path: "",
          component: Home,
        },
        {
          path: "detail/:id",
          component: Detail,
        },
        {
          path: "search",
          component: Search,
        },
        {
          path: "cart",
          component: Cart,
        },
        {
          path: "checkout",
          component: Checkout,
        },
        {
          path: "payment",
          component: Payment,
        },
        {
          path: "bank-info",
          component: BankInfo,
        },
        // 会员中心
        {
          name: "member",
          path: "member",
          component: Member,
          children: [
            {
              path: "",
              component: UserInfo,
            },
            {
              path: "order",
              component: UserOrder,
            },
            {
              path: "address",
              component: Address,
            },
            {
              path: "collection", // 小写统一风格
              component: Collection,
            },
          ],
        },
      ],
    },
    {
      path: "/login",
      component: Login,
    },
    {
      path: "/loginbusiness",
      component: Businesslogin,
    },
    {
      path: "/business",
      component: Business,
      children: [
        {
          path: "",
          component: businesshome,
        },
        {
          path: "product", // 改为相对路径
          component: Product,
        },
        {
          path: "order",
          component: Order,
        },
        {
          path: "dashboard",
          name: "Dashboard",
          component: () => import("@/views/Dashboard/index.vue"),
        },
      ],
    },
  ],
});

export default router;
