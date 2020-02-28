import Vue from 'vue'
import App from './App.vue'
import './style.scss'
import router from './router'
//axios,用于接口请求
import axios from 'axios'
Vue.prototype.$http =axios.create({
  baseURL:process.env.VUE_APP_API_URL || '/web/api'
})
//swiper组件
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'  //引用样式
Vue.use(VueAwesomeSwiper, /* { default global options } */)
//iconfont
import './assets/iconfont/iconfont.css'
Vue.config.productionTip = false
//card
import Card from './components/Card.vue'
Vue.component('m-card',Card)//定义全局组件
//listcard
import ListCard from './components/ListCard.vue'
Vue.component('m-list-card',ListCard)//定义全局组件
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
