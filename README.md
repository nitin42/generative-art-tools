WORK IN PROGRESS. THE LIBRARY IS NOT PUBLISHED YET 😅

# react-generative-tools

> A collection of utility functions for creating generative art with React.

## Install

```bash
npm install --save react-generative-tools
```

## Usage

### p5.js

To render p5.js sketches using React, you will need to use the function `createP5Sketch`.

```js
import React from "react";
import ReactDOM from "react-dom";
import { createP5Sketch } from "react-generative-tools";

function sketch(p5, props, wrapperEl) {
  let pause = true;

  p5.setup = function() {
    p5.createCanvas(500, 500);
    p5.noFill();
    p5.background(255);
    p5.stroke(0, 15);
    p5.frameRate(30);
  };

  p5.mousePressed = function() {
    pause = !pause;
  };

  p5.draw = function() {
    if (!pause) {
      p5.push();
      p5.translate(p5.width / 2, p5.height / 2);
      p5.rotate(p5.frameCount);

      const circleResolution = parseInt(
        p5.map(p5.mouseY + 50, 0, p5.height, 2, 10)
      );
      const radius = p5.mouseX - p5.width / 2;
      const angle = (2 * Math.PI) / circleResolution;

      p5.beginShape();

      for (let i = 0; i <= circleResolution; i++) {
        const x = Math.cos(angle * i) * radius;
        const y = Math.sin(angle * i) * radius;

        p5.strokeWeight(i / 2);
        p5.vertex(x, y);
      }

      p5.endShape(p5.CLOSE);

      p5.pop();
    }
  };
}

const Shapes = createP5Sketch(sketch);

class App extends Component {
  render() {
    return (
      <div>
        <Shapes id="Shapes" />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
```

[Check out the docs for `createP5Sketch`]().

### Using with Two.js

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { createTwoJSDesign, random } from "react-generative-tools";

const colors = {
  CIRCLE_ONE: "#ebedee",
  CIRCLE_TWO: "#7f8a93",
  CIRCLE_THREE: "#374047"
};

const drawCircle = (offset, color, instance) => {
  const circles = [];

  for (let x = 20; x <= instance.width - 5; x += 15) {
    const circle = instance.makeCircle(offset, x, random(0, 10));
    circle.fill = color;
    circle.stroke = "#dee1e3";

    circles.push(circle);
  }

  return circles;
};

const drawPattern = (instance, props) => {
  let renderedCircles = [];

  for (let x = 20; x <= instance.width - 28; x += props.positionOffsetOne) {
    renderedCircles.push(drawCircle(x, colors.CIRCLE_THREE, instance));
    x += props.positionOffsetTwo;

    renderedCircles.push(drawCircle(x, colors.CIRCLE_TWO, instance));
    x += props.positionOffsetThree;

    renderedCircles.push(drawCircle(x, colors.CIRCLE_ONE, instance));
  }

  return renderedCircles;
};

const offsets = {
  positionOffsetOne: 10,
  positionOffsetTwo: 25,
  positionOffsetThree: 30
};

// On each update/page refresh, it displaces the circles randomly
const renderCircles = two => {
  const circles = drawPattern(two, offsets);

  two.render();
};

const Circles = createTwoJSDesign(renderCircles);

class App extends Component {
  render() {
    return (
      <div>
        <Circles id="Shapes" width={500} height={500} />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
```

[Check out the docs for `createTwoJSDesign`]().

> Fact - [`generative-designs`](https://generative-design.surge.sh) uses `react-generative-tools` to create and render interactive artforms.

## Documentation

### `createTwoJSDesign`

This function accepts only one argument which is `two.js` sketch function and returns a React component. The sketch function receives the `Two.js` instance as its parameter.

`(sketch: (Two) => any) => any`

The returned React component accepts the following props -

- `width` - Canvas width

- `height` - Canvas height

- `id` - A unique element id (useful if you're rendering multiple sketch components)

### `createP5Design`

This function accepts only one argument which is `p5.js` sketch function and returns a React component. The sketch function receives the `p5.js` instance as its parameter.

`(sketch: (P5) => any) => any`

The returned React component accepts the following props -

- `width` - Canvas width

- `height` - Canvas height

- `id` - A unique element id (useful if you're rendering multiple sketch components)

## License

MIT © [nitin42](https://github.com/nitin42)
