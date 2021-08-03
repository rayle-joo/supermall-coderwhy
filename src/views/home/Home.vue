<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <!-- 这里向子组件 Scroll传入一个probeType的值，来决定是否开启实时监听，否则浪费性能 -->
    <tab-control
      :titles="['流行', '新款', '精选']"
      @tabClick="tabClick"
      ref="tabControl1"
      class="tab-control"
      v-show="isTabControlShow"
    />
    <scroll
      class="content"
      ref="scroll"
      :probeType="3"
      @scroll="contentScroll"
      :pullUpLoad="true"
      @pullingUp="loadMore"
    >
      <home-swiper
        :cBanners="banners"
        @swiperImgLoad="swiperImgLoad"
      ></home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view />
      <tab-control
        :titles="['流行', '新款', '精选']"
        @tabClick="tabClick"
        ref="tabControl2"
      />
      <goods-list :goods="showGoods" />
    </scroll>
    <!-- click.native可以监听组件根元素的点击 -->
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import TabControl from "components/content/tabControl/TabControl";
import GoodsList from "components/content/goods/GoodsList";
import Scroll from "components/common/scroll/Scroll";
import BackTop from "components/content/backTop/BackTop";

import HomeSwiper from "./childComps/HomeSwiper.vue";
import RecommendView from "./childComps/RecommendView.vue";
import FeatureView from "./childComps/FeatureView.vue";

import { getHomeMultidata, getHomeGoods } from "network/home";

import { debounce } from "@/common/utils";

export default {
  name: "Home",
  components: {
    NavBar,
    HomeSwiper,
    RecommendView,
    FeatureView,
    TabControl,
    GoodsList,
    Scroll,
    BackTop,
  },
  data() {
    return {
      banners: null,
      recommends: null,
      goods: {
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] },
      },
      currentType: "pop",
      isShowBackTop: false,
      tabOffsetTop: 0,
      isTabControlShow: false,
      saveY: 0,
    };
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list;
    },
  },
  created() {
    this.getHmMultidata();
    this.getHmGoods("pop");
    this.getHmGoods("new");
    this.getHmGoods("sell");
  },
  mounted() {
    const refresh = debounce(this.$refs.scroll.refresh, 50);
    // 这里是事件总线用于监听图片加载，来设置scroll的刷新，放在mounted中别放created中
    this.$bus.$on("itemImageLoad", () => {
      refresh();
    });
  },
  activated() {
    this.$refs.scroll.refresh();
    this.$refs.scroll.scrollTo(0, this.saveY, 0);
  },
  deactivated() {
    this.saveY = this.$refs.scroll.scroll.y;
  },
  // updated() {
  //   // 所有的组件都有一个$el表示组件中的元素，元素是有一个offsetTop属性的
  //   console.log(this.$refs.tabControl.$el.offsetTop);
  //   this.tabOffsetTop = this.$refs.tabControl.$el.offsetTop;
  // },
  methods: {
    // 事件监听相关
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = "pop";
          break;
        case 1:
          this.currentType = "new";
          break;
        case 2:
          this.currentType = "sell";
          break;
      }
      this.$refs.tabControl1.currentIndex = index;
      this.$refs.tabControl2.currentIndex = index;
    },
    backClick() {
      // this.$refs.scroll.scroll.scrollTo(0, 0, 500); //  访问scroll子组件的scroll对象，调用其scrollTo方法
      this.$refs.scroll.scrollTo(0, 0, 500); //  为了使用方便，在scroll子组件中封装了一个scroll的methods
    },
    contentScroll(position) {
      // 1.判断BackTop是否显示
      if (position.y < -900) {
        this.isShowBackTop = true;
      } else {
        this.isShowBackTop = false;
      }

      // 2.决定tabControl是否吸顶
      this.isTabControlShow = -position.y > this.tabOffsetTop;
    },
    loadMore() {
      this.getHmGoods(this.currentType);
    },

    swiperImgLoad() {
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
    },

    // 网络请求相关
    getHmMultidata() {
      // 1.请求多个数据,轮播图相关
      getHomeMultidata().then((res) => {
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      });
    },
    getHmGoods(type) {
      const page = this.goods[type].page + 1;
      getHomeGoods(type, page).then((res) => {
        this.goods[type].list.push(...res.data.list);
        this.goods[type].page += 1;

        // 完成上拉后关闭上次的上拉加载更多
        this.$refs.scroll.finishPullingUp();
      });
    },
  },
};
</script>

<style scoped>
#home {
  /* padding-top: 44px; */
  height: 100vh;
  padding-bottom: 49px;
}
.home-nav {
  background-color: var(--color-tint);
  color: #fff;
}
.content {
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
  overflow: hidden;
}
.tab-control {
  position: relative;
  z-index: 99;
}
</style>