<template>
  <div class="bottom-bar">
    <div class="check-icon">
      <check-button :isChecked="isAllChecked" @click.native="allCheckClick" />
    </div>

    <div class="check-text">
      <span>全选</span>
    </div>

    <div class="total-price">
      <span>合计：￥{{ totalPrice }}</span>
    </div>

    <div class="buy-product" @click="buyClick">
      <span>去结算({{ checkLength }})</span>
    </div>
  </div>
</template>

<script>
import CheckButton from "components/content/checkButton/CheckButton";

export default {
  name: "CartBottomBar",
  components: {
    CheckButton,
  },
  methods: {
    allCheckClick() {
      this.$store.dispatch("allCheckClick");
    },
    buyClick() {
      if (this.checkLength === 0) {
        this.$toast.show("没有选中商品！", 1000);
      } else {
        this.$toast.show("正在结算中，请稍后！", 1500);
      }
    },
  },
  computed: {
    totalPrice() {
      return this.$store.state.cartList
        .filter((item) => {
          return item.checked;
        })
        .reduce((preValue, item) => {
          return preValue + item.newPrice * item.count;
        }, 0);
    },
    checkLength() {
      return this.$store.state.cartList.filter((item) => {
        return item.checked;
      }).length;
    },
    isAllChecked() {
      /* 
      if (
        this.$store.state.cartList.filter((item) => {
          return !item.checked;
        }).length === 0

        //  如果没有被选中的组成的数组的长度为0，则返回true（表示全部选中），否则则没有全选
      ) {
        return true;
      } else {
        return false;
      }
       */

      // 简单写法，如果长度为0，取反为true，不为0的取反为false
      if (this.$store.state.cartList.length !== 0) {
        // return !this.$store.state.cartList.filter((item) => !item.checked).length;

        // 这个性能可能高点，如果找到一个没被checked的，则返回，没找到则对其结果取反为true，即全部选中
        return !this.$store.state.cartList.find((item) => !item.checked);
      } else {
        return false;
      }
    },
  },
};
</script>

<style scoped>
.bottom-bar {
  background-color: pink;
  height: 44px;
  width: 100%;
  box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 99;
  background-color: #eee;
  display: flex;
  align-items: center;
  line-height: 44px;
  font-size: 17px;
}
.check-icon {
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
}
.check-text {
  width: 18vw;
  color: #888;
  font-size: 14px;
}
.total-price {
  width: 40vw;
}
.buy-product {
  width: 30vw;
  text-align: center;
  color: #fff;
  background-color: orangered;
}
</style>