import React from "react";
import {Stage, Layer, Line} from "react-konva";
import {
    onChildAdded,
    update,
    ref,
    // remove,
    push,
    get,
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
            selectedNode: [],
            stroke: "#000000",
            strokeWidth: 5,
            lines: [],
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
    drawMode = () => {
        const stageElm = this.stageRef.current;
        const {stroke, strokeWidth} = this.state;
        const stageCursorPos = stageElm.getPointerPosition();
        const newLine = {
            property: {
                userId: this.state.user.uid,
            },
            options: {stroke, strokeWidth},
            points: [
                stageCursorPos.x,
                stageCursorPos.y,
                stageCursorPos.x,
                stageCursorPos.y,
            ],
        };
        this.setState({lines: [...this.state.lines, newLine]});
        stageElm.on("mousemove touchmove", () => {
            const pos = stageElm.getPointerPosition();
            const lines = this.state.lines;
            lines[lines.length - 1].points = lines[lines.length - 1].points.concat([
                pos.x,
                pos.y,
            ]);
            this.setState({lines});
        });
        stageElm.on("mouseup touchend", async () => {
            stageElm.off("mousemove touchmove");
            stageElm.off("mouseup touchend");
            const target = push(this.refDB).key;
            const lines = this.state.lines;
            await update(this.refDB, {[target]: lines[lines.length - 1]});
        });
    };
    clearBoard = () => {
        console.log(this.list.some((item) => item.lock === true));
    }
    selectMode = (e) => {
        const lineElm = e.target;
        const lockElm = this.lockRef.current;
        if(this.state.lines[lineElm.attrs.lineNumber] !== undefined){
            lineElm.stroke("red");
            this.setState({selectedNode: [...this.state.selectedNode, lineElm]});
        } else {
            // console.log(this.state.selectedNode);
            this.state.selectedNode.forEach((node) => {
                console.log(node);
            })
        }
    };
    componentDidMount = () => {
        get(this.refDB).then((snapshot) => {
            this.setState({lines: Object.values(snapshot.val() || {})});
        });
        onChildAdded(this.refDB, (snapshot) => {
            const data = snapshot.val();
            this.setState({lines: this.state.lines.concat([data])});
        });
        onAuthStateChanged(Auth, (user) => {
            if (user) {
                this.setState({user});
                this.changeMode(this.selectMode);
            } else {
                window.location.href = "/";
            }
        });

        // Add event listener
        const selectElm = this.selectRef.current;
        const drawElm = this.drawRef.current;
        const eraserElm = this.eraserRef.current;
        const cursorElm = this.cursorRef.current;
        const lockElm = this.lockRef.current;
        const imageElm = this.imageRef.current;
        const textElm = this.textRef.current;
        const clearElm = this.clearRef.current;
        const undoElm = this.undoRef.current;
        selectElm.addEventListener("click", () => this.changeMode(this.selectMode));
        drawElm.addEventListener("click", () => this.changeMode(this.drawMode));
        // eraserElm.addEventListener("click", () => this.changeMode(this.eraserMode));
        // cursorElm.addEventListener("click", () => this.changeMode(this.cursorMode));
        // lockElm.addEventListener("click", () => this.changeMode(this.lockMode));
        // imageElm.addEventListener("click", () => this.changeMode(this.imageMode));
        // textElm.addEventListener("click", () => this.changeMode(this.textMode));
        clearElm.addEventListener("click", () => this.clearBoard());
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
                            {this.state.lines.map((line, i) => (
                                <Line
                                    lineNumber={i}
                                    onClick={(e) => {
                                        this.setState({selectedNode: [e.target]});
                                    }}
                                    key={"line" + i}
                                    points={line.points}
                                    stroke={line.options.stroke}
                                    strokeWidth={line.options.strokeWidth}
                                    tension={0.5}
                                />
                            ))}
                        </Layer>
                    </Stage>
                </div>
            </div>
        );
    };
}

export default Index;
