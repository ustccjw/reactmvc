const context = require.context('./', false, /\.js$/)
const keys = context.keys().filter(item => item !== './index.js')

const route = {}
keys.forEach(key => {
  let routeKey = key.match(/([^\/]+)\.js$/)[1]
  routeKey = routeKey.split('-').map((word, i) => {
    if (i > 0) {
      return `${word[0].toUpperCase()}${word.slice(1)}`
    }
    return word
  }).join('')
  route[routeKey] = context(key)
})


export default route
