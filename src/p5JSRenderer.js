import React from "react";
import p5 from "p5/lib/p5.min"; //loads the correct minified 388KB file!
import PropTypes from "prop-types";

import { random } from "./utils";

export const createP5Sketch = sketch =>
  class extends React.PureComponent {
    // P5.js instance
    instance = null;
    // Canvas wrapper (not the canvas)
    wrapper = null;
    // Wrapper unique id
    id = null;

    static defaultProps = {
      id: `__canvas-${random(0, 100)}`,
      width: 500,
      height: 500
    };

    static propTypes = {
      width: PropTypes.number,
      height: PropTypes.number
    };

    componentDidMount() {
      // Initiate the p5.js instance mode and store its instance
      this.getCanvas();
    }

    componentDidUpdate() {
      // Remove the old instance (and all its attributes)
      this.instance.remove();

      // Re-instantiate a instance using new props
      this.getCanvas();
    }

    componentWillUnmount() {
      // Cleanup
      this.instance && this.instance.remove();
    }

    renderer = p => sketch(p, this.props);

    getCanvas = () =>
      new p5(p => {
        this.instance = p;

        // Pass the created instance to our sketch function and render p5.js graphics
        this.renderer(p);
      }, this.wrapper);

    render() {
      const { width, height, ...rest } = this.props;

      return (
        <div
          ref={wrapper => (this.wrapper = wrapper)}
          id={this.props.id}
          style={{
            boxShadow: "0px 2px 12px -2px rgba(0, 0, 0, 0.15)",
            width,
            height
          }}
          {...rest}
        />
      );
    }
  };
