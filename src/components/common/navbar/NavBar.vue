<template>
  <div class="nav-bar">
    <div class="left"><slot name="left"></slot></div>
    <div class="center"><slot name="center"></slot></div>
    <div class="right"><slot name="right"></slot></div>
  </div>
</template>

<script>
export default {
  name: "NavBar",
};
</script>

<style scoped>
  .nav-bar{
    display: flex;
    height: 44px;
    line-height: 44px;
    font-weight: 700;
    text-align: center;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
  }
  .left, .right{
    width: 60px;
  }
  .center{
    flex: 1;
  }
</style>