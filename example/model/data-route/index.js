const context = require.context('./', false, /\.js$/)

const routes = context.
  keys().
  filter(item => item !== './index.js').
  reduce((arr, key) => arr.concat(context(key)), [])

export default routes
