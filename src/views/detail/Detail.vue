<template>
  <div id="detail">
    <detail-nav-bar
      class="detail-nav"
      @titleClick="navBarTitleClick"
      :scrollIndex="currentIndex"
    ></detail-nav-bar>
    <scroll
      class="content"
      ref="detailScroll"
      :probeType="3"
      @scroll="detailScroll"
    >
      <detail-swiper :topImages="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info
        :detailInfo="detailInfo"
        @detailImgLoad="detailImgLoad"
      ></detail-goods-info>
      <detail-param-info
        :paramInfo="paramInfo"
        ref="params"
      ></detail-param-info>
      <detail-comment-info :commentInfo="commentInfo" ref="comment" />
      <goods-list :goods="recommend" ref="recommend" />
    </scroll>
    <detail-bottom-bar @addCart="addToCart" />

    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
    <toast :message="toastMessage" :isShow="toastShow" />
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar.vue";
import DetailSwiper from "./childComps/DetailSwiper.vue";
import DetailBaseInfo from "./childComps/DetailBaseInfo.vue";
import DetailShopInfo from "./childComps/DetailShopInfo.vue";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo.vue";
import DetailParamInfo from "./childComps/DetailParamInfo.vue";
import DetailCommentInfo from "./childComps/DetailCommentInfo.vue";
import DetailBottomBar from "./childComps/DetailBottomBar.vue";

import GoodsList from "components/content/goods/GoodsList.vue";
import BackTop from "components/content/backTop/BackTop";
import Toast from "components/common/toast/Toast";

import {
  getDetail,
  Goods,
  Shop,
  GoodsParam,
  getRecommend,
} from "network/detail";
import { CartGoods } from "network/cart";
import { debounce } from "@/common/utils";
import { mapActions } from "vuex";

import Scroll from "components/common/scroll/Scroll";

export default {
  name: "Detail",
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommend: [],
      detailRefresh: null,
      themTopYs: [],
      getRealTopYs: null,
      currentIndex: 0,
      isShowBackTop: false,
      itemInfo: {},
      toastMessage: "",
      toastShow: false,
      timer: null,
    };
  },
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    Scroll,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    GoodsList,
    DetailBottomBar,
    DetailBottomBar,
    BackTop,
    Toast,
  },
  methods: {
    ...mapActions(["addCart"]),
    detailImgLoad() {
      this.detailRefresh();
      this.getRealTopYs();
    },
    navBarTitleClick(index) {
      this.$refs.detailScroll.scrollTo(0, -this.themTopYs[index], 500);
    },
    getTopYs() {
      this.themTopYs = [];
      if (this.$refs.params && this.$refs.comment && this.$refs.recommend)
        this.themTopYs.push(
          0,
          this.$refs.params.$el.offsetTop,
          this.$refs.comment.$el.offsetTop,
          this.$refs.recommend.$el.offsetTop
        );
      // console.log(this.themTopYs);
    },
    detailScroll(position) {
      const Y = -position.y;
      const length = this.themTopYs.length;
      for (let i = 0; i < length; i++) {
        if (
          (Y < this.themTopYs[i + 1] && i === 0) ||
          (Y >= this.themTopYs[i] &&
            Y < this.themTopYs[i + 1] &&
            i > 0 &&
            i < length) ||
          (Y > this.themTopYs[i] && i === length - 1)
        ) {
          this.currentIndex = i;
        }
      }

      // 1.判断BackTop是否显示
      if (position.y < -900) {
        this.isShowBackTop = true;
      } else {
        this.isShowBackTop = false;
      }
    },

    backClick() {
      this.$refs.detailScroll.scrollTo(0, 0, 500);
    },
    addToCart() {
      const product = new CartGoods(this.itemInfo);
      // this.$store.dispatch("addCart", product);

      // 由于通过mapActions将store中的方法映射了过来，因此可以直接调用改方法
      //  这是普通方法使用toast，若想要看以插件形式封装的toast使用，看Cart中相关的
      this.addCart(product).then((res) => {
        this.toastMessage = res;
        this.$toast.show(res, 1000);
      });
    },
  },
  mounted() {
    this.detailRefresh = debounce(this.$refs.detailScroll.refresh, 50);
    this.getRealTopYs = debounce(this.getTopYs, 50);
    this;
    this.$bus.$on("CommendImageLoad", () => {
      this.detailRefresh();
      this.getRealTopYs();
    });
  },
  created() {
    // 保存传入的iid数据
    this.iid = this.$route.params.iid;
    // 发送网络请求请求详情页数据
    getDetail(this.iid).then((res) => {
      // console.log(res);
      const data = res.result;
      // 顶部图片轮播数据
      this.topImages = data.itemInfo.topImages;

      // 取出并整合需要使用的数据
      this.goods = new Goods(
        data.itemInfo,
        data.columns,
        data.shopInfo.services
      );

      // 取出并整合店家信息
      this.shop = new Shop(data.shopInfo);

      // 图片详情相关信息
      this.detailInfo = data.detailInfo;

      // detailParam相关信息整合
      this.paramInfo = new GoodsParam(
        data.itemParams.info,
        data.itemParams.rule
      );

      // 取出评论信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0];
      }
      this.itemInfo = data.itemInfo;
    });

    getRecommend().then((res) => {
      this.recommend = res.data.list;
    });
  },
};
</script>

<style scoped>
#detail {
  position: relative;
  background-color: #fff;
  /* z-index: 9; */
  height: 100vh;
}
.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}
.content {
  /* 注意这里的calc()内部运算符左右一定要加空格，最好别用这个方法，感觉会有bug */
  /* height: calc(100vh - 44px); */
  position: absolute;
  left: 0;
  right: 0;
  top: 44px;
  bottom: 49px;
  overflow: hidden;
}
</style>