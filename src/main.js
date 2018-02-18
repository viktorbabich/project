// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'

Vue.use(VueResource);

Vue.http.options.root = 'http://localhost:3672';
Vue.http.options.emulateJSON = true;

Vue.http.options.xhr = {withCredentials: false};
Vue.http.options.credentials = true;
Vue.http.headers.common["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8";

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
