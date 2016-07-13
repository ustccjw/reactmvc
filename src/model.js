import Immutable from 'immutable'

class Model {
  constructor(route, outputMode) {
    this.model = Immutable.fromJS(route)
    this.outputMode = outputMode
  }

  get(path) {
    return this.model.getIn([].concat(path)).toJS()
  }

  set(path, value) {
    this.model = this.model.setIn([].concat(path), Immutable.fromJS(value))
    return value
  }

  remove(path) {
    const value = this.get(path)
    this.model = this.model.removeIn([].concat(path))
    return value
  }

  has(path) {
    return this.model.hasIn([].concat(path))
  }

  getAll() {
    if (this.outputMode === 'js') {
      return this.model.toJS()
    }
    return this.model
  }
}

/* route demo
const routes = [{
  path: 'market.list',
  get: query => fetch.get('/market/list').query(query).json()
}, {
  path: 'market.setBrand'
  call: query => fetch.post('/market/setBrand').send(query).json()
}];
*/

class HttpModel extends Model {
  constructor(routes) {
    if (!routes || !Array.isArray(routes)) {
      throw new Error('HttpModel should have routes(array) parameter')
    }
    super({})
    this.route = {}
    routes.forEach(route => {
      const { path } = route
      this.route[path] = route
    })
  }

  get(...paths) {
    return Promise.
      all(paths.map((...args) => {
        // path is string
        const [path, query] = args
        const symbol = JSON.stringify({ path, query })
        if (!super.has(symbol)) {
          const getFunc = this.route[path] && this.route[path].get
          if (!getFunc) {
            throw new Error(`${path} get route is not found`)
          }
          return getFunc(query).then(value => super.set(symbol, value))
        }
        return Promise.resolve(super.get(symbol))
      })).
      then(results => {
        if (results.length === 1) {
          return results[0]
        }
        return results
      })
  }

  call(...paths) {
    return Promise.
      all(paths.map((...args) => {
        // path is string
        const [path, query] = args
        const callFunc = this.route[path] && this.route[path].call
        if (!callFunc) {
          throw new Error(`${path} call route is not found`)
        }
        return callFunc(query)
      })).
      then(results => {
        if (results.length === 1) {
          return results[0]
        }
        return results
      })
  }

  remove(...paths) {
    paths.forEach((...args) => {
      const [path, query] = args
      const symbol = JSON.stringify({ path, query })
      super.remove(symbol)
    })
  }
}

export { Model, HttpModel }
