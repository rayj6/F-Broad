import React from "react";
import {Stage, Layer, Line, Transformer} from "react-konva";
import {
    onValue,
    update,
    ref,
    set,
    // remove,
    push,
    child,
    // get,
} from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { Auth, Database } from "../../firebase.config";

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
            selectedElm: [],
            stroke: "#000000",
            strokeWidth: 5,
            lines: [],
            currentLine: {},
            user: null,
        };
        this.stageRef = React.createRef();
        this.clearRef = React.createRef();
        this.undoRef = React.createRef();

        this.selectRef = React.createRef();
        this.drawRef = React.createRef();
        this.eraserRef = React.createRef();
        this.cursorRef = React.createRef();
        this.lockRef = React.createRef();
        this.imageRef = React.createRef();
        this.textRef = React.createRef();
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
            stageElm.off("mousemove touchmove mouseup touchend");
            await update(this.refDB, {[currentLineKey]: this.state.currentLine});
            this.setState({currentLine: {}});
        });
    };
    selectMode = (e) => {
        const lineElm = e.target;
        const lockElm = this.lockRef.current;
        if(lineElm.attrs.lineKey !== undefined){
            lineElm.stroke("#ff0000");
            console.log(this.state.selectedElm);
            if(this.state.selectedElm.some((elm) => elm.attrs.lineKey === lineElm.attrs.lineKey)) return;
            this.setState({selectedElm  : [...this.state.selectedElm, lineElm]});
            lockElm.onclick = () => {
                this.state.selectedElm.forEach(async (elm) => {
                    elm.stroke("#000000");
                    await update(child(child(this.refDB, elm.attrs.lineKey),"properties"), {lock: true});
                })
                this.setState({selectedElm: []});
            }
        } else {
            this.state.selectedElm.forEach((elm) => {
                elm.stroke("#000000");
            })
            this.setState({selectedElm: []});
        }
    };
    clearBoard = async () => {
        const lines = this.state.lines;
        for(let key in lines){
            if(lines[key].properties.lock === false){
                lines[key] = null;
            }
        }
        set(this.refDB, lines);
    };
    componentDidMount = () => {
        //Event listener for elements
        const selectElm = this.selectRef.current;
        const drawElm = this.drawRef.current;
        const clearElm = this.clearRef.current;
        // console.log(selectElm);
        selectElm.onclick = () => this.changeMode(this.selectMode)
        drawElm.onclick = () => this.changeMode(this.drawMode)
        clearElm.onclick = () => this.clearBoard();

        //Event listener for firebase
        onValue(this.refDB, (snapshot) => {
            const data = snapshot.val() || {};
            this.setState({lines: data} );
        });

        onAuthStateChanged(Auth, (user) => {
            if (user !== null) {
                this.setState({user});
                this.changeMode(this.drawMode);
            } else {
                window.location.href = "/";
            }
        });
    };
    componentDidUpdate(prevProps, prevState, snapshot) {
        // if(prevState.lines !== this.state.lines) console.log(this.state.lines);
    }
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
                <div id="canvasContainer">
                    <Stage
                        width={window.innerWidth / 1}
                        height={window.innerHeight / 1}
                        ref={this.stageRef}
                    >
                        <Layer>
                            {/*{[...Object.values(this.state.lines), this.state.currentLine].map((line, i) => (*/}
                            {/*    <Line*/}
                            {/*        key={"line" + i}*/}
                            {/*        points={line.points}*/}
                            {/*        stroke={"#000000"}*/}
                            {/*        strokeWidth={5}*/}
                            {/*        tension={0.5}*/}
                            {/*    />*/}
                            {/*))}*/}
                            {
                                [...Object.entries(this.state.lines),
                                    ["currentLine", this.state.currentLine]
                                ].map(([key, value],i) => {
                                return (
                                    <Line
                                        lineKey={key}
                                        key={"line" + i}
                                        points={value.points}
                                        stroke={"#000000"}
                                        strokeWidth={5}
                                        tension={0.5}
                                    />
                                )
                            })
                            }
                            <Transformer

                            />
                        </Layer>
                    </Stage>
                </div>
            </div>
        );
    };
}

export default Index;
