let x = 0;
let y = 0;

function toggleText() {
    document.body.style.cursor = "default";
    window.addEventListener("mousemove", getMouseLocation);
    return;
}

function moveObject(x, y) {
    const myObject = document.querySelector(".addTextContainer");
    const currentTop = parseInt(myObject.style.top, 10) || 0;
    const currentLeft = parseInt(myObject.style.left, 10) || 0;

    // Update the object's position
    myObject.style.top = y + "px";
    myObject.style.left = x + "px";
}

function getMouseLocation(event) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    // console.log("Mouse X:", mouseX, "Mouse Y:", mouseY);
    moveObject(mouseX, mouseY);
    x = mouseX;
    y = mouseY;

    window.addEventListener("click", () => {
        window.removeEventListener("mousemove", getMouseLocation);
    });
}

function addCustomText() {
    const text = textInput.value;

    if (text.trim() !== "") {
        context.font = "20px Arial";
        context.fillStyle = "#fff";
        const lines = text.split("\n");
        const lineHeight = 25; // Adjust this value based on your preference
        const initialY = 50; // Adjust this value to change the initial y-coordinate of the text
        let currentY = initialY;

        for (let i = 0; i < lines.length; i++) {
            context.fillText(lines[i], x + 8, y + 10);
            currentY += lineHeight;
        }

        textInput.value = ""; // Clear the input after adding text to the canvas
        moveObject(-1000, -1000);
    }

    toggleMouse();
}
