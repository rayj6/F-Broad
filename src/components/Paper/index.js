import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Line, Text } from "react-konva";

import "./styles.css";

const ColorPicker = ({ color, setColor }) => {
  return (
    <div id="colorPicker">
      <button
        id="white"
        value={color}
        onClick={() => setColor("white")}
      ></button>
      <button
        id="black"
        value={color}
        onClick={() => setColor("black")}
      ></button>
      <button id="blue" value={color} onClick={() => setColor("blue")}></button>
      <button id="red" value={color} onClick={() => setColor("red")}></button>
      <button
        id="green"
        value={color}
        onClick={() => setColor("green")}
      ></button>
      <button
        id="yellow"
        value={color}
        onClick={() => setColor("yellow")}
      ></button>
      <button
        id="purple"
        value={color}
        onClick={() => setColor("purple")}
      ></button>
      <button id="pink" value={color} onClick={() => setColor("pink")}></button>
      <button id="grey" value={color} onClick={() => setColor("grey")}></button>
      <input
        type={"color"}
        id="moreColor"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />
    </div>
  );
};

const index = () => {
  const [color, setColor] = useState("black");
  const [strokeWidth, setStrokeWidth] = useState(2);

  const WIDTH = window.innerWidth;
  const HEIGHT = window.innerHeight;

  const [tool, setTool] = React.useState("pen");
  const [lines, setLines] = React.useState([]);
  const isDrawing = React.useRef(false);

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { tool, points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e) => {
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    // add point
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  return (
    <div className="paper_container">
      <div id="topBar">
        <div id="logo_container">
          <h1>Logo</h1>
        </div>
        <h1 id="title">title</h1>
        <div id="participants_container">
          <p>00 người tham gia</p>
        </div>
      </div>

      <div id="sideFunctions">
        <button id="undo">Undo</button>
        <button id="clear">Clear</button>
        <input
          type={"number"}
          value={strokeWidth}
          onChange={(e) => setStrokeWidth(e.target.value)}
        />
      </div>

      <ColorPicker color={color} setColor={setColor} />

      <div id="toolBar">
        <button id="draw">Draw</button>
        <button id="Rubber">Rubber</button>
        <button id="Cursor">Cursor</button>
        <button id="Note">Note</button>
        <button id="Image">Image</button>
        <button id="Text">Text</button>
      </div>

      <div id="canvasContainer">
        <Stage
          width={window.innerWidth}
          height={window.innerHeight}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
        >
          <Layer>
            {lines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke={color}
                strokeWidth={5}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
                globalCompositeOperation={
                  line.tool === "eraser" ? "destination-out" : "source-over"
                }
              />
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default index;
