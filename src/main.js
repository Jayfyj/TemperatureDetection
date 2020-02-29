// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Es6Promise from 'es6-promise'
Es6Promise.polyfill()
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import 'lib-flexible'


Vue.config.productionTip = false

//引入MuseUI
import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';

Vue.use(MuseUI);


//引入MintUI
import MintUI from 'mint-ui'

import 'mint-ui/lib/style.css'

Vue.use(MintUI)

import Calendar from 'vue2-datepick'; //日期控件
Vue.use(Calendar);//日期控件


//引入MUI
// import Mui from 'vue-awesome-mui'
// //import 'vue-awesome-mui/mui/dist/css/mui.css'
// // mount with global
// Vue.use(Mui)


//引入axios
Vue.prototype.$axios=axios
Vue.config.productionTip = false

//引入数据请求方法
import ajax from './methods/ajax.js';
Vue.prototype.ajax = ajax;


//调起模态框
import myModal from "./methods/myModal.js";
Vue.prototype.myModal = myModal;

//引入vuex
import Vuex from 'vuex'
Vue.use(Vuex)

import store from './store/store'
//实例化 store

//引入vconsole
// import Vconsole from 'vconsole'
// const vConsole = new Vconsole()
// Vue.use(vConsole)


/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>',
  watch:{
  	'$route'(to,from){
  		//to:就是去哪里，from就是从哪里来
  		// console.log(to.path)
      if(to.path!="/search"){
        //tab的值(搜索)
        this.$store.state.tabValue = '';
        //搜索框的值(搜索)
        this.$store.state.inpValue = '';
      }
    },
  },
})
