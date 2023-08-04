document.getElementById("drawingCanvas").addEventListener("contextmenu", (event) => {
    event.preventDefault();

    const mouseX = event.clientX;
    const mouseY = event.clientY;

    console.log("rightclick on position x = " + mouseX + " y = " + mouseY);
    handleMoveEmoBox(mouseX, mouseY);
});

// EmoBox is short for emojis and comments
function handleMoveEmoBox(x, y) {
    const myObject = document.querySelector(".EmoBox");
    const currentTop = parseInt(myObject.style.top, 10) || 0;
    const currentLeft = parseInt(myObject.style.left, 10) || 0;

    // Update the object's position
    myObject.style.top = y + "px";
    myObject.style.left = x + "px";
}

function addEmo() {
    const text = emo.value;
    console.log(text);

    // context.font = "20px Arial";
    // context.fillStyle = "#fff";
    // const lines = text.split("\n");
    // const lineHeight = 25; // Adjust this value based on your preference
    // const initialY = 50; // Adjust this value to change the initial y-coordinate of the text
    // let currentY = initialY;

    // for (let i = 0; i < lines.length; i++) {
    //     context.fillText(lines[i], x + 8, y + 10);
    //     currentY += lineHeight;
    // }

    // textInput.value = ""; // Clear the input after adding text to the canvas
    // moveObject(-1000, -1000);

    // toggleMouse();
}
