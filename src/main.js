import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui' //饿了么elementUI组件
import  'element-ui/lib/theme-chalk/index.css'
import './style/main.less'
import router from './router/index' //路由
Vue.use(ElementUI);//全局使用组件

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');

