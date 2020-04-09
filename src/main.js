//  The Vue build version to load with the `import` command
//  (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'; // 引入vue模块
import App from './App'; // 引入vue组件
import router from './router'; //  引入路由配置文件
import Mock from './mock';
import store from './store/store'; //  引入vuex实例
import viewUI from 'view-design'
import 'view-design/dist/styles/iview.css';
// import './common/fonts/iconfont.css'
Vue.use(viewUI)
Mock.start();
Vue.config.productionTip = false;  //  关闭生产模式下给出的提示

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
