import Vue from 'vue'
import Router from 'vue-router'

import Home from '../pages/home/home'
import Unauthorized from '../pages/unauthorized/unauthorized'
import Forbidden from '../pages/forbidden/forbidden'
import NotFound from '../pages/not-found/not-found'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  scrollBehavior: _ => ({ y: 0 }),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/401', component: Unauthorized, name: 'unauthorized' },
    { path: '/403', component: Forbidden, name: 'forbidden' },
    { path: '/404', component: NotFound, name: 'not-found' },
    { path: '*', redirect: '/404' }
  ]
})

export default router