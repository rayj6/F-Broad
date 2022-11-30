// Add support for tablet and mobile

import React from "react";
import {Stage, Layer, Line, Rect} from "react-konva";
import {
    onValue,
    update,
    ref,
    set,
    push,
} from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { Auth, Database } from "../../firebase.config";
import simplify from "simplify-js";

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

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentLine: {
                properties: {
                    userId: null,
                    lock: false,
                },
                options: {
                    stroke: null,
                    strokeWidth: null,
                },
            },
            lines: {},
            selectedElm: [],
            stroke: "#000000",
            strokeWidth: 5,
            user: null,
        };
        this.stageRef = React.createRef();
        this.canvasContainerRef = React.createRef();
        this.layerRef = React.createRef();
        this.clearRef = React.createRef();
        this.undoRef = React.createRef();

        this.selectRef = React.createRef();
        this.drawRef = React.createRef();
        this.eraserRef = React.createRef();
        this.cursorRef = React.createRef();
        this.lockRef = React.createRef();
        this.unlockRef = React.createRef();
        this.imageRef = React.createRef();
        this.textRef = React.createRef();
        this.rectRef = React.createRef();
        this.refDB = ref(Database, "board");
    }
    changeMode = (mode) => {
        this.stageRef.current.off("mousedown");
        this.stageRef.current.on("mousedown", mode);
    };
    drawMode = async () => {
        const stageElm = this.stageRef.current;
        const {stroke, strokeWidth} = this.state;
        const stageCursorPos = stageElm.getPointerPosition();
        const currentLineKey = push(this.refDB).key;
        const currentLineValue = {
            properties: {
                userId: this.state.user.uid,
                lock: false,
            },
            options: {stroke, strokeWidth},
            points: [
                stageCursorPos.x,
                stageCursorPos.y,
                stageCursorPos.x,
                stageCursorPos.y,
            ]
        }
        this.setState({currentLine: currentLineValue});

        stageElm.on("mousemove touchmove", () => {
            const pos = stageElm.getPointerPosition();
            let currentLine = this.state.currentLine;
            if(currentLine.points === undefined) return;
            currentLine.points = currentLine.points.concat([pos.x, pos.y]);
            this.setState({currentLine});
        });

        stageElm.on("mouseup touchend", async () => {
            stageElm.off("mousedown touchdown mousemove touchmove mouseup touchend");
            let currentLine = this.state.currentLine;
            let simplifyPoint = [];
            for(let i = 0; i < currentLine.points.length; i += 2) {
                simplifyPoint.push({x: currentLine.points[i], y: currentLine.points[i + 1]});
            }
            simplifyPoint = simplify(simplifyPoint, 1, true);
            currentLine.points = simplifyPoint.map((point) => [point.x, point.y]).flat();
            await update(this.refDB, {[currentLineKey]: currentLine});
            this.setState({currentLine: {
                properties: {
                    userId: this.state.user.uid,
                    lock: false,
                },
                options: {
                    stroke: this.state.stroke,
                    strokeWidth: this.state.strokeWidth,
                }
            }});
            stageElm.on("mousedown touchdown", this.drawMode);
        });
    };
    selectMode = () => {
        const stageElm = this.stageRef.current;
        const rectElm = this.rectRef.current;
        const layerElm = this.layerRef.current;
        let x1, y1, x2, y2;
        x1 = x2 = stageElm.getPointerPosition().x;
        y1 = y2 = stageElm.getPointerPosition().y;
        rectElm.visible(true);
        rectElm.width(0);
        rectElm.height(0);
        stageElm.on("mousemove touchmove", () => {
            rectElm.visible(true);
            x2 = stageElm.getPointerPosition().x;
            y2 = stageElm.getPointerPosition().y;
            rectElm.setAttrs({
                x: Math.min(x1, x2),
                y: Math.min(y1, y2),
                width: Math.abs(x2 - x1),
                height: Math.abs(y2 - y1),
            });
        })
        stageElm.on("mouseup touchend", () => {
            stageElm.off("mousemove touchmove mouseup touchend mouseout");
            const selectedElm = layerElm.getChildren((node) => {
                    const linePos = node.getClientRect();
                    return node.getClassName() === "Line" && (
                        linePos.x < Math.max(x1, x2) &&
                        linePos.x + linePos.width > Math.min(x1, x2) &&
                        linePos.y < Math.max(y1, y2) &&
                        linePos.y + linePos.height > Math.min(y1, y2)
                    )
                }
            );

            this.state.selectedElm.forEach((elm) => {
                elm.stroke("#000000");
            });

            selectedElm.forEach((elm) => {
                elm.attrs.stroke = "#ff0000";
            })
            rectElm.visible(false);
            this.setState({selectedElm});
        })
    };

    clearBoard = async () => {
        const lines = this.state.lines;
        for(let key in lines){
            if(lines[key].properties.lock === false){
                lines[key] = null;
            }
        }
        await set(this.refDB, lines);
    };
    componentDidMount = () => {
        //Event listener for elements
        const stageElm = this.stageRef.current;
        const selectElm = this.selectRef.current;
        const canvasContainerElm = this.canvasContainerRef.current;
        const drawElm = this.drawRef.current;
        const lockElm = this.lockRef.current;
        const unlockElm = this.unlockRef.current;
        const clearElm = this.clearRef.current;
        selectElm.onclick = () => this.changeMode(this.selectMode)
        drawElm.onclick = () => this.changeMode(this.drawMode)
        clearElm.onclick = () => this.clearBoard();
        lockElm.onclick = async () => {
            if(this.state.selectedElm.length === 0) return;
            const lines = this.state.lines;
            this.state.selectedElm.forEach((elm) => {
                lines[elm.attrs.lineKey].properties.lock = true;
            })
            await update(this.refDB, lines);
        }
        unlockElm.onclick = async () => {
            if(this.state.selectedElm.length === 0) return;
            const lines = this.state.lines;
            this.state.selectedElm.forEach((elm) => {
                lines[elm.attrs.lineKey].properties.lock = false;
            })
            await update(this.refDB, lines);
        }
        
        //Event listener for firebase
        onValue(this.refDB, (snapshot) => {
            const data = snapshot.val() || {};
            this.setState({lines: data});
        });
        stageElm.width(canvasContainerElm.offsetWidth);
        stageElm.height(canvasContainerElm.offsetHeight);
        // stageElm.scale({ x: canvasContainerElm.offsetWidth, y: canvasContainerElm.offsetHeight });

        onAuthStateChanged(Auth, (user) => {
            if (user !== null) {
                this.setState({user});
                this.changeMode(this.drawMode);
            } else {
                window.location.href = "/";
            }
        });
    };

    render = () => {
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
                    <button ref={this.undoRef}>Undo</button>
                    <button ref={this.clearRef}>Clear</button>
                    <button ref={this.lockRef}>Lock</button>
                    <button ref={this.unlockRef}>Unock</button>
                    <input
                        type={"number"}
                        value={this.state.strokeWidth}
                        onChange={(e) =>
                            this.setState({strokeWidth: parseInt(e.target.value)})
                        }
                    />
                </div>
                <ColorPicker
                    color={this.state.stroke}
                    setColor={(color) => this.setState({stroke: color})}
                />
                <div id="toolBar">
                    <button ref={this.selectRef}>Select</button>
                    <button ref={this.drawRef}>Draw</button>
                    <button ref={this.eraserRef}>Eraser</button>
                    <button ref={this.cursorRef}>Cursor</button>
                    <button id="note">Note</button>
                    <button ref={this.imageRef}>Image</button>
                    <button ref={this.textRef}>Text</button>
                </div>
                <div id="canvasContainer" ref={this.canvasContainerRef}>
                    <Stage
                        width={window.innerWidth}
                        height={window.innerHeight}
                        ref={this.stageRef}
                    >
                        <Layer ref={this.layerRef}>
                            {
                                [...Object.entries(this.state.lines),
                                    ["currentLine", this.state.currentLine]
                                ].map(([key, value],i) => {
                                    return (
                                        <Line
                                            lineKey={key}
                                            key={"line" + i}
                                            points={value.points}
                                            stroke={this.state.selectedElm.some((elm) => elm.attrs.lineKey === key)? "red" : value.options.stroke}
                                            strokeWidth={5}
                                            tension={0.5}
                                        />
                                    )
                                })
                            }
                            <Rect
                                fill={'rgba(0,0,255,0.5)'}
                                visible={false}
                                ref={this.rectRef}
                            />
                        </Layer>
                    </Stage>
                </div>
            </div>
        );
    };
}

export default Index;