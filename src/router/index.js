import Vue from 'vue'
import Router from 'vue-router'
//import HelloWorld from '@/components/HelloWorld'
Vue.use(Router)

//导入组件
//体温检测
import BodyTemper from '@/components/pages/bodyTemper'


export default new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'HelloWorld',
    //   component: HelloWorld
    // },
    {
      path: '/',
      redirect:'/bodyTemper'
    },
    {
      path: '/bodyTemper',
      name: 'BodyTemper',
      component:BodyTemper,
    },
  ]
})
