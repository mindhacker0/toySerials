// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import './public-path';
import Vue from 'vue';
import App from './App';
import routes from './routes';
import VueRouter from 'vue-router';
import Antd from "ant-design-vue";
import 'ant-design-vue/dist/antd.css';
Vue.config.productionTip = false
Vue.use(Antd);
/* eslint-disable no-new */

let router = null;
let instance = null;
function render(props = {}) {
  const { container,micorApp } = props;
  router = new VueRouter({
    base: window.__POWERED_BY_QIANKUN__ ? '/':micorApp?'/api' : '/',
    mode: 'history',
    routes,
  });
  console.log(document.body)
  instance = new Vue({
    el: container ? container.querySelector('#app') : "#app",
    router,
    render:h=>h(App)
  });
}

// 独立运行时
if (!window.__POWERED_BY_QIANKUN__&&!window.__MICRO_APP_ENVIRONMENT__) {
  render();
}
/**
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
export async function bootstrap() {
  console.log('vue app bootstraped');
}

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount(props) {
  console.log('render vue',props);
  render(props);
}

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount(props) {
  instance.$destroy();
  instance.$el.innerHTML = '';
  instance = null;
}

/**
 * 可选生命周期钩子，仅使用 loadMicroApp 方式加载微应用时生效
 */
export async function update(props) {
  console.log('update props', props);
}
window.mount = ()=>render({micorApp:true});
window.unmount = unmount;