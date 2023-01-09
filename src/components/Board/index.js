import React from "react";
import { useEffect, useRef, useState } from "react";
import "./styles.css";

import ToolBar from "./toolBar";
import Colorpicker from "./colorPicker";

const Paper = () => {
  const [canvasCTX, setCanvasCTX] = useState(null);
  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState(2);
  const [cursor, setCursor] = useState("default");
  const [isWriting, setIsWriting] = useState(false);
  const [text, setText] = useState("");
  const [note, setNote] = useState("");
  const [textSize, setTextSize] = useState(12);

  const [images, setImages] = React.useState([]);

  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 1300;
    canvas.height = 600;

    const context = canvas.getContext("2d");

    contextRef.current = context;
  }, []);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.lineCap = "round";
    contextRef.current.strokeStyle = color;
    contextRef.current.lineWidth = size;
    setIsDrawing(true);
    nativeEvent.preventDefault();
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) {
      return;
    }

    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
    nativeEvent.preventDefault();
  };

  const stopDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const setToDraw = () => {
    contextRef.current.globalCompositeOperation = "source-over";
  };

  const setToErase = () => {
    contextRef.current.globalCompositeOperation = "destination-out";
  };

  const clear = () => {
    const ctx = contextRef.current;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const writeText = (info, style = {}) => {
    const ctx = canvasCTX;
    const { text, x, y } = info;
    const {
      fontSize = 20,
      fontFamily = "Arial",
      color = "black",
      textAlign = "left",
      textBaseline = "top",
    } = style;

    ctx.beginPath();
    ctx.font = fontSize + "px " + fontFamily;
    ctx.textAlign = textAlign;
    ctx.textBaseline = textBaseline;
    ctx.fillStyle = color;
    ctx.fillText("Test", x, y);
    ctx.stroke();

    return [setIsWriting(false), setCursor("default")];
  };

  return (
    <div className="PaperContainer">
      <img id="logo" src={require("../../assets/logo.png")} />
      <ToolBar
        setIsDrawing={setIsDrawing}
        setCursor={setCursor}
        size={size}
        setSize={setSize}
        clear={clear}
        textSize={textSize}
        setTextSize={setTextSize}
        cursor={cursor}
        setToDraw={setToDraw}
        setToErase={setToErase}
        images={images}
        setImages={setImages}
        writeText={writeText}
      />
      <div id="Undo_Redo_container">
        <button>Undo</button>
        <button>Redo</button>
      </div>
      <Colorpicker color={color} setColor={setColor} />
      <canvas
        style={{ cursor: cursor }}
        id="canvasCTN"
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      ></canvas>

      <div id="Participants">00 Người tham gia</div>
    </div>
  );
};

export default Paper;
