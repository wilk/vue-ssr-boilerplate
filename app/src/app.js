import Vue from 'vue'
import App from './components/app/app.vue'
import store from './stores'
import router from './router'
import {sync} from 'vuex-router-sync'
import * as filters from './filters'
import api from './services/api'
import helper from './services/helper'

let defaults = {}
if (helper.isClient()) {
  // Client Setup

  // prime the store with server-initialized state.
  // the state is determined during SSR and inlined in the page markup.
  store.replaceState(window.__INITIAL_STATE__)

  // setup axios
  defaults = {
    withCredentials: true
  }
  if (store.state.user.user.session.cookie) defaults.withCredentials = true
  if (store.state.user.user.session.csrf_token.length > 0) defaults.headers = {'X-CSRF-Token': store.state.user.user.session.csrf_token}

  // set mobile device for those that are less than 768px width
  const dim = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
  store.state.isMobile = dim < 768
  store.state.isTablet = dim < 999
} else {
  // Server Setup
  defaults = {
    withCredentials: true
  }
}

api.setDefaults(defaults)

// sync the router with the vuex store.
// this registers `store.state.route`
sync(store, router)

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// create the app instance.
// here we inject the router and store to all child components,
// making them available everywhere as `this.$router` and `this.$store`.
const vueData = {
  router,
  store,
  i18n,
  ...App
}

const app = new Vue(vueData)

// expose the app, the router and the store.
// note we are not mounting the app here, since bootstrapping will be
// different depending on whether we are in a browser or on the server.
export {app, router, store}
