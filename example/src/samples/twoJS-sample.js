import React, { Component } from "react";
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
const renderCircles = (two, props, wrapperEl) => {
  const circles = drawPattern(two, offsets);

  two.render();
};

const Circles = createTwoJSDesign(renderCircles);

export default class App extends Component {
  render() {
    return (
      <div>
        <Circles id="Shapes" width={500} height={500} />
      </div>
    );
  }
}
