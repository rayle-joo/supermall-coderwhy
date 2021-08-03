// 这是控制栏

<template>
  <div class="tab-control">
    <div
      v-for="(item, index) in titles"
      class="tab-control-item"
      :class="{ active: index === currentIndex }"
      :key="item"
      @click="itemClick(index)"
    >
      <span>{{ item }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "TabControl",
  props: {
    titles: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      currentIndex: 0,
    };
  },
  methods: {
    itemClick(index) {
      if (this.currentIndex != index) {
        this.currentIndex = index;
        this.$emit("tabClick", index)
      }
    },
  },
};
</script>

<style scoped>
.tab-control {
  z-index: 99;
  display: flex;
  text-align: center;
  font-size: 15px;
  height: 40px;
  line-height: 40px;
  /* 引入better-scroll后，粘滞定位失效，采用其他方法来处理tab-control的吸顶问题 */
  /* position: sticky;
  top: 44px; */
}
.tab-control-item {
  flex: 1;
  background-color: #fff;
}
.tab-control-item span {
  padding: 3px;
}
.active {
  color: var(--color-high-text);
}
.active span {
  border-bottom: var(--color-high-text) 3px solid;
}
</style>