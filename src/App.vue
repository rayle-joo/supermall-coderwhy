<template>
  <div id="app">
    <keep-alive exclude="Detail">
      <router-view></router-view>
    </keep-alive>
    <main-tab-bar v-if="!isDetail"></main-tab-bar>
  </div>
</template>
<script>
import MainTabBar from "components/content/mainTabbar/MainTabBar.vue";
export default {
  name: "App",
  components: {
    MainTabBar,
  },
  data() {
    return {
      isDetail: false,
    };
  },
  updated() {
    if (this.$route.path.indexOf("/detail") !== -1) {
      this.isDetail = true;
    } else {
      this.isDetail = false;
    }
  },
};
</script>

<style scoped>
@import "assets/css/base.css";
.main-tab-bar {
  z-index: 9999;
}
</style>
