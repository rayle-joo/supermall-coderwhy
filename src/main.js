import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import toast from 'components/common/toast/'
import FastClick from 'fastclick'
import VueLazyload from 'vue-lazyload'
Vue.config.productionTip = false

// 这里的$bus是事件总线，用于设置全局的发送事件与监听，也可以用Vuex来处理
Vue.prototype.$bus = new Vue()

// 安装toast插件，这个插件是自己创建的
Vue.use(toast)

// 解决移动端300ms延迟问题
FastClick.attach(document.body)

// 图片的懒加载，并传入options,这些选项中可以定义图片加载失败要显示的情况，或加载中显示的情况
Vue.use(VueLazyload, {
  loading: require('assets/img/common/placeholder.png'),
  error: require('assets/img/common/placeholder.png')
})


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

/*
  事件总线的方法，用于全局事件监听（可以跨很多组件）
    1.在Vue的原型上添加一个$bus的属性让其等于一个新的Vue实例   Vue.prototype.$bus = new Vue()
    2.发射全局监听事件，例如  this.$bus.$emit("itemImageLoad")  和常规$emit一样这个也可以传递参数
    3.监听全局事件，例如  this.$$bus.$on("itemImageLoad", () => {})
*/


/*
  封装toast插件
    1.仔细看components/common/toast文件夹中的index.js和Toast.vue
    2.导入index.js import toast from 'components/common/toast/'
    3.注册toast插件     Vue.use(toast)
    4.此后，都可以通过this.$toast.show(message, duration)来显示message
      注意，能使用$toast是因为在Vue的原型上添加了$toast，其内部添加了一个show方法
*/


/*
  解决移动端点击300ms延迟问题
    1.安装fastClick插件 npm install fastclick --save
    2.在main.js中导入 import FastClick from 'fastclick'
    3.在document.body上使用 FastClick.attach(document.body)
    4.解决多次点击报错问题，在全局的css中添加   * { touch-action: pan-y; }
*/

/*
  图片懒加载的方式
    1.安装vue-lazyload  npm install vue-lazyload --save
    2.在main.js中导入 import VueLazyload from 'vue-lazyload'
    3.采用Vue注册使用，最基础的方法   Vue.use(VueLazyload)
    4.将原先的img :src 改为 v-lazy
*/