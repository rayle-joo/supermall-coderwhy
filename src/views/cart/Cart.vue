<template>
  <div class="cart">
    <nav-bar class="cart-nav-bar">
      <div slot="center">
        <span>购物车 ({{ cartLength }})</span>
      </div>
    </nav-bar>

    <!-- 商品列表 -->
    <cart-list></cart-list>
    <!-- 底部 -->
    <cart-bottom-bar />
  </div>
</template>

<script>
import NavBar from "components/common//navbar/NavBar";

import CartList from "./childComps/CartList.vue";
import CartBottomBar from "./childComps/CartBottomBar.vue";

import { mapGetters } from "vuex";
export default {
  name: "Cart",
  components: {
    NavBar,
    CartList,
    CartBottomBar,
  },
  computed: {
    ...mapGetters(["cartLength", "cartList"]),
    /* 
    或者内部传一个对象，来自己定义名称
    ...mapGetters(
      { length: "cartLength", list: "cartList" ...}
      ), */
  },
};
NavBar;
</script>

<style scoped>
.cart {
  height: 100vh;
  width: 100vw;
  padding-bottom: 49px;
}
.cart-nav-bar {
  background-color: var(--color-tint);
  color: #fff;
}
</style>