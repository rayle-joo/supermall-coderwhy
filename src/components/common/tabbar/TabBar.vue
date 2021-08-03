<template>
  <div id="tab-bar">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "TabBar",
};
</script>

<style scoped>
#tab-bar {
  display: flex;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.15);
}
</style>