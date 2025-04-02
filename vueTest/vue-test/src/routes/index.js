import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/view/home';
import DynamicForm from '@/view/dynamicForm';
import Gaode from '@/view/gaode';

Vue.use(Router)

export default [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/dynamic-form',
    name: 'dynamicForm',
    component: DynamicForm
  },
  {
    path: '/gao-de',
    name: 'gaode',
    component: Gaode
  }
]
