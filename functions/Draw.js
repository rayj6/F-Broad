function initializeDrawing() {
    document.body.style.cursor = 'url("../assets/board/pen-active.svg") 5 35, auto';
    const canvas = document.getElementById("drawingCanvas");
    const ctx = canvas.getContext("2d");

    let isDrawing = false;
    let isOverButton = false; // Flag to indicate if the pointer is over the button
    let lastX = 0;
    let lastY = 0;
    let brushSize = 2; // Default brush size
    let brushColor = "#d9d9d9"; // Default brush color

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function draw(e) {
        if (!isDrawing || isOverButton) return; // Stop drawing if isOverButton is true
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.clientX, e.clientY);
        ctx.strokeStyle = brushColor;
        ctx.lineWidth = brushSize;
        ctx.lineCap = "round";
        ctx.stroke();
        [lastX, lastY] = [e.clientX, e.clientY];
    }

    function startDrawing(e) {
        isDrawing = true;
        [lastX, lastY] = [e.clientX, e.clientY];
    }

    function stopDrawing() {
        isDrawing = false;
    }

    function updateBrushSize(size) {
        brushSize = size;
    }

    function updateBrushColor(color) {
        brushColor = color;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseout", stopDrawing);

    return {
        updateBrushSize,
        updateBrushColor,
    };
}
