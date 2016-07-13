import React, { Component, PropTypes } from 'react'
import './style.css'

class App extends Component {
  static propTypes = {
    children: PropTypes.any.isRequired,
  }

  render() {
    const { children } = this.props
    return (
      <div id="app">
        <header>
          <h1>Demo</h1>
        </header>
        {children}
      </div>
    )
  }
}

export default App
