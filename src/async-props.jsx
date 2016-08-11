/* eslint-disable react/no-multi-comp */

import React, { Component, PropTypes } from 'react'
import RouterContext from 'react-router/lib/RouterContext'

function eachComponents(components, iterator) {
  components.forEach(value => {
    if (typeof value === 'object') {
      for (const component of value) {
        iterator(component)
      }
    } else {
      iterator(value)
    }
  })
}

function findAsyncComponents(components) {
  const asyncComponents = []
  eachComponents(components, component => {
    if (component.loadProps) {
      asyncComponents.push(component)
    }
  })
  return asyncComponents
}

function loadAsyncProps(components, params, location) {
  const componentArray = []
  const propsArray = []
  const tasks = findAsyncComponents(components).map((component, index) =>
    Promise.resolve().then(() => component.loadProps(params, location)).then(props => {
      propsArray[index] = props
      componentArray[index] = component
    })
  )
  return Promise.all(tasks).then(() => ({ componentArray, propsArray }))
}

function lookupPropsForComponent(component, propsAndComponents) {
  const { componentArray, propsArray } = propsAndComponents
  const index = componentArray.indexOf(component)
  return propsArray[index]
}

function createElement(component, routerProps, asyncInfo) {
  if (component.loadProps) {
    return (
      <AsyncPropsContainer component={component} routerProps={routerProps} asyncInfo={asyncInfo} />
    )
  }
  return React.createElement(component, routerProps)
}

class AsyncPropsContainer extends Component {
  static propTypes = {
    component: PropTypes.func.isRequired,
    routerProps: PropTypes.object.isRequired,
    asyncInfo: PropTypes.object.isRequired,
  }

  render() {
    const { component, routerProps, asyncInfo } = this.props
    const { propsAndComponents, loading, reload } = asyncInfo
    const asyncProps = lookupPropsForComponent(component, propsAndComponents)
    const props = { ...routerProps, ...asyncProps, reload, loading }
    return React.createElement(component, props)
  }
}

class AsyncProps extends Component {
  static propTypes = {
    components: React.PropTypes.array.isRequired,
    params: React.PropTypes.object.isRequired,
    location: React.PropTypes.object.isRequired,
    onError: React.PropTypes.func.isRequired,
    renderLoading: React.PropTypes.func.isRequired,
    renderErrorPage: React.PropTypes.func.isRequired,

    // server rendering
    propsArray: React.PropTypes.array,
    componentArray: React.PropTypes.array,
  }

  static defaultProps = {
    onError: err => { throw err },
    renderLoading: () => null,
    renderErrorPage: () => null,
  }

  constructor(props, context) {
    super(props, context)
    const { propsArray, componentArray } = props
    const isServerRender = propsArray && componentArray
    this.state = {
      loading: false,
      prevProps: null,
      propsAndComponents: isServerRender ? { propsArray, componentArray } : null,
      routeChanged: false,
      routeChangeError: false,
    }
  }

  componentWillMount() {
    const { components, params, location } = this.props
    this.loadAsyncProps(components, params, location)
  }

  componentWillReceiveProps(nextProps) {
    const routeChanged = nextProps.location.key !== this.props.location.key
    if (routeChanged) {
      const { components, params, location } = nextProps
      this.loadAsyncProps(components, params, location)
    }
  }

  componentWillUnmount() {
    this.unmounted = true
  }

  loadAsyncProps(components, params, location) {
    const routeChanged = location.key !== this.props.location.key
    this.setState({ loading: true, prevProps: this.props, routeChanged })
    const { onError } = this.props
    return loadAsyncProps(components, params, location).
      then(propsAndComponents => {
        const sameLocation = this.props.location.key === location.key
        if (sameLocation && !this.unmounted) {
          this.setState({ loading: false, prevProps: null, propsAndComponents,
            routeChangeError: false })
        }
      }).
      catch(err => {
        const sameLocation = this.props.location.key === location.key
        if (sameLocation && !this.unmounted) {
          this.setState({ loading: false, routeChangeError: routeChanged })
        }
        onError(err)
      })
  }

  reload(actionName, ...args) {
    if (process.env.NODE_ENV !== 'production') {
      console.info(actionName, args) // eslint-disable-line no-console
    }
    const { components, params, location } = this.props
    return this.loadAsyncProps(components, params, location)
  }

  render() {
    const { loading, prevProps, propsAndComponents, routeChanged, routeChangeError } = this.state
    const { renderLoading, renderErrorPage } = this.props
    if (!propsAndComponents) {
      return renderLoading()
    }
    if (routeChangeError) {
      return renderErrorPage()
    }
    const asyncInfo = { loading, routeChanged, propsAndComponents, reload: ::this.reload }
    const props = prevProps || this.props
    return (
      <RouterContext {...props} createElement={(component, routerProps) =>
        createElement(component, routerProps, asyncInfo)} />
    )
  }
}

export const loadPropsOnServer = ({ components, params, location }) =>
  loadAsyncProps(components, params, location)

export default AsyncProps
