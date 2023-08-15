let canvas = document.getElementById("drawingCanvas");
let context = canvas.getContext("2d");
let isDrawing = false;
let isErasing = false;
let isMouseDisabled = false;

function toggleDraw() {
    isDrawing = !isDrawing;
    isErasing = false;
    isMouseDisabled = false;
    document.body.style.cursor = 'url("../assets/board/pen-active.svg") 5 35, auto';
}

function toggleErase() {
    isErasing = !isErasing;
    isDrawing = false;
    isMouseDisabled = false;
    document.body.style.cursor = 'url("../assets/board/eraser-active.svg") 5 35, auto';
}

function toggleMouse() {
    isMouseDisabled = !isMouseDisabled;
    isDrawing = false;
    isErasing = false;
    document.body.style.cursor = 'url("../assets/board/mouse-active.svg") 5 35, auto';
}

function draw(event) {
    if (isDrawing && !isMouseDisabled) {
        context.lineWidth = 15;
        context.lineCap = "round";
        context.strokeStyle = "#d9d9d9";
        context.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
        context.stroke();
        context.beginPath();
        context.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
    }
}

function erase(event) {
    if (isErasing && !isMouseDisabled) {
        context.lineWidth = 25;
        context.lineCap = "round";
        context.strokeStyle = "#1f1f1f";
        context.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
        context.stroke();
        context.beginPath();
        context.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
    }
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

canvas.addEventListener("mousedown", (event) => {
    context.beginPath();
    context.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
    if (isDrawing) {
        canvas.addEventListener("mousemove", draw);
    } else if (isErasing) {
        canvas.addEventListener("mousemove", erase);
    }
});

canvas.addEventListener("mouseup", () => {
    canvas.removeEventListener("mousemove", draw);
    canvas.removeEventListener("mousemove", erase);
});

// Handle canvas resizing
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas(); // Set initial canvas size
