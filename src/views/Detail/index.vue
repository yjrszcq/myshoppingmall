<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getProductById } from "@/apis/detail.js"; // 用你的接口方法
import ImageView from "@/components/imageView/index.vue";
import { useCartStore } from "@/stores/cartStore";
//import { picture } from '@element-plus/icons-vue/dist/types'

const cartStore = useCartStore();


// 商品详情对象
const goods = ref({});

const updateQuantity = (itemId, quantity) => {
  cartStore.updateCartItemQuantity(itemId, quantity);
};

// 获取路由参数 id
const route = useRoute();

//count
const quantity = ref(1);
const countChange = (quantity) => {
  console.log(quantity);
};

//添加购物车
const addCart = () => {
  cartStore.addCart({
    itemId: goods.value.itemId,
    productId: goods.value.productId,
    name: goods.value.name,
    // picture: goods.value.mainPictures[0],
    price: goods.value.price,
    quantity: quantity.value,
    selected: true,
  });
};
// 获取商品详情数据
const getGoods = async () => {
  try {
    const res = await getProductById(route.params.id); // 这里调用封装的方法
    goods.value = res;
    console.log(goods.value);
  } catch (error) {
    console.error("Fetch store details failed", error);
  }
};

// 页面加载时发请求
onMounted(() => {
  getGoods();
});
</script>

<template>
  <div class="xtx-goods-page">
    <div class="container" v-if="goods">
      <div class="bread-container">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>

          <!--
            错误原因：goods一开始{}  {}.categories -> undefined  -> undefined[1]
            1. 可选链的语法?.
            2. v-if手动控制渲染时机 保证只有数据存在才渲染
           -->
          <!--          后端没给接口，可以作为后续补充-->
          <!--          <el-breadcrumb-item :to="{ path: `/category/${goods.categories[1].id}` }">{{ goods.categories[1].name }}-->
          <!--          </el-breadcrumb-item>-->
          <!--          <el-breadcrumb-item :to="{ path: `/category/sub/${goods.categories[0].id}` }">{{-->
          <!--              goods.categories[0].name-->
          <!--            }}-->
          <!--          </el-breadcrumb-item>-->
          <el-breadcrumb-item>{{ goods.name }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 商品信息 -->
      <div class="info-container">
        <div>
          <div class="goods-info">
            <div class="media">
              <!-- 图片预览区 -->
              <ImageView />
              <!-- 统计数量 -->
              <!--              <ul class="goods-sales">-->
              <!--                <li>-->
              <!--                  <p>销量人气</p>-->
              <!--                  <p> {{ goods.salesCount }}+ </p>-->
              <!--                  <p><i class="iconfont icon-task-filling"></i>销量人气</p>-->
              <!--                </li>-->
              <!--                <li>-->
              <!--                  <p>商品评价</p>-->
              <!--                  <p>{{ goods.commentCount }}+</p>-->
              <!--                  <p><i class="iconfont icon-comment-filling"></i>查看评价</p>-->
              <!--                </li>-->
              <!--                <li>-->
              <!--                  <p>收藏人气</p>-->
              <!--                  <p>{{ goods.collectCount }}+</p>-->
              <!--                  <p><i class="iconfont icon-favorite-filling"></i>收藏商品</p>-->
              <!--                </li>-->
              <!--                <li>-->
              <!--                  <p>品牌信息</p>-->
              <!--                  <p>{{ goods.brand.name }}</p>-->
              <!--                  <p><i class="iconfont icon-dynamic-filling"></i>品牌主页</p>-->
              <!--                </li>-->
              <!--              </ul>-->
            </div>
            <div class="spec">
              <!-- 商品信息区 -->
              <p class="g-name">{{ goods.name }}</p>
              <p class="g-desc">{{ goods.desc }}</p>
              <p class="g-price">
                <span>{{ goods.price }}</span>
                <span> {{ goods.stock }}</span>
              </p>
              <div class="g-service">
                <dl>
                  <dt>sales</dt>
                  <dd>
                    good things were broadcast, the App coupon purchase 120 yuan
                    dropped
                  </dd>
                </dl>
                <dl>
                  <dt>serve</dt>
                  <dd>
                    <span>Hassle-free returns</span>
                    <span>Fast refunds</span>
                    <span>Free shipping</span>
                    <a href="javascript:;">Learn more</a>
                  </dd>
                </dl>
              </div>
              <!-- sku组件 -->

              <!-- 数据组件 -->
              <el-input-number
                v-model="quantity"
                :min="1"
               
                class="number"
              />
              <!-- 按钮组件 -->
              <div>
                <el-button size="large" class="btn" @click="addCart">
                  Add to cart
                </el-button>
              </div>
            </div>
          </div>
          <!--          后端没给接口，可作为后续版本添加-->

          <!--          <div class="goods-footer">-->
          <!--&lt;!&ndash;            <div class="goods-article">&ndash;&gt;-->
          <!--&lt;!&ndash;              &lt;!&ndash; 商品详情 &ndash;&gt;&ndash;&gt;-->
          <!--&lt;!&ndash;              <div class="goods-tabs">&ndash;&gt;-->
          <!--&lt;!&ndash;                <nav>&ndash;&gt;-->
          <!--&lt;!&ndash;                  <a>商品详情</a>&ndash;&gt;-->
          <!--&lt;!&ndash;                </nav>&ndash;&gt;-->
          <!--&lt;!&ndash;                <div class="goods-detail">&ndash;&gt;-->
          <!--&lt;!&ndash;                  &lt;!&ndash; 属性 &ndash;&gt;&ndash;&gt;-->
          <!--&lt;!&ndash;                  <ul class="attrs">&ndash;&gt;-->
          <!--&lt;!&ndash;                    <li v-for="item in goods.details.properties" :key="item.value">&ndash;&gt;-->
          <!--&lt;!&ndash;                      <span class="dt">{{ item.name }}</span>&ndash;&gt;-->
          <!--&lt;!&ndash;                      <span class="dd">{{ item.value }}</span>&ndash;&gt;-->
          <!--&lt;!&ndash;                    </li>&ndash;&gt;-->
          <!--&lt;!&ndash;                  </ul>&ndash;&gt;-->
          <!--&lt;!&ndash;                  &lt;!&ndash; 图片 &ndash;&gt;&ndash;&gt;-->
          <!--&lt;!&ndash;                  <img v-for="img in goods.details.pictures" :src="img" :key="img" alt="">&ndash;&gt;-->
          <!--&lt;!&ndash;                </div>&ndash;&gt;-->
          <!--&lt;!&ndash;              </div>&ndash;&gt;-->
          <!--&lt;!&ndash;            </div>&ndash;&gt;-->
          <!--            &lt;!&ndash; 24热榜+专题推荐 &ndash;&gt;-->
          <!--            <div class="goods-aside">-->

          <!--            </div>-->
          <!--          </div>-->
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.xtx-goods-page {
  .goods-info {
    min-height: 600px;
    background: #fff;
    display: flex;

    .media {
      width: 580px;
      height: 600px;
      padding: 30px 50px;
    }

    .spec {
      flex: 1;
      padding: 30px 30px 30px 0;
    }
  }

  .goods-footer {
    display: flex;
    margin-top: 20px;

    .goods-article {
      width: 940px;
      margin-right: 20px;
    }

    .goods-aside {
      width: 280px;
      min-height: 1000px;
    }
  }

  .goods-tabs {
    min-height: 600px;
    background: #fff;
  }

  .goods-warn {
    min-height: 600px;
    background: #fff;
    margin-top: 20px;
  }

  .number-box {
    display: flex;
    align-items: center;

    .label {
      width: 60px;
      color: #999;
      padding-left: 10px;
    }
  }

  .g-name {
    font-size: 22px;
  }

  .g-desc {
    color: #999;
    margin-top: 10px;
  }

  .g-price {
    margin-top: 10px;

    span {
      &:first-child {
        &::before {
          content: "¥";
          font-size: 14px;
        }
        color: $priceColor;
        margin-right: 10px;
        font-size: 22px;
      }

      &:last-child {
        &::before {
          content: "库存仅剩：";
        }
        color: #999;
        font-size: 16px;
      }
    }
  }

  .g-service {
    background: #f5f5f5;
    width: 500px;
    padding: 20px 10px 0 10px;
    margin-top: 10px;

    dl {
      padding-bottom: 20px;
      display: flex;
      align-items: center;

      dt {
        width: 50px;
        color: #999;
      }

      dd {
        color: #666;

        &:last-child {
          span {
            margin-right: 10px;

            &::before {
              content: "•";
              color: $xtxColor;
              margin-right: 2px;
            }
          }

          a {
            color: $xtxColor;
          }
        }
      }
    }
  }

  .goods-sales {
    display: flex;
    width: 400px;
    align-items: center;
    text-align: center;
    height: 140px;

    li {
      flex: 1;
      position: relative;

      ~ li::after {
        position: absolute;
        top: 10px;
        left: 0;
        height: 60px;
        border-left: 1px solid #e4e4e4;
        content: "";
      }

      p {
        &:first-child {
          color: #999;
        }

        &:nth-child(2) {
          color: $priceColor;
          margin-top: 10px;
        }

        &:last-child {
          color: #666;
          margin-top: 10px;

          i {
            color: $xtxColor;
            font-size: 14px;
            margin-right: 2px;
          }

          &:hover {
            color: $xtxColor;
            cursor: pointer;
          }
        }
      }
    }
  }
}

.goods-tabs {
  min-height: 600px;
  background: #fff;

  nav {
    height: 70px;
    line-height: 70px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;

    a {
      padding: 0 40px;
      font-size: 18px;
      position: relative;

      > span {
        color: $priceColor;
        font-size: 16px;
        margin-left: 10px;
      }
    }
  }
}

.goods-detail {
  padding: 40px;

  .attrs {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 30px;

    li {
      display: flex;
      margin-bottom: 10px;
      width: 50%;

      .dt {
        width: 100px;
        color: #999;
      }

      .dd {
        flex: 1;
        color: #666;
      }
    }
  }

  > img {
    width: 100%;
  }
}

.btn {
  margin-top: 20px;
}

.number {
  margin-top: 15px;
}

.bread-container {
  padding: 25px 0;
}
</style>
