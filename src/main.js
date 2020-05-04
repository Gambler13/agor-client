import Vue from 'vue'
import App from './App.vue'

import VueSocketIO from 'vue-socket.io-extended';
require('dotenv').config();

console.log("------->"+process.env.VUE_APP_SERVER)

import io from 'socket.io-client';

let url = process.env.VUE_APP_SERVER

const socket = io(url, {
  path: "/socket/"
});

Vue.use(VueSocketIO, socket)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
