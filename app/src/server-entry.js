import { app, router, store } from './app'
import api from './services/api'

const isDev = process.env.NODE_ENV !== 'production'

// This exported function will be called by `bundleRenderer`.
// This is where we perform data-prefetching to determine the
// state of our application before actually rendering it.
// Since data fetching is async, this function is expected to
// return a Promise that resolves to the app instance.
export default context => {
  return new Promise((resolve, reject) => {
    const s = isDev && Date.now()
    store.state.user.user.session.cookie = context.cookie

    // set cookie if exists
    if (context.cookie.length > 0) api.setDefaults({headers: {Cookie: context.cookie}})

    // set router's location
    router.push(context.url)

    return router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()

      // no matched routes
      if (!matchedComponents.length) {
        return reject({ code: '404' })
      }

      // Call preFetch hooks on components matched by the route.
      // A preFetch hook dispatches a store action and returns a Promise,
      // which is resolved when the action is complete and store state has been
      // updated.
      return Promise.all(matchedComponents.map(component => {
        return component.preFetch ? component.preFetch(store, router) : null
      })).then(() => {
        if (isDev) console.log(`data pre-fetch: ${Date.now() - s}ms`)
        // After all preFetch hooks are resolved, our store is now
        // filled with the state needed to render the app.
        // Expose the state on the render context, and let the request handler
        // inline the state in the HTML response. This allows the client-side
        // store to pick-up the server-side state without having to duplicate
        // the initial data fetching on the client.

        // replace cookie with a placeholder if exists
        if (store.state.user.user.session.cookie && store.state.user.user.session.cookie.length > 0) store.state.user.user.session.cookie = 'cookie'
        context.initialState = store.state
        resolve(app)
      }, reject)
    })
  })
}
