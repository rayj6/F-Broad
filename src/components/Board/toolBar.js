import React, { useRef, useEffect } from "react";
import "./styles.css";

const ToolBar = ({
  setIsDrawing,
  clear,
  setIsWriting,
  setCursor,
  cursor,
  setToDraw,
  setToErase,
  images,
  setImages,
  writeText,
}) => {
  return (
    <div className="ToolBarContainer">
      <button
        id="select"
        onClick={() => {
          if (cursor == "default") {
            setCursor("crosshair");
          } else {
            setCursor("default");
          }
        }}
      >
        Select
      </button>
      <button
        id="draw"
        onClick={() => {
          setToDraw();
          setCursor("default");
        }}
      >
        Draw
      </button>
      <button id="clear" onClick={clear}>
        Clear
      </button>
      <button id="eraser" onClick={setToErase}>
        Eraser
      </button>
      <button id="image">Image</button>
      <button id="text">Text</button>
      <button id="note">Note</button>
      <button id="zoom">Zoom</button>
      {/* <input
        id="textSize"
        type="number"
        value={textSize}
        max={40}
        onChange={(e) => {
          setTextSize(e.target.value);
        }}
      />
      <input
        id="size"
        type="number"
        value={size}
        max={40}
        onChange={(e) => {
          setSize(e.target.value);
        }}
      />
      <input
        id="color"
        type="color"
        value={color}
        onChange={(e) => {
          setColor(e.target.value);
        }}
      /> */}
    </div>
  );
};

export default ToolBar;
