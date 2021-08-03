<template>
  <div class="tab-bar-item" @click="itemClick">
    <div v-if="!isActive"><slot name="item-icon"></slot></div>
    <div v-else><slot name="item-icon-active"></slot></div>
    <!-- 下面这个slot会被替换掉，所以得放在div中 并在div中设置 :class -->
    <!-- <div :class="{ active: isActive }"><slot name="item-text"></slot></div> -->
    <div :style="activeStyle"><slot name="item-text"></slot></div>
  </div>
</template>

<script>
export default {
  name: "TabBarItem",
  data() {
    return {
      // isActive: false, //  不能写死，写死了之后就全红了
    };
  },

  props: {
    path: String,
    activeColor: {
      type: String,
      default: "red",
    },
  },
  computed: {
    isActive() {
      // return this.$route.path == this.path;
      return this.$route.path.indexOf(this.path) !== -1; // 等于 -1 表示字符串中不包含（）中的，否则不等于 -1
    },
    activeStyle() {
      return this.isActive ? { color: this.activeColor } : {};
    },
  },
  methods: {
    itemClick() {
      if (this.$route.path != this.path) {
        this.$router.replace(this.path);
      }
      // 也可以采用下面的写法
      // this.$router.replace(this.path).catch(err => err);
    },
  },
};
</script>

<style scoped>
.tab-bar-item {
  flex: 1;
  text-align: center;
  height: 49px;
  background-color: #f6f6f6;
  font-size: 14px;
}
.tab-bar-item img {
  width: 24px;
  height: 24px;
  margin-top: 3px;
  margin-bottom: 2px;
  vertical-align: top;
}
/* 为了更加彻底的封装，让别人可以传进来颜色，我们采用其他方法 */
/* .active {
  color: red;
} */
</style>