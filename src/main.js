// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import Loading from 'vue-loading-overlay';
import VeeValidate from 'vee-validate';
import 'vue-loading-overlay/dist/vue-loading.css';
import 'bootstrap';
import VeeValidateTW from 'vee-validate/dist/locale/zh_TW';

import App from './App';
import router from './router';
import './bus';
import currencyFilter from './filters/currency';

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);

Vue.use(VeeValidate);
VeeValidate.Validator.localize('zh_TW', VeeValidateTW);

Vue.component('Loading', Loading);
Vue.filter('currency', currencyFilter);

axios.defaults.withCredentials = true;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

router.beforeEach((to, from, next) => {
  if(to.meta.requiresAuth){
    const api = `${process.env.APIPATH}/api/user/check`;
    axios.post(api).then((response) => {
        if(response.data.success){
          console.log('驗證成功');
          next();
        }
        else{
          console.log('驗證失敗, 請重新登入');
          next({
            path: '/login',
          })
        }
    });
  }
  else{
    next();
  }
})
