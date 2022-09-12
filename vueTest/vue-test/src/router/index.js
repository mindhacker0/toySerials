import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/view/home';
import DynamicForm from '@/view/dynamicForm';
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/dynamic-form',
      name: 'dynamicForm',
      component: DynamicForm
    }
  ]
})
