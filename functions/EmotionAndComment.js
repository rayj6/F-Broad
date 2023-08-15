let a = 0;
let b = 0;

document.getElementById("drawingCanvas").addEventListener("contextmenu", (event) => {
    event.preventDefault();

    const mouseX = event.clientX;
    const mouseY = event.clientY;

    a = mouseX;
    b = mouseY;

    console.log("rightclick on position x = " + mouseX + " y = " + mouseY);
    handleMoveEmoBox(mouseX, mouseY);
});

function handleMoveEmoBox(x, y) {
    const myObject = document.querySelector(".EmoBox");
    myObject.style.top = y + "px";
    myObject.style.left = x + "px";
}

function moveEmoBox(x, y) {
    const myObject = document.querySelector(".EmoBox");

    // Update the object's position
    myObject.style.top = y + "px";
    myObject.style.left = x + "px";

    window.addEventListener("click", () => {
        window.removeEventListener("mousemove", getMouseLocation);
    });
}

function addEmo(emoji) {
    const text = emoji;

    context.font = "20px Arial";
    context.fillStyle = "#fff";
    const lines = text.split("\n");
    const lineHeight = 25; // Adjust this value based on your preference
    const initialY = 50; // Adjust this value to change the initial y-coordinate of the text
    let currentY = initialY;

    for (let i = 0; i < lines.length; i++) {
        context.fillText(lines[i], a - 40, b - 10);
        currentY += lineHeight;
    }

    textInput.value = ""; // Clear the input after adding text to the canvas

    toggleMouse();
}

function addComment() {
    const text = document.getElementById("comment").value;

    if (text.trim() !== "") {
        context.font = "20px Arial";
        context.fillStyle = "#fff";
        const lines = text.split("\n");
        const lineHeight = 25; // Adjust this value based on your preference
        const initialY = 50; // Adjust this value to change the initial y-coordinate of the text
        let currentY = initialY;

        for (let i = 0; i < lines.length; i++) {
            context.fillText(lines[i], a - 8, b - 10);
            currentY += lineHeight;
        }

        textInput.value = ""; // Clear the input after adding text to the canvas
        moveEmoBox(-1000, -1000);
    }

    toggleMouse();
}
