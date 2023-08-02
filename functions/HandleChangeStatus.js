function handleControlContainerStatus() {
    const controlContainer = document.querySelector(".controlContainer");

    // Check if the element has the "controlContainer-inactive" class
    if (controlContainer.classList.contains("controlContainer-inactive")) {
        // Switch to "controlContainer-active" class and remove "controlContainer-inactive" class
        controlContainer.classList.remove("controlContainer-inactive");
        controlContainer.classList.add("controlContainer-active");
    } else {
        // Switch to "controlContainer-inactive" class and remove "controlContainer-active" class
        controlContainer.classList.remove("controlContainer-active");
        controlContainer.classList.add("controlContainer-inactive");
    }
}

function changeCursorToMouse() {
    document.body.style.cursor = 'url("../assets/board/mouse-active.svg"), auto';
}

function changeCursorToBrush() {
    document.body.style.cursor = 'url("../assets/board/brush-active.svg"), auto';
}

function changeCursorToText() {
    document.body.style.cursor = "text";
}
