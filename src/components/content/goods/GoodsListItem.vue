<template>
  <div class="goods-item" @click="itemClick">
    <!-- @load可以用于监听加载，原生的js中式image.onload -->
    <img v-lazy="showImage" alt="" @load="imageLoad" />
    <div class="goods-info">
      <p>{{ goodsItem.title }}</p>
      <span class="price">¥{{ goodsItem.price }}</span>
      <span class="collect">{{ goodsItem.cfav }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "GoodsListItem",
  props: {
    goodsItem: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  methods: {
    imageLoad() {
      if (this.$route.path.indexOf("/home") !== -1) {
        this.$bus.$emit("itemImageLoad");
      } else if (this.$route.path.indexOf("/detail") !== -1) {
        this.$bus.$emit("CommendImageLoad");
      }
    },
    itemClick() {
      // console.log("---");
      if (this.iid) {
        // 注意,这里由于老师的recommend的商品没有详情页的数据,因此这里推荐商品不跳转详情页
        this.$router.push("/detail/" + this.iid);
        // this.$router.replace("/detail/" + this.goodsItem.iid);
        // this.$router.push({
        //   path: "/detail",
        //   query: {
        //     id: this.goodsItem.iid,
        //   },
        // });
      }
    },
  },
  computed: {
    showImage() {
      if (this.goodsItem.show) {
        return this.goodsItem.show.img;
      } else {
        return this.goodsItem.image;
      }
    },
    iid() {
      if (this.goodsItem.iid) {
        return this.goodsItem.iid;
      }
    },
  },
};
</script>

<style scoped>
.goods-item {
  padding-bottom: 40px;
  position: relative;
  width: 48%;
}
.goods-item img {
  width: 100%;
  border-radius: 5px;
  vertical-align: top;
}

.goods-info {
  font-size: 12px;
  position: absolute;
  bottom: 5px;
  left: 0;
  right: 0;
  overflow: hidden;
  text-align: center;
}

.goods-info p {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 3px;
}

.goods-info .price {
  color: var(--color-high-text);
  margin-right: 20px;
}

.goods-info .collect {
  position: relative;
}

.goods-info .collect::before {
  content: "";
  position: absolute;
  left: -15px;
  top: 0;
  width: 14px;
  height: 14px;
  background: url("~assets/img/common/collect.svg") 0 0/14px 14px;
}
</style>