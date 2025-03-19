// createRouter：创建router实例对象
// createWebHistory：创建history模式的路由

import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/views/layout/index.vue'
import Login from '@/views/login/customer.vue'
import Home from '@/views/Home/home.vue'
import Category  from "@/views/Category/category.vue";
import Business from "@/views/Business/index.vue"
import Order from "@/views/Business/components/order.vue"
import Product from "@/views/Business/components/product.vue";
import businesshome from "@/views/Business/components/Home.vue"
import Detail from "@/views/Detail/index.vue"
import Search from "@/views/Home/components/HomeSearch.vue";
import Businesslogin from "@/views/login/business.vue"

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    // path和component对应关系的位置
    routes: [
        {
            path: '/',
            component: Layout,
            children: [{
                path: '',
                component: Home,
            },
                {
                    path: 'category',
                    component: Category,
                },
                {
                    path:'detail/:id',
                    component: Detail,
                },
                {
                    path:'search',
                    component: Search,
                }
            ]
        },
        {
            path: '/login',
            component: Login,
        },
        {
            path: '/loginbusiness',
            component: Businesslogin,
        },
        {
            path: '/business',
            component: Business,
            children: [
                {
                    path: '',
                    component: businesshome,
                }
                ,{
                path: '/product',
                component: Product,
            },
                {
                    path: '/order',
                    component: Order,
                }
            ]
        }
    ]
})

export default router