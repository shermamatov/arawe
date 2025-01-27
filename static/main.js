const canvas = document.createElement("canvas");
const width = (canvas.width = document.body.clientWidth);
const height = (canvas.height = document.body.clientHeight);
document.body.append(canvas);
const ctx = canvas.getContext("2d");
// ctx.imageSmoothingQuality = "high"
ctx.imageSmoothingEnabled = false;
ctx.scale(4, 4);

let msgType;

const player = {
    x: 128,
    y: 128,
    speed: 1,
    textures: [],
    stay: [],
    frame: 0,
};

const enemy = {
    x: 256,
    y: 128,
    speed: 1,
    textures: [],
    frame: 0,
};

for (let i = 0; i < 5; i++) {
    const image = new Image();
    image.src = "/static/img/" + i + ".png";
    player.stay.push(image);
}

for (let i = 1; i < 8; i++) {
    const img = new Image();
    img.src = "/static/img/p" + i + ".png";
    player.textures.push(img);
    // enemy.textures.push(img)
}
const image = new Image();
image.src = "/static/img/Tree.png";
enemy.textures[0] = image;
// console.log(width, height)

const movement = {
    forward: false,
    backward: false,
    left: false,
    right: false,
};

function send_vector() {}

function render() {
    // console.log(player.textures)
    ctx.fillStyle = "#1f1f1f";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#0fef7f";
    if (
        movement.forward ||
        movement.backward ||
        movement.left ||
        movement.right
    )
        ctx.drawImage(
            player.textures[player.frame % 7],
            player.x,
            player.y,
            32,
            32
        );
    else
        ctx.drawImage(
            player.stay[player.frame % 5],
            player.x,
            player.y,
            32,
            32
        );
    ctx.drawImage(enemy.textures[0], enemy.x, enemy.y, 64, 64);
}

const socket = new WebSocket("ws://" + document.location.host);

// socket.addEventListener("open", (event) => {});

socket.addEventListener("message", (event) => {
    // [msgType, x, y] = event.data.split(' ');

    render();
});

document.addEventListener("keydown", (event) => {
    switch (event.code) {
        case "KeyW":
            movement.forward = true;
            // socket.send("move_forward")
            break;
        case "KeyA":
            movement.left = true;
            // socket.send("move_left")
            break;
        case "KeyS":
            movement.backward = true;
            // socket.send("move_backward")
            break;
        case "KeyD":
            // socket.send("move_right")
            movement.right = true;
            break;
    }
});

document.addEventListener("keyup", (event) => {
    switch (event.code) {
        case "KeyW":
            movement.forward = false;
            // socket.send("move_forward")
            break;
        case "KeyA":
            movement.left = false;
            // socket.send("move_left")
            break;
        case "KeyS":
            movement.backward = false;
            // socket.send("move_backward")
            break;
        case "KeyD":
            // socket.send("move_right")
            movement.right = false;
            break;
    }
});

function move() {
    if (movement.forward) player.y -= player.speed;
    if (movement.backward) player.y += player.speed;
    if (movement.left) player.x -= player.speed;
    if (movement.right) player.x += player.speed;
}

setInterval(() => {
    render();
    move();
}, 16);

setInterval(() => {
    player.frame += 1;
    // if (movement.forward || movement.backward || movement.left || movement.right) {
    //   if (player.frame > 7)
    //     player.frame = 0
    // } else {
    //   if (player.frame > 5)
    //     player.frame = 0
}, 100);
