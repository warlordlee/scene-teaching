import Vue from "vue";
import vueRouter from 'vue-router';
import home from '../view/home'

Vue.use(vueRouter);

let routes = [
    {
        path: '/',
        redirect: 'home'
    },
    // 首页 模块默认加载 其他模块动态加载
    {
        path: '/home',
        name: 'home',
        component: home,
    },
];

const router = new vueRouter({
    routes: routes
});

export default router
