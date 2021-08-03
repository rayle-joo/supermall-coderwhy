// 封装了一个回到顶部的按钮
<template>
  <div class="back-top">
    <img src="~assets/img/common/top.png" alt="" />
  </div>
</template>

<script>
export default {
  name: "BackTop",
};
</script>

<style scoped>
.back-top {
  position: fixed;
  bottom: 49px;
  right: 15px;
}
.back-top img {
  width: 43px;
}
</style>