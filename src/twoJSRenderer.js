import React from 'react'
import Two from 'two.js'

import { random } from './utils'

function flush({ shouldDequeue }, work) {
  // Clear the current batch and restart from scratch
  if (shouldDequeue) {
    this.TwoJS && this.TwoJS.clear()
  }

  // Invoke our sketch function with props
  work(this.TwoJS, this.props, this.wrapper)

  // Update the canvas
  this.TwoJS.update()
}

// Takes a sketch function, and returns a React component. The sketch function receives two values, a two.js instance and component props
export function createTwoJSDesign(sketch) {
  return class extends React.Component {
    // Two.js instance
    TwoJS = null
    wrapper = null

    static defaultProps = {
      id: `__canvas-${random(0, 100)}`,
      width: 500,
      height: 500,
      callback: instance => { }
    }

    componentDidMount() {
      // Get the main container element
      const container = document.getElementById(this.props.id)

      // Two.js params
      const params = { width: this.props.width, height: this.props.height }

      // Append Two.js base to our container
      this.TwoJS = new Two(params).appendTo(container)

      // Do some extra work with the Two.js instance (play/pause the animations, create custom curves etc)
      this.props.callback(this.TwoJS)

      // Render the graphics
      flush.call(this, { shouldDequeue: false }, sketch)
    }

    componentDidUpdate() {
      // Clear the previously rendered Two.js objects, and start rendering from scratch (otherwise we end up with an array of old objects along with the new objects)
      // This is useful if we are doing animations (rotating and translating the coordinate system)
      flush.call(this, { shouldDequeue: true }, sketch)
    }

    render() {
      const { width, height } = this.props

      return (
        <div
          ref={wrapper => (this.wrapper = wrapper)}
          id={this.props.id}
          style={{
            boxShadow: '0px 2px 12px -2px rgba(0, 0, 0, 0.15)',
            width,
            height
          }}
        />
      )
    }
  }
}
