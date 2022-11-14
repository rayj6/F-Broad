import React, {useState, useRef} from "react";
import {Stage, Layer, Line} from "react-konva";

import "./styles.css";

const ColorPicker = ({color, setColor}) => {
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

const Index = () => {
    const WIDTH = window.innerWidth;
    const HEIGHT = window.innerHeight;
    const [strokeWidth, setStrokeWidth] = useState(2);
    const [stroke, setStroke] = useState("black");
    const [lines, setLines] = useState([]);
    const isDrawing = useRef(false);

    const handleMouseDown = (e) => {
        isDrawing.current = true;
        const pos = e.target.getStage().getPointerPosition();
        setLines([...lines, {stroke, strokeWidth, points: [pos.x, pos.y]}]);
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
                    onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
                />
            </div>

            <ColorPicker color={stroke} setColor={setStroke}/>

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
                                stroke={line.stroke}
                                strokeWidth={line.strokeWidth}
                                tension={0.5}
                                lineCap="round"
                                lineJoin="round"
                            />
                        ))}
                    </Layer>
                </Stage>
            </div>
        </div>
    );
};

export default Index;
