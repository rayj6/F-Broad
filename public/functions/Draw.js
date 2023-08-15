let canvas = document.getElementById("drawingCanvas");
let context = canvas.getContext("2d");
let isDrawing = false;
let isErasing = false;
let isMouseDisabled = false;

// Get the elements
const selectStrokeSize = document.getElementById("selectStrokeSize");
const selectColorButtons = document.querySelectorAll("#selectColor button");

// Set initial values
let brushColor = "#d9d9d9";
let brushSize = parseInt(selectStrokeSize.value);

// Add event listener to stroke size dropdown
selectStrokeSize.addEventListener("change", (event) => {
    brushSize = parseInt(event.target.value);
});

// Add event listeners to color buttons
selectColorButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
        brushColor = getComputedStyle(event.target).backgroundColor;
    });
});

function toggleDraw() {
    isDrawing = !isDrawing;
    isErasing = false;
    isMouseDisabled = false;
    context.lineCap = "round";
    document.body.style.cursor = 'url("../assets/board/pen-active.svg") 5 35, auto';
}

function toggleErase() {
    isErasing = !isErasing;
    isDrawing = false;
    isMouseDisabled = false;
    context.lineCap = "round";
    document.body.style.cursor = 'url("../assets/board/eraser-active.svg") 5 35, auto';
}

function toggleBrush() {
    isDrawing = false;
    isErasing = false;
    isMouseDisabled = false;
    context.lineCap = "butt";
    document.body.style.cursor = 'url("../assets/board/brush-active.svg") 5 35, auto';
}

function toggleMouse() {
    isMouseDisabled = !isMouseDisabled;
    isDrawing = false;
    isErasing = false;
    context.lineCap = "round";
    document.body.style.cursor = 'url("../assets/board/mouse-active.svg") 5 35, auto';
}

function draw(event) {
    if ((isDrawing || context.lineCap === "butt") && !isMouseDisabled) {
        context.lineWidth = brushSize;
        context.strokeStyle = brushColor;
        context.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
        context.stroke();
        context.beginPath();
        context.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
    }
}

function erase(event) {
    if (isErasing && !isMouseDisabled) {
        context.lineWidth = 25;
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
    } else if (context.lineCap === "butt") {
        // Check if the brush mode is active
        canvas.addEventListener("mousemove", draw); // Use the same draw function for brush
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
