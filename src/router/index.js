import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView1 from '../views/HomeView1.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '',
    name: 'home',
    component: HomeView1,
    children:[
      {

        path: '/',
        name: 'homev',
        component: () => import(/* webpackChunkName: "about" */ '../components/HomePage.vue')
      },
      {

        path: '/setting',
        name: 'setting',
        component: () => import(/* webpackChunkName: "about" */ '../components/SettingPage.vue')
      },
      {

        path: '/calendar',
        name: 'calendar',
        component: () => import(/* webpackChunkName: "about" */ '../components/AgendaPage.vue')
      }
    ]
  },

]

const router = new VueRouter({
  routes
})

export default router
