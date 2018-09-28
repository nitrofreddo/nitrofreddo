// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Store from './API.js'
import App from './App'
import router from './router'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './css/bootstrap.min.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { far } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import './css/loader.css'
import './css/custom.css'

library.add(far);

Vue.use(BootstrapVue);
Vue.component('fa-icon', FontAwesomeIcon);
Vue.config.productionTip = false;

new Vue({
  name: 'Main',
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  store: Store
});


