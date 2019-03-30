WORK IN PROGRESS!

# generative-art-tools

> Utilities for creating generative art

## Table of contents

- [What](#what)
- [Install](#install)
- [Functions](#functions)
  - [Processing (p5.js)](#processing-p5js)
  - [Two.js](#twojs)
  - [Shaders](#shaders)
  - [random](#random)
  - [Shaping functions](https://github.com/nitin42/generative-art-tools#shaping-functions)
    - [Introduction](https://github.com/nitin42/generative-art-tools#reference)
    - [gain](https://github.com/nitin42/generative-art-tools#gain)
    - [impulse](https://github.com/nitin42/generative-art-tools#impulse)
    - [parabola](https://github.com/nitin42/generative-art-tools#parabola)
    - [sine curve](https://github.com/nitin42/generative-art-tools#sine)
    - [power curve](https://github.com/nitin42/generative-art-tools#power)
    - [exponential step](https://github.com/nitin42/generative-art-tools#exponential-step)
    - [cubic pulse](https://github.com/nitin42/generative-art-tools#cubic-pulse)

## What

`generative-art-tools` is a collection of utility functions to create generative art. It provides -

- a set of helper functions to create generative art using React

- and math functions that can be use to animate the sketches

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
import { createP5Sketch } from "generative-art-tools";

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
  return <Shapes id="Shapes" />;
}

ReactDOM.render(<App />, document.getElementById("element-id"));
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
import { createTwoJSDesign, random } from "generative-art-tools";

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

### Shaders

Render shaders using React

```jsx
import React, { Component } from "react";

import { createShaderCanvas } from "generative-art-tools";

const shader = props => `
  #ifdef GL_ES
  precision mediump float;
  #endif

  uniform float u_time;
  uniform vec2 u_mouse;
  uniform vec2 u_resolution;
  
  float expStep( float x, float k, float n ){
    return exp( -k*pow(x,n) );
  }
  
  void main() {
    vec2 point = gl_FragCoord.xy / u_resolution.xy;
    float px = 1.0 / u_resolution.y;
    vec2 cp = vec2(cos(u_time),sin(u_time)) * 0.618 + 0.620;
  
    float l = expStep(point.x, ${props.timeSync ? "cp.x * u_time" : "cp.x"}, ${
  props.timeSync ? "cp.y * u_time" : "cp.y"
});
    
    vec3 color = vec3(smoothstep(l, l+px, point.y), sin(u_time), cos(cp.y) * 0.5);
      
    gl_FragColor = vec4(color, 1.0);
  }
`;

const ShaderComponent = createShaderCanvas(shader);

class App extends Component {
  state = {
    timeSync: false
  };

  updateState = e => this.setState(state => ({ timeSync: !state.timeSync }));

  render() {
    const { timeSync } = this.state;

    return (
      <div onClick={this.updateState}>
        <ShaderComponent id="exponential-step-curve" timeSync={timeSync} />
      </div>
    );
  }
}
```

[![Edit wopqzj7o77](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/wopqzj7o77)

**`createShaderCanvas`**

`(shader: (props) => string) => ReactComponent`

`createShaderCanvas` takes a shader as an input and returns a React component which renders the shader. The shader function gets passed the component props.

The returned React component accepts the following props -

- `id` (Required) - `id` of the canvas element. This is required to render the canvas

- `height` (Optional) - height of the canvas.

- `width` (Optional) - width of the canvas.

- `style` (Optional) - canvas style.

### Random

Returns a random number between a range.

```js
import { random } from "generative-art-tools";

random(10, 18);
```

### Shaping functions

Shaping functions are mathematical functions that lets you control the flow of values. These functions can be used to interpolate values between a defined range for example.

#### Reference

- [Detailed reference guide on what and how to use shaping functions.](https://thebookofshaders.com/05/)

- [Visualisation of shaping functions](https://shaping-functions.surge.sh)

- Inigo Quilez's [blog](http://www.iquilezles.org/www/index.htm) explains the use cases for shaping functions such as - animations, or making envelopes for music.

> The below functions were authored by [Inigo Quilez](http://www.iquilezles.org/index.html). I have just ported them to code so that they can be used in creating animations.

#### Gain

```js
import { gain } from "generative-art-tools";
```

<details>
  <summary>Implementation</summary>
  <p>

```js
const gain = (x: number, y: number): number => {
  const a = 0.5 * Math.pow(2 * (x < 0.5 ? x : 1 - x), y);
  return x < 0.5 ? a : 1 - a;
};
```

</p></details>

#### Impulse

```js
import { impulse } from "generative-art-tools";
```

<details>
  <summary>Implementation</summary>
  <p>

```js
const impulse = (x: number, y: number): number => {
  const h = y * x;
  return h * Math.exp(1 - h);
};
```

</p></details>

#### Parabola

```js
import { parabola } from "generative-art-tools";
```

<details>
  <summary>Implementation</summary>
  <p>

```js
const parabola = (x: number, y: number): number => Math.pow(4 * x * (1 - x), y);
```

</p></details>

#### Sine

```js
import { sine } from "generative-art-tools";
```

<details>
  <summary>Implementation</summary>
  <p>

```js
const sine = (x: number, y: number): number => {
  const a = 3.1459265359 * y * x - 1;
  return Math.sin(a) / a;
};
```

</p></details>

#### Power

```js
import { power } from "generative-art-tools";
```

<details>
  <summary>Implementation</summary>
  <p>

```js
const power = (x: number, a: number, b: number): number => {
  const k = Math.pow(a + b, a + b) / (Math.pow(a, a) * Math.pow(b, b));
  return k * Math.pow(x, a) * Math.pow(1 - x, b);
};
```

</p></details>

#### Exponential step

```js
import { expStep } from "generative-art-tools";
```

<details>
  <summary>Implementation</summary>
  <p>

```js
const expStep = (x: number, y: number, n: number): number => {
  return Math, exp(-y * Math.pow(x, n));
};
```

</p></details>

#### Cubic pulse

```js
import { cubicPulse } from "generative-art-tools";
```

<details>
  <summary>Implementation</summary>
  <p>

```js
const cubicPulse = (a: number, y: number, x: number): number => {
  x = Math.abs(x - a);
  if (x > y) return 0;

  x /= y;
  return 1 - x * x * (3 - 2 * x);
};
```

</p></details>

## License

MIT © [nitin42](https://github.com/nitin42)
