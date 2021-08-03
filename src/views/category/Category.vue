<template>
  <div class="category">
    <!-- navbar -->
    <nav-bar class="nav-bar">
      <div slot="center"><span>商品分类</span></div>
    </nav-bar>
    <!-- 中间的内容区域 -->
    <div class="content">
      <scroll class="menu-left">
        <category-menu :detailMenu="categories" @menuClick="menuClick" />
      </scroll>
      <scroll
        class="content-right"
        ref="rightScroll"
        @scroll="contentScroll"
        :probeType="3"
      >
        <tab-content-category :showDetailCategory="showDetailCategory" />
        <tab-control
          :titles="['综合', '新款', '销量']"
          ref="tabControl"
          @tabClick="tabClick"
        />
        <goods-list :goods="showDetails" />
      </scroll>
    </div>
    <back-top @click.native="backTopClick" v-show="isBackTopShow"></back-top>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import GoodsList from "components/content/goods/GoodsList";
import TabControl from "components/content/tabControl/TabControl";
import BackTop from "components/content/backTop/BackTop";

import CategoryMenu from "./childComps/CategoryMenu.vue";
import TabContentCategory from "./childComps/TabContentCategory.vue";

import {
  getCategory,
  getSubcategory,
  getCategoryDetail,
} from "@/network/category";
import { debounce } from "@/common/utils";

export default {
  name: "Category",
  components: {
    NavBar,
    CategoryMenu,
    TabContentCategory,
    GoodsList,
    TabControl,
    BackTop,
  },
  data() {
    return {
      categories: [],
      categoryData: [],
      menuIndex: 0,
      rightRefresh: null,
      isBackTopShow: false,
    };
  },
  methods: {
    _getCategory() {
      getCategory().then((res) => {
        this.categories = res.data.category.list;
        for (let index in this.categories) {
          // console.log(index);
          this.categories[index].saveY = 0;
          this.categoryData[index] = {
            subcategories: [],
            categoryDetail: {
              currentTypeIndex: 0,
              pop: [],
              new: [],
              sell: [],
            },
          };
          this._getSubcategory(index);
        }

        // 请求下来第一页的pop，new，sell
        this._getCategoryDetail(0, "pop");
        this._getCategoryDetail(0, "new");
        this._getCategoryDetail(0, "sell");
      });
    },
    _getSubcategory(index) {
      getSubcategory(this.categories[index].maitKey).then((res) => {
        this.categoryData[index].subcategories = res.data.list;
      });
    },
    _getCategoryDetail(index, type) {
      getCategoryDetail(this.categories[index].miniWallkey, type).then(
        (res) => {
          this.categoryData[index].categoryDetail[type] = res;
          this.categoryData = { ...this.categoryData };
        }
      );
    },

    menuClick(index) {
      this._getCategoryDetail(index, "pop");
      this._getCategoryDetail(index, "new");
      this._getCategoryDetail(index, "sell");
      this.menuIndex = index;
      this.$refs.tabControl.currentIndex =
        this.categoryData[this.menuIndex].categoryDetail.currentTypeIndex;
      if (this.categories[this.menuIndex]) {
        this.$refs.rightScroll.refresh();
        this.$refs.rightScroll.scrollTo(
          0,
          this.categories[this.menuIndex].saveY,
          0
        );
      } else {
        this.$refs.rightScroll.refresh();
        this.$refs.rightScroll.scrollTo(0, 0, 0);
      }
    },
    tabClick(index) {
      this.categoryData[this.menuIndex].categoryDetail.currentTypeIndex = index;
    },
    backTopClick() {
      this.$refs.rightScroll.scrollTo(0, 0, 500);
    },
    contentScroll(position) {
      const Y = position.y;
      // 回到顶部相关判断
      if (Y < -900) {
        this.isBackTopShow = true;
      } else {
        this.isBackTopShow = false;
      }
      // 保留当前页面的浏览位置，有Bug图片会重新加载导致位置错乱，体验不太好
      if (this.categories[this.menuIndex]) {
        this.categories[this.menuIndex].saveY = Y;
      }
    },
  },
  computed: {
    currentTab() {
      if (!this.categoryData[this.menuIndex]) {
        return "";
      }
      switch (
        this.categoryData[this.menuIndex].categoryDetail.currentTypeIndex
      ) {
        case 0:
          return "pop";
        case 1:
          return "new";
        case 2:
          return "sell";
      }
    },
    showDetailCategory() {
      if (!this.categories[this.menuIndex]) {
        return [];
      }
      return this.categoryData[this.menuIndex].subcategories;
    },
    showDetails() {
      if (!this.categoryData[this.menuIndex]) {
        return [];
      }
      return this.categoryData[this.menuIndex].categoryDetail[this.currentTab];
    },
  },
  created() {
    this._getCategory();
  },
  mounted() {
    this.rightRefresh = debounce(this.$refs.rightScroll.refresh, 50);
    this.$bus.$on("categoryImgLoad", () => {
      this.rightRefresh();
    });
  },
};
</script>

<style scoped>
.category {
  width: 100vw;
  height: 100vh;
  position: relative;
}
.nav-bar {
  background-color: var(--color-tint);
  color: #fff;
}
.content {
  position: absolute;
  left: 0;
  right: 0;
  top: 44px;
  bottom: 49px;
  overflow: hidden;
  display: flex;
}

.menu-left {
  padding: 5px 0;
  height: 100%;
}
.content-right {
  height: 100%;
  margin: 5px;
  flex: 1;
}
</style>