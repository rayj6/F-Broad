function initializeEraser() {
    const canvas = document.getElementById("drawingCanvas");
    const ctx = canvas.getContext("2d");
    document.body.style.cursor = 'url("../assets/board/eraser-active.svg") 5 35, auto';

    let isErasing = false;

    function erase(e) {
        if (!isErasing) return;
        ctx.globalCompositeOperation = "destination-out"; // Use "destination-out" to create the eraser effect
        ctx.beginPath();
        ctx.arc(e.clientX, e.clientY, 50, 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalCompositeOperation = "source-over"; // Reset the composite operation back to "source-over" for regular drawing
    }

    function startErasing(e) {
        isErasing = true;
    }

    function stopErasing() {
        isErasing = false;
    }

    canvas.addEventListener("mousedown", startErasing);
    canvas.addEventListener("mousemove", erase);
    canvas.addEventListener("mouseup", stopErasing);
    canvas.addEventListener("mouseout", stopErasing);
}
