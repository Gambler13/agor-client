import Vue from 'vue'
import App from './App.vue'

import VueSocketIO from 'vue-socket.io';



Vue.use(new VueSocketIO({
  debug: true,
  connection: 'http://localhost:8008',
  options: { path: "/socket/" } //Optional options
}))

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
