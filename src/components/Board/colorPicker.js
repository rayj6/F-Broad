import React from "react";
import "./styles.css";

const colorPicker = ({ color, setColor }) => {
  return (
    <div className="colorPicker">
      <button
        value={color}
        onClick={() => {
          setColor("blue");
        }}
      >
        Xanh
      </button>
      <button
        value={color}
        onClick={() => {
          setColor("red");
        }}
      >
        Đỏ
      </button>
      <button
        value={color}
        onClick={() => {
          setColor("purple");
        }}
      >
        Tím
      </button>
      <button
        value={color}
        onClick={() => {
          setColor("yellow");
        }}
      >
        Vàng
      </button>
      <button
        value={color}
        onClick={() => {
          setColor("pink");
        }}
      >
        Hồng
      </button>
      <button
        value={color}
        onClick={() => {
          setColor("orange");
        }}
      >
        Cam
      </button>
      <input
        id="color"
        type="color"
        value={color}
        onChange={(e) => {
          setColor(e.target.value);
        }}
      />
    </div>
  );
};

export default colorPicker;
