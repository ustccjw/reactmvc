import React, { Component, PropTypes } from 'react' // eslint-disable-line import/no-unresolved

const wrapper = action => InnerComponent => {
  class OuterComponent extends Component {
    static propTypes = {
      reload: PropTypes.func.isRequired,
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
      return <InnerComponent {...this.props} reload={undefined} action={this.actionWrap} />
    }
  }
  const { loadProps } = action
  OuterComponent.loadProps = loadProps
  return OuterComponent
}

export default wrapper
