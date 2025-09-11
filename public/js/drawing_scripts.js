const canvas = document.getElementById("drawing_canvas");
const context = canvas.getContext("2d");

let drawing = false;
let x = 0;
let y = 0;
const rect = canvas.getBoundingClientRect();
context.fillStyle = "white";
context.fillRect(0, 0, canvas.width, canvas.height);

canvas.addEventListener('mousedown', (event) =>{
    drawing = true;
    x = event.clientX - rect.x;
    y = event.clientY - rect.y;
})

canvas.addEventListener('mousemove', (event) => {
    canvas.style.cursor = 'crosshair';
    if (!drawing) return;

    console.log(event.clientX, event.clientY);

    context.beginPath();
    context.lineWidth = 5;
    context.strokeStyle = 'black';
    context.lineCap = 'round';
    context.moveTo(x, y);
    x = event.clientX - rect.x;
    y = event.clientY - rect.y;
    context.lineTo(x, y);
    context.stroke();
})

canvas.addEventListener('mouseup', (event) => {
    drawing = false;
})

function clear_canvas() {
   context.clearRect(0, 0, canvas.width, canvas.height);
   context.fillStyle = "white";
   context.fillRect(0, 0, canvas.width, canvas.height);
}