import fetch from '../../lib/fetch'

const route = [{
  path: 'articles',
  get: query =>
    fetch.
      get('https://api.github.com/repos/ustccjw/Blog/issues').
      query(query).
      json(),
}]

export default route
