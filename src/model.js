/**
 * path: 'xxx.xxx.xxx'
 */

class Model {
  constructor(routes) {
    if (!routes || typeof routes !== 'object') {
      throw new Error('Model should have routes(object) parameter')
    }
    this.model = routes
  }

  get(path) {
    const pathArr = path.split('.')
    let parent = this.model
    pathArr.slice(0, -1).every(key => {
      parent = parent[key]
      if (typeof parent !== 'object') {
        return false
      }
      return true
    })
    if (typeof parent !== 'object') {
      return undefined
    }
    return JSON.parse(JSON.stringify(parent[pathArr[pathArr.length - 1]]))
  }

  set(path, value) {
    const pathArr = path.split('.')
    let parent = this.model
    pathArr.slice(0, -1).forEach(key => {
      if (parent[key] === undefined) {
        parent[key] = {}
      }
      parent = parent[key]
    })
    parent[pathArr[pathArr.length - 1]] = JSON.parse(JSON.stringify(value))
  }

  remove(path) {
    const pathArr = path.split('.')
    let parent = this.model
    pathArr.slice(0, -1).every(key => {
      parent = parent[key]
      if (typeof parent !== 'object') {
        return false
      }
      return true
    })
    if (typeof parent === 'object') {
      parent[pathArr[pathArr.length - 1]] = undefined
    }
  }

  has(path) {
    const pathArr = path.split('.')
    let parent = this.model
    pathArr.slice(0, -1).every(key => {
      parent = parent[key]
      if (typeof parent !== 'object') {
        return false
      }
      return true
    })
    if (typeof parent !== 'object') {
      return false
    }
    return parent[pathArr[pathArr.length - 1]] !== undefined
  }

  getAll() {
    return JSON.parse(JSON.stringify(this.model))
  }

  clear() {
    this.model = {}
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

  remove(path, query) {
    const symbol = `${path}.${JSON.stringify(query)}`
    super.remove(symbol)
  }
}

export { Model, HttpModel }
