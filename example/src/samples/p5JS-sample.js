import React, { Component } from "react";
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

export default class App extends Component {
  render() {
    return (
      <div>
        <Shapes id="Shapes" />
      </div>
    );
  }
}
