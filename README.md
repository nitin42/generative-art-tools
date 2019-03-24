WORK IN PROGRESS!

# generative-art-tools

> Utilities for creating generative art

## Table of contents

* [What]()
* [Install](#install)
* [Functions](#functions)
  - [Processing (p5.js)]()
  - [Two.js]()
  - [Shaders]()
  - [random]()
  - [gain]()
  - [impulse]()
  - [parabola]()
  - [sine curve]()
  - [power curve]()
  - [exponential step]()
  - [cubic pulse]()
  - [Kynd curves]()
    - [curve A]()
    - [curve B]()
    - [curve C]()
    - [curve D]()
    - [curve E]()

## What

`generative-art-tools` is a collection of utility functions to create generative art. It provides -

* a set of helper functions to create generative art using React

* and math functions that can be use to animate the sketches

## Install

```bash
npm install --save generative-art-tools
```

## Functions

### Processing (p5.js)

Render p5.js sketches using React.

```js
import React from "react";
import ReactDOM from "react-dom";
import { createP5Sketch } from "react-generative-tools";

function sketch(p5Instance, componentProps, wrapperElement) {
  let pause = true;

  p5Instance.setup = function() {
    p5Instance.createCanvas(500, 500);
    p5Instance.noFill();
    p5Instance.background(255);
    p5Instance.stroke(0, 15);
    p5Instance.frameRate(30);
  };

  p5Instance.mousePressed = function() {
    pause = !pause;
  };

  p5Instance.draw = function() {
    if (!pause) {
      p5Instance.push();
      p5Instance.translate(p5Instance.width / 2, p5Instance.height / 2);
      p5Instance.rotate(p5Instance.frameCount);

      const circleResolution = parseInt(
        p5Instance.map(p5Instance.mouseY + 50, 0, p5Instance.height, 2, 10)
      );
      const radius = p5Instance.mouseX - p5Instance.width / 2;
      const angle = (2 * Math.PI) / circleResolution;

      p5Instance.beginShape();

      for (let i = 0; i <= circleResolution; i++) {
        const x = Math.cos(angle * i) * radius;
        const y = Math.sin(angle * i) * radius;

        p5Instance.strokeWeight(i / 2);
        p5Instance.vertex(x, y);
      }

      p5Instance.endShape(p5Instance.CLOSE);

      p5Instance.pop();
    }
  };
}

const Shapes = createP5Sketch(sketch);

function App(props) {
  return <Shapes id="Shapes" />
}

ReactDOM.render(<App />, document.getElementById('element-id'));
```

**`createP5Design`**

This function accepts only one argument which is `p5.js` sketch function and returns a React component. The sketch function receives three parameters, the `p5.js` instance, the returned component's props and the wrapper element that wraps the sketch.

`(sketch: (Two) => any, props: {}, wrapperEl: HTMLElement) => any`

The returned React component accepts the following props -

- `width` - Canvas width

- `height` - Canvas height

- `id` - A unique element id (useful if you're rendering multiple sketch components)

- `callback: (p5Instance) => void` - A callback function that receives the p5.js instance. Use this callback to do extra work.


[![Edit 6z855jq5or](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/6z855jq5or?fontsize=14)

### Two.js

Render Two.js sketches using React

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
const renderCircles = (twoJSInstance, componentProps, wrapperElement) => {
  const circles = drawPattern(twoJSInstance, offsets);

  twoJSInstance.render();
};

const Circles = createTwoJSDesign(renderCircles);

function App(props) {
  return <Circles id="Shapes" width={500} height={500} />;
}

ReactDOM.render(<App />, document.getElementById("element-id"));
```

[![Edit w6j4vj2wv7](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/w6j4vj2wv7?fontsize=14)

**`createTwoJSDesign`**

This function accepts only one argument, a `two.js` sketch function and it returns a React component.

The `two.js` sketch function receives three parameters. The `Two.js` instance, the returned component's props and the wrapper element that wraps the artwork.

`(sketch: (Two) => any, props: {}, wrapperEl: HTMLElement) => any`

The returned React component accepts the following props -

- `width` - Canvas width

- `height` - Canvas height

- `id` - A unique element id (useful if you're rendering multiple sketch components)

- `callback: (twoJSInstance) => void` - A callback function that receives the Two.js instance. Use this callback to do extra work.

## License

MIT © [nitin42](https://github.com/nitin42)
