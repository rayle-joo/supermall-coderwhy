<template>
  <nav-bar>
    <div slot="left" class="left" @click="backClick">
      <img src="~assets/img/common/back.svg" alt="" />
    </div>
    <div slot="center" class="title">
      <div
        v-for="(item, index) in titles"
        class="title-item"
        :class="{ active: index === currentIndex }"
        @click="itemClick(index)"
        :key="item"
      >
        {{ item }}
      </div>
    </div>
  </nav-bar>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
export default {
  name: "DetailNavBar",
  components: {
    NavBar,
  },
  data() {
    return {
      titles: ["商品", "参数", "评论", "推荐"],
      currentIndex: 0,
    };
  },
  props: {
    scrollIndex: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    itemClick(index) {
      if (this.currentIndex != index) {
        this.currentIndex = index;
      }
      this.$emit("titleClick", index);
    },
    backClick() {
      this.$router.back();
    },
  },
  watch: {
    scrollIndex(newIndex) {
      this.currentIndex = newIndex;
    },
  },
};
</script>

<style scoped>
.title {
  display: flex;
  font-size: 13px;
}
.title-item {
  flex: 1;
}
.active {
  color: var(--color-high-text);
}
.left img {
  vertical-align: middle;
}
</style>