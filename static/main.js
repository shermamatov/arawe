const canvas = document.createElement("canvas");
const width = (canvas.width = document.body.clientWidth);
const height = (canvas.height = document.body.clientHeight);
document.body.append(canvas);
const ctx = canvas.getContext("2d");

let msgType, x, y;
console.log(width, height);

function render() {
    ctx.fillStyle = "#0f0f0f";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#0fef7f";
    ctx.fillRect(x - 8, y - 8, 16, 16);
}

const socket = new WebSocket("ws://" + document.location.host);

// socket.addEventListener("open", (event) => {});

socket.addEventListener("message", (event) => {
    [msgType, x, y] = event.data.split(" ");
    render();
});

document.addEventListener("keypress", (event) => {
    switch (event.key) {
        case "w":
            socket.send("move_forward");
            break;
        case "a":
            socket.send("move_left");
            break;
        case "s":
            socket.send("move_backward");
            break;
        case "d":
            socket.send("move_right");
            break;
    }
});
