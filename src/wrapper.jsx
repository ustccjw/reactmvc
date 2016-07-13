import React, { Component, PropTypes } from 'react'

const wrapper = action => InnerComponent => {
  class OuterComponent extends Component {
    static propTypes = {
      reload: PropTypes.func.isRequired,
    }

    static childContextTypes = {
      action: PropTypes.object.isRequired,
    }

    getChildContext() {
      return { action: this.actionWrap }
    }

    constructor(props, context) {
      super(props, context)
      const { reload } = props
      this.actionWrap = {}
      Object.
        keys(action).
        filter(actionName => actionName !== 'loadProps').
        forEach(actionName => {
          this.actionWrap[actionName] = (...args) =>
            Promise.resolve().
              then(() => action[actionName](...args)).
              then(res => reload(actionName, ...args).then(() => res))
        })
    }

    render() {
      return <InnerComponent {...this.props} reload={undefined} />
    }
  }
  const { loadProps } = action
  OuterComponent.loadProps = loadProps || (() => Promise.resolve({}))
  return OuterComponent
}

export default wrapper
