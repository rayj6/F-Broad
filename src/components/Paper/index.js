import React from "react";
import {Stage, Layer, Line, Transformer} from "react-konva";
import {
    onChildAdded,
    update,
    ref,
    remove,
    push,
    get,
} from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
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
            stroke: "#000000",
            strokeWidth: 5,
            lines: [],
            user: null,
        };
        this.stageRef = React.createRef();
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
                    <button id="undo">Undo</button>
                    `
                    <button id="clear">Clear</button>
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
                    <button id="select">Select</button>
                    <button id="draw">Draw</button>
                    <button id="eraser" onClick={() => {
                    }}>
                        eraser
                    </button>
                    <button id="cursor">Cursor</button>
                    <button id="note">Note</button>
                    <button id="image">Image</button>
                    <button id="text">Text</button>
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
                                    key={"line" + i}
                                    points={line.points}
                                    stroke={line.options.stroke}
                                    strokeWidth={line.options.strokeWidth}
                                    tension={0.5}
                                />
                            ))}
                            <Transformer/>
                        </Layer>
                    </Stage>
                </div>
            </div>
        );
    };
}

export default Index;
