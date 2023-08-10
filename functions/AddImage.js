const imageInput = document.getElementById("imageInput");
imageInput.addEventListener("change", handleImageUpload);

function handleImageUpload(event) {
    const imageFile = event.target.files[0];
    if (!imageFile) return;

    const image = new Image();
    image.src = URL.createObjectURL(imageFile);

    image.onload = function () {
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(image.src); // Clean up object URL to release memory
    };
}
