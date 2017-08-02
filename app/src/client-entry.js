import 'es6-promise/auto'
import { app } from './app'

// actually mount to DOM
app.$mount('#app')

// service worker
// @todo: enable back for production env
/*if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
 navigator.serviceWorker.register('/service-worker.js')
 }*/
