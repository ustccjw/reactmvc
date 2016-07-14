import Immutable from 'immutable'

/**
 * path: 'xxx.xxx.xxx'
 */

class Model {
  constructor(route) {
    this.model = Immutable.fromJS(route)
  }

  get(path) {
    const pathArr = path.split('.')
    return this.model.getIn(pathArr).toJS()
  }

  set(path, value) {
    const pathArr = path.split('.')
    this.model = this.model.setIn(pathArr, Immutable.fromJS(value))
  }

  remove(path) {
    const value = this.get(path)
    const pathArr = path.split('.')
    this.model = this.model.removeIn(pathArr)
    return value
  }

  has(path) {
    const pathArr = path.split('.')
    return this.model.hasIn(pathArr)
  }

  getAll() {
    this.model.toJS()
  }

  clear() {
    this.model = Immutable.fromJS({})
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

  get(path, query) {
    const symbol = `${path}.${JSON.stringify(query)}`
    if (!super.has(symbol)) {
      const getFunc = this.route[path] && this.route[path].get
      if (!getFunc) {
        throw new Error(`${path} get route is not found`)
      }
      return getFunc(query).then(value => {
        super.set(symbol, value)
        return super.get(symbol)
      })
    }
    return Promise.resolve(super.get(symbol))
  }

  call(path, query) {
    const callFunc = this.route[path] && this.route[path].call
    if (!callFunc) {
      throw new Error(`${path} call route is not found`)
    }
    return callFunc(query)
  }

  remove(...paths) {
    paths.forEach((...args) => {
      const [path, query] = args
      const symbol = `${path}.${JSON.stringify(query)}`
      super.remove(symbol)
    })
  }
}

export { Model, HttpModel }
