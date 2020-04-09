import Vue from 'vue';
import Router from 'vue-router';
import layouts from '@/views/layouts';
import todo from '@/views/todo';

Vue.use(Router);

export default new Router({
  routes: [
    {path: '/',
      name: 'layout',
      component: layouts,
      children: [{
        path: '/todo/:id',
        name: 'todo',
        component: todo}],
      beforeEnter: function(to, from, next){
        if (!window.localStorage.token){
          next('/login')
        } else {
          next()
        }
      }
    },
    {path: '/login',
      name: 'login',
      component: () => import('../views/Login')
    },
    {path: '/register',
      name: 'register',
      component: () => import('../views/Register')
    }
  ]
});
