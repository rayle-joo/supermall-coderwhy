<template>
  <div class="toast" v-show="isShow">
    <div>{{ message }}</div>
  </div>
</template>

<script>
export default {
  name: "Toast",
  props: {
    // message: {
    //   type: String,
    //   default: "",
    // },
    // isShow: {
    //   type: Boolean,
    //   default: false,
    // },
  },
  data() {
    return {
      message: "",
      isShow: false,
      // 这里定义了一个定时器，这样就不会启动多个定时器，方便停止和启动
      timer: null,
    };
  },
  methods: {
    show(message, duration) {
      this.isShow = true;
      this.message = message;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.isShow = false;
        this.message = "";
      }, duration);
    },
  },
};
</script>

<style scoped>
.toast {
  position: fixed;
  z-index: 99999;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.65);
  padding: 5px 10px;
  border-radius: 5px;
  text-align: center;
  color: #fff;
}
</style>