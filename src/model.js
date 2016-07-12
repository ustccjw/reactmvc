import Immutable from 'immutable'

class Model {
  constructor(model) {
    if (model instanceof Immutable) {
      this.model = model
    } else {
      this.model = Immutable.fromJS(model)
    }
  }

  get(path) {
    return this.model.getIn([].concat(path))
  }

  set(path, value) {
    let immutableValue = value
    if (!(value instanceof Immutable)) {
      immutableValue = Immutable.fromJS(value)
    }
    this.model = this.model.setIn([].concat(path), immutableValue)
    return immutableValue
  }

  remove(path) {
    if (this.has(path)) {
      const value = this.get(path)
      this.model = this.model.removeIn([].concat(path))
      return value
    }
    return undefined
  }

  has(path) {
    return this.model.hasIn([].concat(path))
  }

  getAll() {
    return this.model
  }
}

/* route demo
const routes = [{
  path: ['market', 'list'],
  get: query => fetch.get('/market/list').query(query).json()
}, {
  path: ['market', 'list'],
  call: query => fetch.post('/market/list').send(query).json()
}];
*/

class HttpModel extends Model {
  constructor(routes) {
    super({})
    this.route = {}
    routes.forEach(route => {
      const { path } = route
      this.route[path] = route
    })
  }

  get(...paths) {
    Promise.all(paths.map(([path, query]) => {
      const symbol = JSON.stringify({ path, query })
      if (!super.has(symbol)) {
        return this.route[path].get(query).then(value => super.set(symbol, value))
      }
      return Promise.resolve(super.get(symbol))
    })).then(results => {
      if (results.length === 1) {
        return results[0]
      }
      return results
    })
  }

  call(...paths) {
    Promise.all(paths.map(([path, query]) => this.route[path].call(query))).
      then(results => {
        if (results.length === 1) {
          return results[0]
        }
        return results
      })
  }

  remove(...paths) {
    paths.forEach(([path, query]) => {
      const symbol = JSON.stringify({ path, query })
      super.remove(symbol)
    })
  }
}

export { Model, HttpModel }
