<template>
  <div class="category-menu">
    <ul class="menu" v-for="(item, index) in detailMenu" :key="index">
      <li
        class="menu-item"
        :class="{ active: index === currentIndex }"
        @click="itemClick(index)"
      >
        {{ item.title }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "CategoryMenu",
  data() {
    return {
      currentIndex: 0,
    };
  },
  methods: {
    itemClick(index) {
      this.currentIndex = index;
      this.$emit("menuClick", index);
    },
  },
  props: {
    detailMenu: {
      type: Array,
      default() {
        return [];
      },
    },
  },
};
</script>

<style scoped>
.category-menu {
  width: 80px;
  background-color: #f6f6f6;
  font-size: 14px;
}
.menu {
  width: 100%;
  text-align: center;
}
.menu-item {
  height: 45px;
  line-height: 45px;
  border-left: 3px transparent solid;
}
.active {
  border-left: 3px var(--color-high-text) solid;
  font-weight: 700;
  background-color: #fff;
}
</style>