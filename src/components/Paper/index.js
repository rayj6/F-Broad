import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Line, Transformer } from "react-konva";
import { onValue, update, ref, remove, onChildAdded } from "firebase/database";
import { Database } from "../../firebase.config";

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
    const refDB = ref(Database, "/board/")
    const WIDTH = window.innerWidth;
    const HEIGHT = window.innerHeight;
    const [strokeWidth, setStrokeWidth] = useState(5);
    const [stroke, setStroke] = useState("black");
    const [lines, setLines] = useState([]);
    const isDrawing = useRef(false);

    //Ref elements
    const stageRef = useRef(null);
    const stageElm = stageRef.current;

    useEffect(() => {
        onValue(refDB, (snapshot) => {
            const data = snapshot.val();
            setLines(data || []);
        });
    }, []);

    const handleMouseDown = () => {
        isDrawing.current = true;
        const pos = stageRef.current.getPointerPosition();
        setLines([...lines, {options: {stroke, strokeWidth}, points: [pos.x, pos.y, pos.x, pos.y]}]);
    }
    const handleMouseUp = async () => {
        isDrawing.current = false;
        await update(refDB, {...lines});
    }
    const handleMouseMove = () => {
        if (!isDrawing.current) return;
        const point = stageElm.getPointerPosition();
        let lastLine = lines[lines.length - 1];
        lastLine.points = lastLine.points.concat([point.x, point.y]);
        setLines(lines.concat());
    }

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
                <button id="clear" onClick={async () => {await remove(refDB)}}>Clear</button>
                <input
                    type={"number"}
                    value={strokeWidth}
                    onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
                />
            </div>

            <ColorPicker color={stroke} setColor={setStroke}/>

            <div id="toolBar">
                <button id="select">Select </button>
                <button id="draw">Draw</button>
                <button id="rubber">Rubber</button>
                <button id="cursor">Cursor</button>
                <button id="note">Note</button>
                <button id="image">Image</button>
                <button id="text">Text</button>
            </div>

            <div id="canvasContainer">
                <Stage
                    width={WIDTH}
                    height={HEIGHT}
                    onMouseDown={handleMouseDown}
                    onMousemove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    ref={stageRef}
                >
                    <Layer>
                        {lines.map((line, i) => (
                            <Line
                                key={i}
                                points={line.points}
                                stroke={line.options.stroke}
                                strokeWidth={line.options.strokeWidth}
                                bezier={true}
                                lineCap="round"
                                lineJoin="round"
                            />
                        ))}
                        <Transformer/>
                    </Layer>
                </Stage>

            </div>
        </div>
    );
};

export default Index;
